(function () {
  "use strict";
  var InputDataValidator = (function() {
    var InputDataValidator = function(_params) {
      var params = _params;
      var moment = require("moment");
      var validator = require("validator");
      var BLACKLISTED_CHARACTERS = /[`´'";{}<>]+/gi;
      var validationErrors = [];
      var optionalFields = params.optionalFields || [];

      // validators
      var ProductValidator = require("../lib/product.validator");
      var PaymentValidator = require("../lib/payment.validator");
      var ConsumerValidator = require("../lib/consumer.validator");
      var OrderValidator = require("../lib/order.validator");
      var UrlValidator = require("../lib/url.validator");
      var ShippingAddressValidator = require("../lib/shipping.address.validator");

      function isMandatory(fieldPath) {
        var parent = fieldPath.split(".")[0];
        var isOptional = optionalFields.indexOf(parent) !== -1 || optionalFields.indexOf(fieldPath) !== -1;
        return !isOptional;
      }

      function isOptional(fieldPath) {
        return !isMandatory(fieldPath);
      }

      function optionalFieldsFor(objectName) {
        // ['product.quantity', etc]
        return optionalFields.filter(function(elem) {
          return new RegExp("^" + objectName, "g").test(elem);
        })
        // ['quantity', etc]
        .map(function(elem) {
          return elem.split(".")[1];
        });
      }

      function validatePayment(payment) {
        if(payment) {
          var params = {
            payment: payment,
            optionalFields: optionalFieldsFor("payment")
          };
          validationErrors = validationErrors.concat(new PaymentValidator(params).validate());
        } else {
          if(isMandatory("payment")) {
            validationErrors = validationErrors.concat({
              message: "Payment is mandatory",
              translationKey: "invalid.payment",
              elementName: "payment",
              value: null
            });
          }
        }
      }

      function validateConsumer(consumer) {
        if(consumer) {
          var params = {
            consumer: consumer,
            optionalFields: optionalFieldsFor("consumer")
          };
          validationErrors = validationErrors.concat(new ConsumerValidator(params).validate());
        } else {
          if(isMandatory("consumer")) {
            validationErrors = validationErrors.concat({
              message: "Consumer is mandatory",
              translationKey: "invalid.consumer",
              elementName: "consumer",
              value: null
            });
          }
        }
      }

      function validateShippingAddress(shippingAddress) {
        if(shippingAddress) {
          var params = {
            shippingAddress: shippingAddress,
            optionalFields: optionalFieldsFor("shippingAddress")
          };
          validationErrors = validationErrors.concat(new ShippingAddressValidator(params).validate());
        } else {
          if(isMandatory("shippingAddress")) {
            validationErrors = validationErrors.concat({
              message: "ShippingAddress is mandatory",
              translationKey: "invalid.shippingAddress",
              elementName: "shippingAddress",
              value: null
            });
          }
        }
      }


      function validateOrder(order) {
        if(order) {
          var params = {
            order: order,
            optionalFields: optionalFieldsFor("order")
          };
          var orderValidationErrors = new OrderValidator(params).validate();
          validationErrors = validationErrors.concat(orderValidationErrors);
        } else {
          if(isMandatory("order")) {
            validationErrors = validationErrors.concat({
              value: "Order is mandatory",
              message: "Invalid order",
              translationKey: "invalid.order"
            });
          }
        }
      }

      function validateExtraRecursive(extra) {
        for (var key in extra) {
          if (extra[key] && typeof extra[key] !== "object" &&
            (key.match(BLACKLISTED_CHARACTERS) || extra[key].match(BLACKLISTED_CHARACTERS))) {
            validationErrors.push({
              value: "Extra is not URL encoded. Offending key or value: " + encodeURIComponent(key),
              message: "Invalid extra",
              translationKey: "invalid.extra"
            });
          } else if(extra[key] && typeof extra[key] === "object") {
            validateExtraRecursive(extra[key]);
          }
        }
      }

      function validateExtra(extra) {
        if(extra) {
          validateExtraRecursive(extra);
        } else {
          if(isMandatory("extra")) {
            validationErrors.push({
              value: "Extra is mandatory",
              message: "Invalid extra",
              translationKey: "invalid.extra"
            });
          }
        }
      }

      function validateProducts(products) {
        if(products) {
          var productOptionalFields = optionalFieldsFor("products");
          for(var i = 0; i < products.length; i++) {
            var params = {
              product: products[i],
              optionalFields: productOptionalFields
            };
            validationErrors = validationErrors.concat(new ProductValidator(params).validate());
          }
        }
      }

      function validateUrl(urlContainerObject, urlContainerName, urlKey) {
        if (urlContainerObject[urlKey]) {
          if (!new UrlValidator({ url: urlContainerObject[urlKey] }).validate()) {
            validationErrors = validationErrors.concat({
              value: urlContainerObject[urlKey],
              message: "Invalid " + urlContainerName + " " + urlKey + " url. Make sure you are using https protocol.",
              translationKey: "invalid." + urlContainerName + "." + urlKey
            });
          }
        } else {
          if (isMandatory(urlContainerName + "." + urlKey)) {
            validationErrors = validationErrors.concat({
              value: urlContainerName.charAt(0).toUpperCase() + urlContainerName.slice(1) + " are mandatory",
              message: "Invalid " + urlContainerName + " " + urlKey + " url",
              translationKey: "invalid." + urlContainerName + "." + urlKey
            });
          }
        }
      }

      function validateCallbacks(callbacks) {
        var urlContainerName = "callbacks";
        if (!callbacks && isOptional(urlContainerName)) {
          return;
        } else {
          if (callbacks) {
            validateUrl(callbacks, urlContainerName, "success");
            validateUrl(callbacks, urlContainerName, "failed");
            validateUrl(callbacks, urlContainerName, "chargeback");
            validateUrl(callbacks, urlContainerName, "processing");
          } else {
            validationErrors = validationErrors.concat({
              value: urlContainerName.charAt(0).toUpperCase() + urlContainerName.slice(1) + " are mandatory",
              message: "Invalid " + urlContainerName,
              translationKey: "invalid." + urlContainerName
            });
          }
        }
      }

      function validateReturnUrls(returnUrls) {
        var urlContainerName = "returnUrls";
        if (!returnUrls && isOptional(urlContainerName)) {
          return;
        } else {
          if (returnUrls) {
            validateUrl(returnUrls, urlContainerName, "success");
            validateUrl(returnUrls, urlContainerName, "cancel");
            validateUrl(returnUrls, urlContainerName, "failed");
          } else {
            validationErrors = validationErrors.concat({
              value: urlContainerName.charAt(0).toUpperCase() + urlContainerName.slice(1) + " are mandatory",
              message: "Invalid " + urlContainerName,
              translationKey: "invalid." + urlContainerName
            });
          }
        }
      }

      return {
        validate: function() {
          validationErrors = [];
          if(!params.payment) {
            params.payment = {};
          }
          if(!params.payment.locale) {
            params.payment.locale = "en-US";
          }
          if(!params.returningConsumer) {
            validatePayment(params.payment);
          }
          validateConsumer(params.consumer);
          validateShippingAddress(params.shippingAddress);
          validateOrder(params.order);
          validateExtra(params.extra);
          validateProducts(params.products);
          validateCallbacks(params.callbacks);
          validateReturnUrls(params.returnUrls);
          return validationErrors;
        },
        validateForm: function() {
          validationErrors = [];
          validateConsumer(params.consumer);
          validatePayment(params.payment);
          return validationErrors;
        }
      };
    };
    if (typeof window === "undefined") {
      module.exports = InputDataValidator;
    } else {
      window.InputDataValidator = InputDataValidator;
    }
  })();
}());
