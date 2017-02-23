(function () {
  "use strict";
  var ConsumerValidator = (function() {
    var ConsumerValidator = function(params) {
      var validator = require("validator");
      var phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
      var PNF = require("google-libphonenumber").PhoneNumberFormat;
      var validationErrors = [];
      var consumer = params.consumer;
      var optionalFields = params.optionalFields || [];
      var BLACKLISTED_CHARACTERS = /[`´";{}<>]+/gi;
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

      function isValidPhoneNumber(phone, country) {
        try {
          // check required '+'country to format correctly
          if(country && countryCodes.indexOf(country) >= 0) {
            return phoneUtil.isValidNumber(phoneUtil.parse(phone), country);
          } else {
            var phoneNumber = String(phone).indexOf("+") >= 0 ? phone : "+" + phone;
            return phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber));
          }
        } catch (ex) {
          console.warn(ex);
          console.warn("Error when trying to format phone number to E164;  number= "+phone);
          return false;
        }
      }

      function sanitizeForValidation(value) {
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : value + "";
        return value;
      }

      function isValidName(name) {
        if(name.length < 2 ||
          name.length > 52
        ) {
          return false;
        } else {
          return true;
        }
      }

      function validateName() {
        var consumerName = sanitizeForValidation(consumer.name);
        if(!consumer.name && isOptional("name")) {
          return;
        } else {
          if(consumer.name) {
            if(!isValidName(consumer.name)) {
              validationErrors.push({
                value: "Consumer name is must be between 2 and 52 characters",
                message: "Invalid consumer name",
                elementName: "consumer[name]",
                translationKey: "invalid.consumer.name",
              });
            }
            else if(consumer.name.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "Consumer name is not URL encoded",
                message: "Invalid consumer name",
                elementName: "consumer[name]",
                translationKey: "invalid.consumer.name",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer name",
              translationKey: "invalid.consumer.name",
              elementName: "consumer[name]",
              value: "Consumer name is mandatory"
            });
          }
        }
      }

      function validateCo() {
        var co = sanitizeForValidation(consumer.co);
        if(!consumer.co && isOptional("co")) {
          return;
        } else {
          if(consumer.co) {
            if(!isValidName(co)) {
              validationErrors.push({
                value: "Consumer c/o must be between 2 and 52 characters",
                message: "Invalid consumer c/o",
                elementName: "consumer[co]",
                translationKey: "invalid.consumer.co",
              });
            } else if(co.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "Consumer c/o is not URL encoded",
                message: "Invalid consumer c/o",
                elementName: "consumer[co]",
                translationKey: "invalid.consumer.co",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer c/o",
              translationKey: "invalid.consumer.co",
              elementName: "consumer[co]",
              value: "Consumer co is mandatory"
            });
          }
        }
      }

      function isValidStreetAddress(streetAddress) {
        if(streetAddress.length < 2 || streetAddress.length > 52) {
          return false;
        }
        else {
          return true;
        }
      }

      function validateStreetAddress() {
        var streetAddress = sanitizeForValidation(consumer.streetAddress);

        if(!consumer.streetAddress && isOptional("streetAddress")) {
          return;
        } else {
          if(consumer.streetAddress) {
            if(!isValidStreetAddress(streetAddress)) {
              validationErrors.push({
                value: "Consumer street address must be between 2 and 52 characters",
                message: "Invalid consumer street address",
                elementName: "consumer[streetAddress]",
                translationKey: "invalid.consumer.streetAddress",
              });
            } else if(streetAddress.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "Consumer street address is not URL encoded",
                message: "Invalid consumer street address",
                elementName: "consumer[streetAddress]",
                translationKey: "invalid.consumer.streetAddress",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer street address",
              translationKey: "invalid.consumer.streetAddress",
              elementName: "consumer[streetAddress]",
              value: "Consumer street address is mandatory"
            });
          }
        }
      }

      function validateStreetAddress2() {
        var streetAddress2 = sanitizeForValidation(consumer.streetAddress2);

        if(!consumer.streetAddress2 && isOptional("streetAddress2")) {
          return;
        } else {
          if(consumer.streetAddress2) {
            if(!isValidStreetAddress(streetAddress2)) {
              validationErrors.push({
                value: "Consumer street address 2 must be between 2 and 52 characters",
                message: "Invalid consumer street address 2",
                elementName: "consumer[streetAddress2]",
                translationKey: "invalid.consumer.streetAddress2",
              });
            } else if(streetAddress2.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "Consumer street address 2 is not URL encoded",
                message: "Invalid consumer street address 2",
                elementName: "consumer[streetAddress2]",
                translationKey: "invalid.consumer.streetAddress2",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer street address 2",
              translationKey: "invalid.consumer.streetAddress2",
              elementName: "consumer[streetAddress2]",
              value: "Consumer street address 2 is mandatory"
            });
          }
        }
      }

      function isValidPostalCode(postalCode) {
        if(postalCode.length < 2 || postalCode.length > 10) {
          return false;
        } else {
          return true;
        }
      }

      function validatePostalCode() {
        var postalCode = sanitizeForValidation(consumer.postalCode);
        if(!consumer.postalCode && isOptional("postalCode")) {
          return;
        } else {
          if(consumer.postalCode) {
            if(!isValidPostalCode(postalCode)) {
              validationErrors.push({
                value: "Consumer postal code must be between 2 and 10 characters",
                message: "Invalid consumer postal code",
                elementName: "consumer[postalCode]",
                translationKey: "invalid.consumer.postalCode",
              });
            } else if(postalCode.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "Consumer postal code is not URL encoded",
                message: "Invalid consumer postal code",
                elementName: "consumer[postalCode]",
                translationKey: "invalid.consumer.postalCode",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer postal code",
              translationKey: "invalid.consumer.postalCode",
              elementName: "consumer[postalCode]",
              value: "Consumer postal code is mandatory"
            });
          }
        }

        if(!isOptional("postalCode") && !isValidPostalCode(postalCode)) {
          validationErrors.push({
            message: "Invalid consumer postal code",
            translationKey: "invalid.consumer.postalCode",
            elementName: "consumer[postalCode]",
            value: consumer.postalCode
          });
        }
      }

      function isValidCity(city) {
        if(city.length < 2 ||
           city.length > 53 ||
           city.match(BLACKLISTED_CHARACTERS)) {
          return false;
        } else {
          return true;
        }
      }

      function validateCity() {
        var city = sanitizeForValidation(consumer.city);
        if(!isOptional("city") && !isValidCity(city)) {
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

      function isValidCountryCode(countryCode) {
        if(countryCodes.indexOf(countryCode) < 0 ||
           countryCode.match(BLACKLISTED_CHARACTERS)) {
          return false;
        } else {
          return true;
        }
      }

      function validateCountryCode() {
        var countryCode = sanitizeForValidation(consumer.countryCode);
        if(!isOptional("countryCode") && !isValidCountryCode(countryCode)) {
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

      function validatePhoneNumber() {
        var phoneNumber = sanitizeForValidation(consumer.phoneNumber);
        if (consumer.phoneNumber &&
          (phoneNumber.length < 9 || phoneNumber.length > 16 ||
            phoneNumber.match(BLACKLISTED_CHARACTERS) ||
            !isValidPhoneNumber(phoneNumber, consumer.country))) {
          validationErrors.push({
            message: "Invalid phone number",
            translationKey: "invalid.consumer.phoneNumber",
            elementName: "consumer[phoneNumber]",
            value: consumer.phoneNumber
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
          validateCountryCode();
          validateLocale();
          validatePhoneNumber();
          return validationErrors;
        }
      };
    };

    module.exports = ConsumerValidator;
  })();
}());
