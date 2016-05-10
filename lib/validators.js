(function () {
  "use strict";
  var InputDataValidator = (function() {
    var InputDataValidator = function(params) {
      var moment = require("moment");
      var validator = require("validator");
      var BLACKLISTED_CHARACTERS = /[`'";{}<>]+/gi;
      var validationErrors = [];
      var optionalFields = params.optionalFields || [];

      // validators
      var ProductValidator = require("../lib/product.validator");
      var PaymentValidator = require("../lib/payment.validator");
      var ConsumerValidator = require("../lib/consumer.validator");
      var OrderValidator = require("../lib/order.validator");

      function isMandatory(fieldPath) {
        var parent = fieldPath.split(".")[0];
        var isOptional = optionalFields.indexOf(parent) !== -1 || optionalFields.indexOf(fieldPath) !== -1;
        return !isOptional;
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

      function validateSeller(seller) {
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

      function validateCallbacks(callbacks) {
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
          validateOrder(params.order);
          validateSeller(params.seller);
          validateProducts(params.products);
          validateCallbacks(params.callbacks);
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
