(function () {
  "use strict";

  var validator = require("validator");

  function sanitizeForValidation(value) {
    // returns undefined as undefined for validation
    return value ? validator.stripLow(value).replace(/ /g, "") : value;
  }

  exports.InputDataValidator = function(params) {
    var numbersHexanumbersDotAndSemicolon = /^[0-9a-fA-F.:]+$/i;
    var integer = /^[0-9]+$/i;
    var asciiInteger = /^[a-zA-Z0-9]+$/i;
    var validationErrors = [];

    function validatePayment(payment) {
      if(!validator.isIP(payment.ip)) {
        validationErrors.push({
          message: "Invalid payment IP address",
          translationKey: "invalid.payment.ip.address",
          value: payment.ip
        });
      }
    }

    function validateConsumer(consumer) {
      if(!validator.isEmail(consumer.email + "")) {
        validationErrors.push({
          message: "Invalid consumer email address",
          translationKey: "invalid.consumer.email.address",
          value: consumer.email
        });
      }
      var name = sanitizeForValidation(consumer.name);
      if(!name ||
          !validator.isAlphanumeric(name, (consumer.locale || "en-US")) ||
          name.length < 2 ||
          name.length > 52) {
        validationErrors.push({
          message: "Invalid consumer name",
          translationKey: "invalid.consumer.name",
          value: consumer.name
        });
      }
      if(consumer.co && consumer.co.length > 52) {
        validationErrors.push({
          message: "Invalid consumer c/o",
          translationKey: "invalid.consumer.co",
          value: consumer.co
        });
      }
      var streetAddress = sanitizeForValidation(consumer.streetAddress);
      if(!streetAddress ||
          streetAddress.length < 2 ||
          streetAddress.length > 52) {
        validationErrors.push({
          message: "Invalid consumer street address",
          translationKey: "invalid.consumer.streetAddress",
          value: consumer.streetAddress
        });
      }
      if(consumer.streetAddress2 && consumer.streetAddress2.length > 52) {
        validationErrors.push({
          message: "Invalid consumer street address 2",
          translationKey: "invalid.consumer.streetAddress2",
          value: consumer.streetAddress2
        });
      }
      var postalCode = sanitizeForValidation(consumer.postalCode);
      if(!postalCode ||
          postalCode.length < 2 ||
          postalCode.length > 10) {
        validationErrors.push({
          message: "Invalid consumer postal code",
          translationKey: "invalid.consumer.postalCode",
          value: consumer.postalCode
        });
      }
      var city = sanitizeForValidation(consumer.city);
      if(!city ||
          city.length < 2 ||
          city.length > 53) {
        validationErrors.push({
          message: "Invalid consumer city",
          translationKey: "invalid.consumer.city",
          value: consumer.city
        });
      }
      if(consumer.stateOrProvince && consumer.stateOrProvince.length > 52) {
        validationErrors.push({
          message: "Invalid consumer state or province",
          translationKey: "invalid.consumer.stateOrProvince",
          value: consumer.stateOrProvince
        });
      }
      var country = sanitizeForValidation(consumer.country);
      if(!country ||
          country.length < 2 ||
          country.length > 53) {
        validationErrors.push({
          message: "Invalid consumer country",
          translationKey: "invalid.consumer.country",
          value: consumer.country
        });
      }
    }

    function validateOrder(order) {
    }

    function validateSeller(seller) {
    }

    function validateProducts(products) {
    }

    function validateCallbacks(callbacks) {
    }

    return {
      validate: function() {
        //console.log("params:" + JSON.stringify(params));
        validationErrors = [];
        if(!params.consumer.locale) {
          params.consumer.locale = "en-US";
        }
        validatePayment(params.payment);
        validateConsumer(params.consumer);
        validateOrder(params.order);
        validateSeller(params.seller);
        validateProducts(params.products);
        validateCallbacks(params.callbacks);
        return validationErrors;
      }
    };
  };
}());
