(function () {
  "use strict";
  var PaymentValidator = (function() {
    var PaymentValidator = function(params) {
      var validator = require("validator");
      var validationErrors = [];
      var payment = params.payment;
      var optionalFields = params.optionalFields || [];
      var moment = require("moment");
      var SAFE_CHARACTERS = /^[a-z_]*$/;
      var log = require("./log")("validation:payment");

      if(params.payment.locale && process.env.NODE_ENV !== "test") {
        var err = new Error("payment.locale will be deprecated soon. This is NOT an error, just a warning! " +
            "And the stacktrace below is just so you can easily find where payment.locale has been used :)");
        if(params.debug) {
          log.warn("Error %O", err.stack);
        } else {
          log.warn(err.message);
        }
      }

      function isOptional(field) {
        return optionalFields.indexOf(field) !== -1;
      }

      function sanitizeForValidation(value) {
        if(value === "undefined" || value === "null") {
          value = null;
        }
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : "";
        if(value === " ") {
          value = "";
        }
        return value;
      }

      function validateIpAddress() {
        var ip = sanitizeForValidation(payment.ip);
        if(validator.isEmpty(ip) && isOptional("ip")) {
          return;
        } else {
          if(validator.isEmpty(ip)) {
            validationErrors.push({
              message: "Invalid payment ip",
              translationKey: "invalid.payment.ip",
              elementName: "payment[ip]",
              value: "Payment ip is mandatory"
            });
          } else {
            if(!validator.isIP(ip)) {
              validationErrors.push({
                message: "Invalid payment ip",
                translationKey: "invalid.payment.ip",
                elementName: "payment[ip]",
                value: payment.ip
              });
            }
          }
        }
      }

      function validateCardHolderEmail() {
        var cardHolderEmail = sanitizeForValidation(payment.cardHolderEmail);
        if(validator.isEmpty(cardHolderEmail) && isOptional("cardHolderEmail")) {
          return;
        } else {
          if(!validator.isEmpty(cardHolderEmail)) {
            if(!validator.isEmail(cardHolderEmail)) {
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
            if(cardHolderName.length < 2 ||
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

      function validateCvv() {
        var ccv = sanitizeForValidation(payment.ccv || payment.cvv);
        if(validator.isEmpty(ccv) && isOptional("ccv")) {
          return;
        } else {
          if(validator.isEmpty(ccv)) {
            validationErrors.push({
              message: "Invalid payment ccv",
              translationKey: "invalid.payment.ccv",
              elementName: "payment[ccv]",
              value: "Payment ccv is mandatory"
            });
          } else {
            if((ccv.length < 3 || ccv.length > 4) ||
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
      }

      function validateLocale() {
        var locale = sanitizeForValidation(payment.locale);
        if(validator.isEmpty(locale) && isOptional("locale")) {
          return;
        } else {
          if(validator.isEmpty(locale)) {
            validationErrors.push({
              message: "Invalid payment locale",
              translationKey: "invalid.payment.locale",
              elementName: "payment[locale]",
              value: "Payment locale is mandatory"
            });
          } else {
            if (!(/^([a-z]){2}-[A-Z]{2}$/).test(locale)) { // en-US, es-ES
              validationErrors.push({
                value: "Payment locale must be 5 characters",
                message: "Invalid payment locale",
                elementName: "payment[locale]",
                translationKey: "invalid.payment.locale",
              });
            }
          }
        }
      }

      function validateExpiresMonth() {
        var expiresMonth = sanitizeForValidation(payment.expiresMonth + "");
        if(validator.isEmpty(expiresMonth) && isOptional("expiresMonth")) {
          return;
        } else {
          if(validator.isEmpty(expiresMonth)) {
            validationErrors.push({
              message: "Invalid payment expiresMonth",
              translationKey: "invalid.payment.expiresMonth",
              elementName: "payment[expiresMonth]",
              value: "Payment expiresMonth is mandatory"
            });
          } else {
            expiresMonth = Number(expiresMonth);
            if(!validator.isInt("" + expiresMonth) ||
                expiresMonth < 1 ||
                expiresMonth > 12) {
              validationErrors.push({
                message: "Invalid payment expiresMonth",
                translationKey: "invalid.payment.expiresMonth",
                elementName: "payment[expiresMonth]",
                value: expiresMonth + ""
              });
            }
          }
        }
      }

      function validateExpiresYear() {
        var expiresYear = sanitizeForValidation(payment.expiresYear + "");
        if(validator.isEmpty(expiresYear) && isOptional("expiresYear")) {
          return;
        } else {
          if(validator.isEmpty(expiresYear)) {
            validationErrors.push({
              message: "Invalid payment expiresYear",
              translationKey: "invalid.payment.expiresYear",
              elementName: "payment[expiresYear]",
              value: "Payment expiresYear is mandatory"
            });
          } else {
            expiresYear = Number(expiresYear);
            if(!validator.isInt("" + expiresYear) || expiresYear < moment().year()) {
              validationErrors.push({
                message: "Invalid payment expiresYear",
                translationKey: "invalid.payment.expiresYear",
                elementName: "payment[expiresYear]",
                value: expiresYear + ""
              });
            } else if(moment(payment.expiresMonth + "-" + payment.expiresYear, "MM-YYYY")
                .isBefore(moment().startOf("month"))) {
              validationErrors.push({
                message: "Card has expired",
                translationKey: "invalid.payment.cardHasExpired",
                value: payment.expiresMonth + "/" + payment.expiresYear
              });
            }
          }
        }
      }

      function validateNumberOfInstallments() {
        var numberOfInstallments= sanitizeForValidation(payment.numberOfInstallments + "");
        if (validator.isEmpty(numberOfInstallments) && isOptional("numberOfInstallments")) {
          return;
        } else {
          if (validator.isEmpty(numberOfInstallments)) {
            validationErrors.push({
              value: "Payment numberOfInstallments is mandatory",
              message: "Payment numberOfInstallments is mandatory",
              translationKey: "invalid.payment.numberOfInstallments",
              elementName: "payment[numberOfInstallments]"
            });
          } else {
            if (!validator.isInt("" + numberOfInstallments) ||
              numberOfInstallments < 3 || numberOfInstallments > 60) {
              validationErrors.push({
                message: "Invalid payment numberOfInstallments",
                translationKey: "invalid.payment.numberOfInstallments",
                value: "" + numberOfInstallments ,
                elementName: "payment[numberOfInstallments]"
              });
            }
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
          validateLocale();
          validateExpiresMonth();
          validateExpiresYear();
          validateNumberOfInstallments();
          return validationErrors;
        }
      };
    };

    module.exports = PaymentValidator;
  })();
}());
