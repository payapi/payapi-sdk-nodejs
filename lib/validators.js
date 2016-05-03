(function () {
  "use strict";

  var InputDataValidator = (function() {

    var InputDataValidator = function(params) {
      var moment = require("moment");
      var validator = require("validator");
      var BLACKLISTED_CHARACTERS = /[`'";{}<>]+/gi;
      var validationErrors = [];
      var optionalFields = params.optionalFields || [];
      var currencies = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA",
      "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD",
      "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP",
      "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP",
      "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF",
      "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP",
      "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD",
      "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR",
      "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW",
      "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL",
      "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO",
      "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN",
      "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP",
      "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR",
      "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD",
      "SSP", "STD", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND",
      "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN",
      "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG",
      "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XOF", "XPD",
      "XPF", "XPT", "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW",
      "ZWL"];
      var countryCodes =
      ["AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS",
      "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG",
      "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT",
      "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI",
      "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY",
      "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH",
      "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB",
      "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ",
      "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT",
      "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT",
      "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP",
      "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS",
      "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH",
      "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU",
      "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI",
      "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG",
      "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA",
      "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG",
      "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST",
      "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK",
      "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG",
      "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU",
      "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"];

      function sanitizeForValidation(value) {
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : value + "";
        return value;
      }

      function isMandatory(fieldPath) {
        return optionalFields.indexOf(fieldPath) === -1;
      }

      function validatePayment(payment) {
        if(isMandatory("payment.ip") && !validator.isIP(payment.ip)) {
          validationErrors.push({
            message: "Invalid payment IP address",
            translationKey: "invalid.payment.ip.address",
            elementName: "payment[ip]",
            value: payment.ip
          });
        }
        if(isMandatory("payment.cardHolderEmail") &&
          !validator.isEmail(payment.cardHolderEmail + "")) {
          validationErrors.push({
            message: "Invalid payment card holder email",
            translationKey: "invalid.payment.cardHolderEmail",
            elementName: "payment[cardHolderEmail]",
            value: payment.cardHolderEmail
          });
        }
        var cardHolderName = sanitizeForValidation(payment.cardHolderName);
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
        if(!payment.paymentMethod ||
           !validator.isAlpha(payment.paymentMethod)) {
          validationErrors.push({
            message: "Invalid payment method",
            translationKey: "invalid.payment.paymentMethod",
            elementName: "payment[paymentMethod]",
            value: payment.paymentMethod
          });
        }
        var creditCardNumber = sanitizeForValidation(payment.creditCardNumber);
        if(!validator.isCreditCard(creditCardNumber + "")) {
          validationErrors.push({
            message: "Invalid payment credit card number",
            translationKey: "invalid.payment.creditCardNumber",
            elementName: "payment[creditCardNumber]",
            value: payment.creditCardNumber
          });
        }
        // FIXME: rename all ccv to cvv
        var ccv = sanitizeForValidation(payment.ccv || payment.cvv);
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
        var month = sanitizeForValidation(payment.expiresMonth + "");
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
        var year = sanitizeForValidation(payment.expiresYear);
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

      function validateConsumer(consumer) {
        if(consumer) {
          var name = sanitizeForValidation(consumer.name);
          if(consumer.name &&
              name.length < 2 ||
              name.length > 52 ||
              name.match(BLACKLISTED_CHARACTERS)) {
            validationErrors.push({
              message: "Invalid consumer name",
              translationKey: "invalid.consumer.name",
              elementName: "consumer[name]",
              value: consumer.name
            });
          }
          if(consumer.co && consumer.co.length > 52 || consumer.co.match(BLACKLISTED_CHARACTERS)) {
            validationErrors.push({
              message: "Invalid consumer c/o",
              translationKey: "invalid.consumer.co",
              elementName: "consumer[co]",
              value: consumer.co
            });
          }
          var streetAddress = sanitizeForValidation(consumer.streetAddress);
          if(consumer.streetAddress &&
              streetAddress.length < 2 ||
              streetAddress.length > 52 ||
              streetAddress.match(BLACKLISTED_CHARACTERS)) {
            validationErrors.push({
              message: "Invalid consumer street address",
              translationKey: "invalid.consumer.streetAddress",
              elementName: "consumer[streetAddress]",
              value: consumer.streetAddress
            });
          }
          if(consumer.streetAddress2 &&
             (consumer.streetAddress2.length > 52 ||
             consumer.streetAddress2.match(BLACKLISTED_CHARACTERS))) {
            validationErrors.push({
              message: "Invalid consumer street address 2",
              translationKey: "invalid.consumer.streetAddress2",
              elementName: "consumer[streetAddress2]",
              value: consumer.streetAddress2
            });
          }
          var postalCode = sanitizeForValidation(consumer.postalCode);
          if(consumer.postalCode &&
              postalCode.length < 2 ||
              postalCode.length > 10 ||
              postalCode.match(BLACKLISTED_CHARACTERS)) {
            validationErrors.push({
              message: "Invalid consumer postal code",
              translationKey: "invalid.consumer.postalCode",
              elementName: "consumer[postalCode]",
              value: consumer.postalCode
            });
          }
          var city = sanitizeForValidation(consumer.city);
          if(consumer.city &&
              city.length < 2 ||
              city.length > 53 ||
              city.match(BLACKLISTED_CHARACTERS)) {
            validationErrors.push({
              message: "Invalid consumer city",
              translationKey: "invalid.consumer.city",
              elementName: "consumer[city]",
              value: consumer.city
            });
          }
          if(consumer.stateOrProvince &&
             (consumer.stateOrProvince.length > 52 ||
             consumer.stateOrProvince.match(BLACKLISTED_CHARACTERS))) {
            validationErrors.push({
              message: "Invalid consumer state or province",
              translationKey: "invalid.consumer.stateOrProvince",
              elementName: "consumer[stateOrProvince]",
              value: consumer.stateOrProvince
            });
          }
          var country = sanitizeForValidation(consumer.country);
          if(consumer.countryCode && countryCodes.indexOf(consumer.countryCode) < 0) {
            validationErrors.push({
              message: "Invalid consumer country code",
              translationKey: "invalid.consumer.countryCode",
              elementName: "consumer[countryCode]",
              value: consumer.countryCode
            });
          }
          var locale = sanitizeForValidation(consumer.locale);
          if(locale.length === 0 || locale === "undefined" || locale === "null") {
            locale =  "en-US";
          }
          if(locale.length < 2 ||
             locale.length > 7 ||
             locale.match(BLACKLISTED_CHARACTERS)) {
            validationErrors.push({
              message: "Invalid consumer locale",
              translationKey: "invalid.consumer.locale",
              elementName: "consumer[locale]",
              value: consumer.locale
            });
          }
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
        if(!order) {
          validationErrors.push({
            value: "Order is mandatory",
            message: "Invalid order",
            translationKey: "invalid.order"
          });
        } else {
          if(order.sumInCentsIncVat) {
            validateCents({
              value: order.sumInCentsIncVat,
              message: "Invalid sum in cents including VAT",
              translationKey: "invalid.order.sumInCentsIncVat"
            });
          } else {
            validationErrors.push({
              value: "Order sum in cents including VAT is mandatory",
              message: "Invalid sum in cents including VAT",
              translationKey: "invalid.order.sumInCentsIncVat",
            });
          }
          if(order.sumInCentsExcVat) {
            validateCents({
              value: order.sumInCentsExcVat,
              message: "Invalid sum in cents excluding VAT",
              translationKey: "invalid.order.sumInCentsExcVat",
            });
          }
          if(order.vatInCents) {
            validateCents({
              value: order.vatInCents,
              message: "Invalid VAT in cents excluding VAT",
              translationKey: "invalid.order.vatInCents",
            });
          }
          if(!order.referenceId) {
            validationErrors.push({
              value: "Order reference id is mandatory",
              message: "Invalid order reference ID",
              translationKey: "invalid.order.referenceId",
            });
          } else {
            if( order.referenceId.length > 255) {
              validationErrors.push({
                value: order.referenceId,
                message: "Invalid order reference ID",
                translationKey: "invalid.order.referenceId",
              });
            }
          }
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
      }

      function validateSeller(seller) {
      }

      function validateProducts(products) {
        if(products) {
          for(var i = 0; i < products.length; i++) {
            if(!validator.isInt("" + products[i].priceInCentsIncVat)) {
              validationErrors.push({
                value: "" + products[i].priceInCentsIncVat,
                message: "Invalid product price in cents including VAT",
                translationKey: "invalid.product.priceInCentsIncVat",
              });
            }
            if(!validator.isInt("" + products[i].priceInCentsExcVat)) {
              validationErrors.push({
                value: "" + products[i].priceInCentsExcVat,
                message: "Invalid product price in cents excluding VAT",
                translationKey: "invalid.product.priceInCentsExcVat",
              });
            }
            if(!validator.isInt("" + products[i].quantity)) {
              validationErrors.push({
                value: "" + products[i].quantity,
                message: "Invalid product quantity",
                translationKey: "invalid.product.quantity",
              });
            }
            if(typeof products[i].vatPercentage === "string" || !validator.isFloat("" + products[i].vatPercentage)) {
              validationErrors.push({
                value: "" + products[i].vatPercentage,
                message: "Invalid product vatPercentage",
                translationKey: "invalid.product.vatPercentage",
              });
            }
          }
        }
      }

      function validateCallbacks(callbacks) {
      }

      return {
        validate: function() {
          validationErrors = [];
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
