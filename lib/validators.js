(function () {
  "use strict";

  var validator = require("validator");
  var blacklistedCharacters = "'\";{}";

  function sanitizeForValidation(value) {
    // returns undefined as undefined for validation
    return value ? validator.stripLow(value).replace(/ /g, "") : value;
  }

  exports.InputDataValidator = function(params) {
    //console.log("validating params:" + JSON.stringify(params));
    var numbersHexanumbersDotAndSemicolon = /^[0-9a-fA-F.:]+$/i;
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
      if(!validator.isEmail(payment.cardHolderEmail + "")) {
        validationErrors.push({
          message: "Invalid payment card holder email",
          translationKey: "invalid.payment.cardHolderEmail",
          value: payment.cardHolderEmail
        });
      }
    }

    function validateConsumer(consumer) {
      var name = sanitizeForValidation(consumer.name);
      if(!name ||
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

    function validateCents(params) {
      if(!validator.isInt(params.value + "", { min: 0, max: Number.MAX_SAFE_INTEGER })) {
        validationErrors.push({
          message: params.message,
          translationKey: params.translationKey,
          value: params.value
        });
      }
    }

    function validateOrder(order) {
      validateCents({
        value: order.sumInCentsIncVat,
        message: "Invalid sum in cents including VAT",
        translationKey: "invalid.order.sumInCentsIncVat"
      });
      validateCents({
        value: order.sumInCentsExcVat,
        message: "Invalid sum in cents excluding VAT",
        translationKey: "invalid.order.sumInCentsExcVat",
      });
      validateCents({
        value: order.vatInCents,
        message: "Invalid VAT in cents excluding VAT",
        translationKey: "invalid.order.vatInCents",
      });
    }

    function validateSeller(seller) {
    }

    function validateProducts(products) {
    }

    function validateCallbacks(callbacks) {
    }

    return {
      validate: function() {
        //console.log(JSON.stringify(params, null, 2));
        validationErrors = [];
        if(!params.payment.locale) {
          params.payment.locale = "en-US";
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
