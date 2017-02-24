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

      if(params.payment.locale) {
        var err = new Error("payment.locale will be deprecated soon. This is NOT an error, just a warning! " +
            "And the stacktrace below is just so you can easily find where payment.locale has been used :)");
        console.warn(err.message);
        console.warn(err.stack);
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
            if(ip.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                message: "Invalid payment ip",
                translationKey: "invalid.payment.ip",
                elementName: "payment[ip]",
                value: "Payment ip is not URL encoded"
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
            if(ccv.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                message: "Invalid payment ccv",
                translationKey: "invalid.payment.ccv",
                elementName: "payment[ccv]",
                value: "Payment ccv is not URL encoded"
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
            if(locale.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                message: "Invalid payment locale",
                translationKey: "invalid.payment.locale",
                elementName: "payment[locale]",
                value: "Payment locale is not URL encoded"
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
            if(expiresMonth.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                message: "Invalid payment expiresMonth",
                translationKey: "invalid.payment.expiresMonth",
                elementName: "payment[expiresMonth]",
                value: "Payment expiresMonth is not URL encoded"
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
            if(expiresYear.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                message: "Invalid payment expiresYear",
                translationKey: "invalid.payment.expiresYear",
                elementName: "payment[expiresYear]",
                value: "Payment expiresYear is not URL encoded"
              });
            } else {
              expiresYear = Number(expiresYear);
              if(!validator.isInt("" + expiresYear) ||
                  expiresYear < moment().year()) {
                validationErrors.push({
                  message: "Invalid payment expiresYear",
                  translationKey: "invalid.payment.expiresYear",
                  elementName: "payment[expiresYear]",
                  value: expiresYear + ""
                });
              }
              if(moment(payment.expiresMonth + "-" + payment.expiresYear, "MM-YYYY")
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
          return validationErrors;
        }
      };
    };

    module.exports = PaymentValidator;
  })();
}());
