(function () {
  "use strict";
  var ConsumerValidator = (function() {
    var ConsumerValidator = function(params) {
      var validator = require("validator");
      var validationErrors = [];
      var consumer = params.consumer;
      var optionalFields = params.optionalFields || [];
      var BLACKLISTED_CHARACTERS = /[`'";{}<>]+/gi;
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

      function isOptional(field) {
        return optionalFields.indexOf(field) !== -1;
      }

      function sanitizeForValidation(value) {
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : value + "";
        return value;
      }

      function validateName() {
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
      }

      function validateCo() {
        if(consumer.co) {
          if(consumer.co.length > 52 || consumer.co.match(BLACKLISTED_CHARACTERS)) {
            validationErrors.push({
              message: "Invalid consumer c/o",
              translationKey: "invalid.consumer.co",
              elementName: "consumer[co]",
              value: consumer.co
            });
          }
        }
      }

      function validateStreetAddress() {
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
      }

      function validateStreetAddress2() {
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
      }

      function validatePostalCode() {
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
      }

      function validateCity() {
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
      }

      function validateStateOrProvince() {
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
      }

      function validateCountry() {
        var country = sanitizeForValidation(consumer.country);
        if(consumer.countryCode && countryCodes.indexOf(consumer.countryCode) < 0) {
          validationErrors.push({
            message: "Invalid consumer country code",
            translationKey: "invalid.consumer.countryCode",
            elementName: "consumer[countryCode]",
            value: consumer.countryCode
          });
        }
      }

      function validateLocale() {
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

      return {
        validate: function() {
          validateName();
          validateCo();
          validateStreetAddress();
          validateStreetAddress2();
          validatePostalCode();
          validateCity();
          validateStateOrProvince();
          validateCountry();
          validateLocale();
          return validationErrors;
        }
      };
    };

    if (typeof window === "undefined") {
      module.exports = ConsumerValidator;
    } else {
      window.ConsumerValidator = ConsumerValidator;
    }
  })();
}());
