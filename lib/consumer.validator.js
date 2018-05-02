(function () {
  "use strict";
  var ConsumerValidator = (function() {
    var ConsumerValidator = function(params) {
      var validator = require("validator");
      var phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
      var PNF = require("google-libphonenumber").PhoneNumberFormat;
      var log = require("./log")("validation:consumer");
      var validationErrors = [];
      var consumer = params.consumer;
      var optionalFields = params.optionalFields || [];
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
      var FinnishSsnUtil = require("finnish-ssn-util");

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
        if(validator.isEmpty(consumerName) && isOptional("name")) {
          return;
        } else {
          if(validator.isEmpty(consumerName)) {
            validationErrors.push({
              message: "Invalid consumer name",
              translationKey: "invalid.consumer.name",
              elementName: "consumer[name]",
              value: "Consumer name is mandatory"
            });
          } else {
            if(!isValidName(consumerName)) {
              validationErrors.push({
                value: "Consumer name is must be between 2 and 52 characters",
                message: "Invalid consumer name",
                elementName: "consumer[name]",
                translationKey: "invalid.consumer.name",
              });
            }
          }
        }
      }

      function validateCo() {
        var co = sanitizeForValidation(consumer.co);
        if(validator.isEmpty(co) && isOptional("co")) {
          return;
        } else {
          if(!validator.isEmpty(co)) {
            if(!isValidName(co)) {
              validationErrors.push({
                value: "Consumer c/o must be between 2 and 52 characters",
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

        if(validator.isEmpty(streetAddress) && isOptional("streetAddress")) {
          return;
        } else {
          if(!validator.isEmpty(streetAddress)) {
            if(!isValidStreetAddress(streetAddress)) {
              validationErrors.push({
                value: "Consumer street address must be between 2 and 52 characters",
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

        if(validator.isEmpty(streetAddress2) && isOptional("streetAddress2")) {
          return;
        } else {
          if(!validator.isEmpty(streetAddress2)) {
            if(!isValidStreetAddress(streetAddress2)) {
              validationErrors.push({
                value: "Consumer street address 2 must be between 2 and 52 characters",
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
        if(validator.isEmpty(postalCode) && isOptional("postalCode")) {
          return;
        } else {
          if(!validator.isEmpty(postalCode)) {
            if(!isValidPostalCode(postalCode)) {
              validationErrors.push({
                value: "Consumer postal code must be between 2 and 10 characters",
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
      }

      function isValidCity(city) {
        if(city.length < 2 || city.length > 53) {
          return false;
        } else {
          return true;
        }
      }

      function validateCity() {
        var city = sanitizeForValidation(consumer.city);
        if(validator.isEmpty(city) && isOptional("city")) {
          return;
        } else {
          if(!validator.isEmpty(city)) {
            if(!isValidCity(city)) {
              validationErrors.push({
                value: "Consumer city must be between 2 and 53 characters",
                message: "Invalid consumer city",
                elementName: "consumer[city]",
                translationKey: "invalid.consumer.city",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer city",
              translationKey: "invalid.consumer.city",
              elementName: "consumer[city]",
              value: "Consumer city is mandatory"
            });
          }
        }
      }

      function validateStateOrProvince() {
        var stateOrProvince = sanitizeForValidation(consumer.stateOrProvince);
        if (validator.isEmpty(stateOrProvince) && isOptional("stateOrProvince")) {
          return;
        } else {
          if (!validator.isEmpty(stateOrProvince)) {
            if (stateOrProvince.length < 2 || stateOrProvince.length > 52) {
              validationErrors.push({
                value: "Consumer state or province must be between 2 and 52 characters",
                message: "Invalid consumer state or province",
                elementName: "consumer[stateOrProvince]",
                translationKey: "invalid.consumer.stateOrProvince",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer state or province",
              translationKey: "invalid.consumer.stateOrProvince",
              elementName: "consumer[stateOrProvince]",
              value: "Consumer state or province is mandatory"
            });
          }
        }
      }

      function isValidCountryCode(countryCode) {
        if(countryCodes.indexOf(countryCode) < 0) {
          return false;
        } else {
          return true;
        }
      }

      function validateCountryCode() {
        var countryCode = sanitizeForValidation(consumer.countryCode);
        if (validator.isEmpty(countryCode) && isOptional("countryCode")) {
          return;
        } else {
          if (!validator.isEmpty(countryCode)) {
            if (!isValidCountryCode(countryCode)) {
              validationErrors.push({
                value: "Consumer country code is not valid",
                message: "Invalid consumer country code",
                elementName: "consumer[countryCode]",
                translationKey: "invalid.consumer.countryCode",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer country code",
              translationKey: "invalid.consumer.countryCode",
              elementName: "consumer[countryCode]",
              value: "Consumer country code is mandatory"
            });
          }
        }
      }

      function validateLocale() {
        var locale = sanitizeForValidation(consumer.locale);
        if (validator.isEmpty(locale) && isOptional("locale")) {
          return;
        } else {
          if (!validator.isEmpty(locale)) {
            if (!(/^([a-z]){2}-[A-Z]{2}$/).test(locale)) { // en-US, es-ES
              validationErrors.push({
                value: "Consumer locale must be 5 characters",
                message: "Invalid consumer locale",
                elementName: "consumer[locale]",
                translationKey: "invalid.consumer.locale",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer locale",
              translationKey: "invalid.consumer.locale",
              elementName: "consumer[locale]",
              value: "Consumer locale is mandatory"
            });
          }
        }
      }

      function isValidPhoneNumber(phone) {
        try {
          var mobilePhoneNumber = '+' + parseInt(phone);
          return phoneUtil.isValidNumber(phoneUtil.parse(mobilePhoneNumber));
        } catch (err) {
          log.warn("Error when trying to format phone number(%s) to E164 %O", phone, err);
          return false;
        }
      }

      function validatePhoneNumber() {
        var mobilePhoneNumber = sanitizeForValidation(consumer.mobilePhoneNumber);
        if (validator.isEmpty(mobilePhoneNumber) && isOptional("mobilePhoneNumber")) {
          return;
        } else {
          if(validator.isEmpty(mobilePhoneNumber)) {
            validationErrors.push({
              message: "Invalid consumer mobile phone number",
              translationKey: "invalid.consumer.mobilePhoneNumber",
              elementName: "consumer[mobilePhoneNumber]",
              value: "Consumer mobile phone number is mandatory"
            });
          } else {
            if(!isValidPhoneNumber(mobilePhoneNumber)) {
              validationErrors.push({
                value: "Consumer mobile phone number format is wrong",
                message: "Invalid consumer mobile phone number",
                elementName: "consumer[mobilePhoneNumber]",
                translationKey: "invalid.consumer.mobilePhoneNumber",
              });
            }
          }
        }
      }

      function validateEmail() {
        var email = sanitizeForValidation(consumer.email);
        if(validator.isEmpty(email) && isOptional("email")) {
          return;
        } else {
          if(!validator.isEmpty(email)) {
            if(!validator.isEmail(email)) {
              validationErrors.push({
                message: "Invalid consumer email",
                translationKey: "invalid.consumer.email",
                elementName: "consumer[email]",
                value: "Consumer email is not valid"
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer email",
              translationKey: "invalid.consumer.email",
              elementName: "consumer[email]",
              value: "Consumer email is mandatory"
            });
          }
        }
      }

      function validateConsumerId() {
        var consumerId = sanitizeForValidation(consumer.consumerId);
        if (validator.isEmpty(consumerId) && isOptional("consumerId")) {
          return;
        } else {
          if (!validator.isEmpty(consumerId)) {
            if (consumerId.length < 1 || consumerId.length > 100) {
              validationErrors.push({
                value: "Consumer consumerId must be between 1 and 100 characters",
                message: "Invalid consumer consumerId",
                elementName: "consumer[consumerId]",
                translationKey: "invalid.consumer.consumerId",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid consumer consumerId",
              translationKey: "invalid.consumer.consumerId",
              elementName: "consumer[consumerId]",
              value: "Consumer consumerId is mandatory"
            });
          }
        }
      }


      function isValidSocialSecurityNumber(ssn, countryCode) {
        if (countryCode && countryCode === "FI") {
          return new FinnishSsnUtil().validate(ssn);
        } else {
          return true;
        }
      }

      function validateConsumerSocialSecurityNumber() {
        var ssn = sanitizeForValidation(consumer.ssn);
        if (validator.isEmpty(ssn) && isOptional("ssn")) {
          return;
        } else {
          if (validator.isEmpty(ssn)) {
            validationErrors.push({
              message: "Invalid consumer social security number",
              translationKey: "invalid.consumer.ssn",
              elementName: "consumer[ssn]",
              value: "Consumer social security number is mandatory"
            });
          } else {
            if (!isValidSocialSecurityNumber(ssn, consumer.countryCode)) {
              validationErrors.push({
                value: "Consumer social security number is not valid",
                message: "Invalid consumer social security number",
                elementName: "consumer[ssn]",
                translationKey: "invalid.consumer.ssn",
              });
            }
          }
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
          validateEmail();
          validateConsumerId();
          validateConsumerSocialSecurityNumber();
          return validationErrors;
        }
      };
    };

    module.exports = ConsumerValidator;
  })();
}());
