(function () {
  "use strict";
  var OrderValidator = (function() {
    var OrderValidator = function(params) {
      var validator = require("validator");
      var UrlValidator = require("./url.validator");
      var CryptoValidator = require("./crypto.validator");
      var validationErrors = [];
      var order = params.order;
      var optionalFields = params.optionalFields || [];
      var cryptoCurrencies = [
        "BTC", "BCH", "LTC", "ETH", "XRP", "XEM", "DASH", "NEO", "ETC",
        "XMR"
      ];
      var fiatCurrencies = [
        "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG",
        "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND",
        "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD",
        "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU",
        "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD",
        "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS",
        "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG",
        "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD",
        "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD",
        "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL",
        "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK",
        "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR",
        "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG",
        "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG",
        "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SVC",
        "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD",
        "TWD", "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UZS",
        "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB",
        "XBC", "XBD", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT", "XSU",
        "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWL"
      ];
      var currencies = cryptoCurrencies.concat(fiatCurrencies);

      function isOptional(field) {
        return optionalFields.indexOf(field) !== -1;
      }

      function sanitizeForValidation(value) {
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : value + "";
        return value;
      }

      function isNumber(n) {
        return validator.isNumeric(sanitizeForValidation(n));
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

      function validateCrypto() {
        if(cryptoCurrencies.indexOf(order.currency) >= 0) {
          validationErrors.concat(new CryptoValidator({
            crypto: {
              sumIncVat: order.sumIncVat,
              sumExcVat: order.sumExcVat,
              vat: order.vat,
              currency: order.currency
            },
            optionalFields: optionalFields
          }).validate());
          optionalFields.push("sumInCentsIncVat");
          optionalFields.push("sumInCentsExcVat");
          optionalFields.push("vatInCents");
        }
      }

      function validateSumInCentsIncVat() {
        if(isOptional("sumInCentsIncVat") && !order.sumInCentsIncVat) {
          return;
        } else {
          if(isNumber(order.sumInCentsIncVat)) {
            validateCents({
              value: order.sumInCentsIncVat,
              message: "Invalid sum in cents including VAT",
              translationKey: "invalid.order.sumInCentsIncVat"
            });
          } else {
            validationErrors.push({
              value: order.sumInCentsIncVat,
              message: "Invalid sum in cents including VAT",
              translationKey: "invalid.order.sumInCentsIncVat",
            });
          }
        }
      }

      function validateSumInCentsExcVat() {
        if(isOptional("sumInCentsExcVat") && !order.sumInCentsExcVat) {
          return;
        } else {
          if(isNumber(order.sumInCentsExcVat)) {
            validateCents({
              value: order.sumInCentsExcVat,
              message: "Invalid sum in cents excluding VAT",
              translationKey: "invalid.order.sumInCentsExcVat",
            });
          } else {
            validationErrors.push({
              value: order.sumInCentsExcVat,
              message: "Invalid sum in cents excluding VAT",
              translationKey: "invalid.order.sumInCentsExcVat",
            });
          }
        }
      }

      function validateVatInCents() {
        if(order.vatInCents === 0 || (isOptional("vatInCents") && !order.vatInCents)) {
          return;
        } else {
          if(isNumber(order.vatInCents)) {
            validateCents({
              value: order.vatInCents,
              message: "Invalid VAT in cents",
              translationKey: "invalid.order.vatInCents",
            });
          } else {
            if(order.vatInCents) {
              validationErrors.push({
                value: order.vatInCents,
                message: "Invalid VAT in cents",
                translationKey: "invalid.order.vatInCents",
              });
            } else {
              validationErrors.push({
                value: "Order VAT in cents is mandatory",
                message: "Invalid VAT in cents",
                translationKey: "invalid.order.vatInCents",
              });
            }
          }
        }
      }

      function validateReferenceId() {
        if(isOptional("referenceId") && !order.referenceId) {
          return;
        } else {
          if(order.referenceId) {
            if(order.referenceId.length > 255) {
              validationErrors.push({
                value: order.referenceId,
                message: "Invalid order reference ID",
                elementName: "order[referenceId]",
                translationKey: "invalid.order.referenceId",
              });
            }
          } else {
            validationErrors.push({
              value: "Order reference id is mandatory",
              message: "Invalid order reference ID",
              elementName: "order[referenceId]",
              translationKey: "invalid.order.referenceId",
            });
          }
        }
      }

      function validateCurrency() {
        if(!order.currency) {
          validationErrors.push({
            value: "Order currency is mandatory",
            message: "Invalid order currency",
            translationKey: "invalid.order.currency",
          });
        } else {
          if(currencies.indexOf(order.currency) === -1) {
            validationErrors.push({
              value: order.currency,
              message: "Invalid order currency",
              translationKey: "invalid.order.currency",
            });
          }
        }
      }

      function validateTosUrl() {
        if(isOptional("tosUrl") && !order.tosUrl) {
          return;
        } else {
          if(!order.tosUrl) {
            validationErrors.push({
              value: "Order TOS URL is mandatory",
              message: "Invalid order tosUrl",
              translationKey: "invalid.order.tosUrl",
            });
          } else {
            if(!new UrlValidator({url: order.tosUrl}).validate()) {
              validationErrors.push({
                value: order.tosUrl,
                message: "Invalid order tosUrl. Make sure you are using https protocol.",
                translationKey: "invalid.order.tosUrl",
              });
            }
          }
        }
      }

      return {
        validate: function() {
          validateCrypto();
          validateSumInCentsIncVat();
          validateSumInCentsExcVat();
          validateVatInCents();
          validateReferenceId();
          validateCurrency();
          validateTosUrl();
          return validationErrors;
        },
        fiatCurrencies: fiatCurrencies,
        cryptoCurrencies: cryptoCurrencies
      };
    };

    if (typeof window === "undefined") {
      module.exports = OrderValidator;
    } else {
      window.OrderValidator = OrderValidator;
    }
  })();
}());
