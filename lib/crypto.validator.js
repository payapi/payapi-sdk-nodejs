(function () {
  "use strict";
  var CryptoValidator = (function() {
    var CryptoValidator = function(params) {
      var validator = require("validator");
      var validationErrors = [];
      var crypto = params.crypto;
      var optionalFields = params.optionalFields || [];
      var currencies = [
        "BTC", "BCH", "LTC", "ETH", "XRP", "XEM", "DASH", "NEO", "ETC",
        "XMR"
      ];

      function isOptional(field) {
        return optionalFields.indexOf(field) !== -1;
      }

      function sanitizeForValidation(value) {
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : value + "";
        return value;
      }

      function isNumber(n) {
        var nSanitized = sanitizeForValidation(n);
        return validator.isNumeric(nSanitized) || validator.isDecimal(nSanitized);
      }

      function isPositiveNumber(n) {
        return isNumber(n) &&
          Number(n) >= 0 &&
          Number(n) <= Number.MAX_SAFE_INTEGER;
      }

      function validateSumIncVat() {
        if(isOptional("sumIncVat") && !crypto.sumIncVat) {
          return;
        } else {
          if(isPositiveNumber(crypto.sumIncVat)) {
            return;
          } else {
            validationErrors.push({
              value: crypto.sumIncVat,
              message: "Invalid sum including VAT",
              translationKey: "invalid.order.sumIncVat",
            });
          }
        }
      }

      function validateSumExcVat() {
        if(isOptional("sumExcVat") && !crypto.sumExcVat) {
          return;
        } else {
          if(isPositiveNumber(crypto.sumExcVat)) {
            return;
          } else {
            validationErrors.push({
              value: crypto.sumExcVat,
              message: "Invalid sum excluding VAT",
              translationKey: "invalid.order.sumExcVat",
            });
          }
        }
      }

      function validateVat() {
        if(isOptional("vat") && !crypto.vat) {
          return;
        } else {
          if(isPositiveNumber(crypto.vat)) {
            return;
          } else {
            validationErrors.push({
              value: crypto.vat,
              message: "Invalid VAT",
              translationKey: "invalid.order.vat",
            });
          }
        }
      }

      function validateCurrency() {
        if(!crypto.currency) {
          validationErrors.push({
            value: "Order currency is mandatory",
            message: "Invalid order currency",
            translationKey: "invalid.order.currency",
          });
        } else {
          if(currencies.indexOf(crypto.currency) === -1) {
            validationErrors.push({
              value: crypto.currency,
              message: "Invalid order currency",
              translationKey: "invalid.order.currency",
            });
          }
        }
      }

      return {
        validate: function() {
          validateSumIncVat();
          validateSumExcVat();
          validateVat();
          validateCurrency();
          return validationErrors;
        },
        currencies: currencies
      };
    };

    if (typeof window === "undefined") {
      module.exports = CryptoValidator;
    } else {
      window.CryptoValidator = CryptoValidator;
    }
  })();
}());
