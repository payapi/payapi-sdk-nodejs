(function () {
  "use strict";
  var PaymentValidator = (function() {
    var PaymentValidator = function(params) {
      var validator = require("validator");
      var validationErrors = [];
      var payment = params.payment;
      var optionalFields = params.optionalFields || [];
      var moment = require("moment");
      var BLACKLISTED_CHARACTERS = /[`'";{}<>]+/gi;
      var SAFE_CHARACTERS = /^[a-z_]*$/;

      function isOptional(field) {
        return optionalFields.indexOf(field) !== -1;
      }

      function sanitizeForValidation(value) {
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : value + "";
        return value;
      }

      function validateIpAddress() {
        if(!isOptional("ip") && !validator.isIP(payment.ip)) {
          validationErrors.push({
            message: "Invalid payment IP address",
            translationKey: "invalid.payment.ip.address",
            elementName: "payment[ip]",
            value: payment.ip
          });
        }
      }

      function validateCardHolderEmail() {
        if(!isOptional("cardHolderEmail") &&
          !validator.isEmail(payment.cardHolderEmail + "")) {
          validationErrors.push({
            message: "Invalid payment card holder email",
            translationKey: "invalid.payment.cardHolderEmail",
            elementName: "payment[cardHolderEmail]",
            value: payment.cardHolderEmail
          });
        }
      }

      function validateCardHolderName() {
        var cardHolderName = sanitizeForValidation(payment.cardHolderName);
        if(!isOptional("cardHolderName")) {
          if(!payment.cardHolderName ||
              cardHolderName.length < 2 ||
              cardHolderName.length > 52 ||
              cardHolderName.match(BLACKLISTED_CHARACTERS)) {
            validationErrors.push({
              message: "Invalid payment cardHolderName",
              translationKey: "invalid.payment.cardHolderName",
              elementName: "payment[cardHolderName]",
              value: payment.cardHolderName
            });
          }
        }
      }

      function validatePaymentMethod() {
        if(!isOptional("paymentMethod") &&
           !payment.paymentMethod ||
           !SAFE_CHARACTERS.test(payment.paymentMethod)) {
          validationErrors.push({
            message: "Invalid payment method",
            translationKey: "invalid.payment.paymentMethod",
            elementName: "payment[paymentMethod]",
            value: payment.paymentMethod
          });
        }
      }

      function validateCreditCardNumber() {
        var creditCardNumber = sanitizeForValidation(payment.creditCardNumber);
        if(!isOptional("creditCardNumber")) {
          if(!validator.isCreditCard(creditCardNumber + "")) {
            validationErrors.push({
              message: "Invalid payment credit card number",
              translationKey: "invalid.payment.creditCardNumber",
              elementName: "payment[creditCardNumber]",
              value: payment.creditCardNumber
            });
          }
        }
      }

      function validateCvv() {
        var ccv = sanitizeForValidation(payment.ccv || payment.cvv);
        if(!isOptional("ccv")) {
          if(!ccv ||
              (ccv.length < 3 || ccv.length > 4) ||
              !validator.isInt(ccv)) {
            validationErrors.push({
              message: "Invalid payment ccv",
              translationKey: "invalid.payment.ccv",
              elementName: "payment[ccv]",
              value: payment.ccv
            });
          }
        }
      }

      function validateExpiresMonth() {
        if(!isOptional("expiresMonth")) {
          var month = Number(sanitizeForValidation(payment.expiresMonth + ""));
          if(!payment.expiresMonth ||
              month < 1 ||
              month > 12) {
            validationErrors.push({
              message: "Invalid payment expires month",
              translationKey: "invalid.payment.expiresMonth",
              elementName: "payment[expiresMonth]",
              value: payment.expiresMonth
            });
          }
        }
      }

      function validateExpiresYear() {
        var year = sanitizeForValidation(payment.expiresYear);
        if(!isOptional("expiresYear")) {
          if(!payment.expiresYear ||
              year < moment().year()) {
            validationErrors.push({
              message: "Invalid payment expires year",
              translationKey: "invalid.payment.expiresYear",
              elementName: "payment[expiresYear]",
              value: payment.expiresYear
            });
          }
          if(moment(payment.expiresMonth + "-" + payment.expiresYear, "MM-YYYY").isBefore(moment().startOf("month"))) {
            validationErrors.push({
              message: "Card has expired",
              translationKey: "invalid.payment.cardHasExpired",
              value: payment.expiresMonth + "/" + payment.expiresYear
            });
          }
        }
      }

      return {
        validate: function() {
          validateIpAddress();
          validateCardHolderEmail();
          validateCardHolderName();
          validatePaymentMethod();
          validateCreditCardNumber();
          validateCvv();
          validateExpiresMonth();
          validateExpiresYear();
          return validationErrors;
        }
      };
    };

    if (typeof window === "undefined") {
      module.exports = PaymentValidator;
    } else {
      window.PaymentValidator = PaymentValidator;
    }
  })();
}());
