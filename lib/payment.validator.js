(function () {
  "use strict";
  var PaymentValidator = (function() {
    var PaymentValidator = function(params) {
      var validator = require("validator");
      var validationErrors = [];
      var payment = params.payment;
      var optionalFields = params.optionalFields || [];
      var moment = require("moment");
      var BLACKLISTED_CHARACTERS = /[`´";{}<>]+/gi;
      var SAFE_CHARACTERS = /^[a-z_]*$/;

      function isOptional(field) {
        return optionalFields.indexOf(field) !== -1;
      }

      function sanitizeForValidation(value) {
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : "";
        if(value === " ") {
          value = "";
        }
        return value;
      }

      function validateIpAddress() {
        if(!isOptional("ip") && !validator.isIP("" + payment.ip)) {
          validationErrors.push({
            message: "Invalid payment IP address",
            translationKey: "invalid.payment.ip.address",
            elementName: "payment[ip]",
            value: payment.ip
          });
        }
      }

      function validateCardHolderEmail() {
        var cardHolderEmail = sanitizeForValidation(payment.cardHolderEmail);
        if(validator.isEmpty(cardHolderEmail) && isOptional("cardHolderEmail")) {
          return;
        } else {
          if(!validator.isEmpty(cardHolderEmail)) {
            if(cardHolderEmail.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                message: "Invalid payment cardHolderEmail",
                translationKey: "invalid.payment.cardHolderEmail",
                elementName: "payment[cardHolderEmail]",
                value: "Payment cardHolderEmail is not URL encoded"
              });
            } else if(!validator.isEmail(cardHolderEmail)) {
              validationErrors.push({
                message: "Invalid payment cardHolderEmail",
                translationKey: "invalid.payment.cardHolderEmail",
                elementName: "payment[cardHolderEmail]",
                value: cardHolderEmail
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid payment cardHolderEmail",
              translationKey: "invalid.payment.cardHolderEmail",
              elementName: "payment[cardHolderEmail]",
              value: "Payment cardHolderEmail is mandatory"
            });
          }
        }
      }

      function validateCardHolderName() {
        var cardHolderName = sanitizeForValidation(payment.cardHolderName);
        if(validator.isEmpty(cardHolderName) && isOptional("cardHolderName")) {
          return;
        } else {
          if(!validator.isEmpty(cardHolderName)) {
            if(cardHolderName.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                message: "Invalid payment cardHolderName",
                translationKey: "invalid.payment.cardHolderName",
                elementName: "payment[cardHolderName]",
                value: "Payment cardHolderName is not URL encoded",
              });
            } else if(cardHolderName.length < 2 ||
              cardHolderName.length > 52) {
              validationErrors.push({
                message: "Invalid payment cardHolderName",
                translationKey: "invalid.payment.cardHolderName",
                elementName: "payment[cardHolderName]",
                value: payment.cardHolderName
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid payment cardHolderName",
              translationKey: "invalid.payment.cardHolderName",
              elementName: "payment[cardHolderName]",
              value: "Payment cardHolderName is mandatory"
            });
          }
        }
      }

      function validatePaymentMethod() {
        var paymentMethod = sanitizeForValidation(payment.paymentMethod);
        if(validator.isEmpty(paymentMethod) && isOptional("paymentMethod")) {
          return;
        } else {
          if(validator.isEmpty(paymentMethod)) {
            validationErrors.push({
              message: "Invalid payment paymentMethod",
              translationKey: "invalid.payment.paymentMethod",
              elementName: "payment[paymentMethod]",
              value: "Payment paymentMethod is mandatory"
            });
          } else if(paymentMethod.match(BLACKLISTED_CHARACTERS)) {
            validationErrors.push({
              message: "Invalid payment paymentMethod",
              translationKey: "invalid.payment.paymentMethod",
              elementName: "payment[paymentMethod]",
              value: "Payment paymentMethod is not URL encoded"
            });
          } else if(!SAFE_CHARACTERS.test(paymentMethod)) {
            validationErrors.push({
              message: "Invalid payment paymentMethod",
              translationKey: "invalid.payment.paymentMethod",
              elementName: "payment[paymentMethod]",
              value: paymentMethod
            });
          }
        }
      }

      function validateCreditCardNumber() {
        var creditCardNumber = sanitizeForValidation(payment.creditCardNumber);
        if(validator.isEmpty(creditCardNumber) && isOptional("creditCardNumber")) {
          return;
        } else {
          if(validator.isEmpty(creditCardNumber)) {
            validationErrors.push({
              message: "Invalid payment creditCardNumber",
              translationKey: "invalid.payment.creditCardNumber",
              elementName: "payment[creditCardNumber]",
              value: "Payment creditCardNumber is mandatory"
            });
          } else {
            if(creditCardNumber.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                message: "Invalid payment creditCardNumber",
                translationKey: "invalid.payment.creditCardNumber",
                elementName: "payment[creditCardNumber]",
                value: "Payment creditCardNumber is not URL encoded"
              });
            } else {
              if(!validator.isCreditCard(creditCardNumber)) {
                validationErrors.push({
                  message: "Invalid payment creditCardNumber",
                  translationKey: "invalid.payment.creditCardNumber",
                  elementName: "payment[creditCardNumber]",
                  value: payment.creditCardNumber
                });
              }
            }
          }
        }
      }

      function validateCvv() {
        var ccv = sanitizeForValidation(payment.ccv || payment.cvv);
        if(!isOptional("ccv")) {
          if(!ccv ||
              (ccv.length < 3 || ccv.length > 4) ||
              !validator.isNumeric(ccv)) {
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
              !validator.isInt("" + month) ||
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
              !validator.isInt("" + year) ||
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

    module.exports = PaymentValidator;
  })();
}());
