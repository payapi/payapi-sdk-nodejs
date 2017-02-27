(function () {
  "use strict";
  var ShippingAddressValidator = (function() {
    var ShippingAddressValidator = function(params) {
      var validationErrors = [];
      var validator = require("validator");
      var shippingAddress = params.shippingAddress;
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

      function validateRecipientName() {
        var shippingAddressName = sanitizeForValidation(shippingAddress.recipientName);
        if(validator.isEmpty(shippingAddressName) && isOptional("recipientName")) {
          return;
        } else {
          if(validator.isEmpty(shippingAddressName)) {
            validationErrors.push({
              message: "Invalid shippingAddress recipientName",
              translationKey: "invalid.shippingAddress.recipientName",
              elementName: "shippingAddress[recipientName]",
              value: "ShippingAddress recipientName is mandatory"
            });
          } else {
            if(!isValidName(shippingAddressName)) {
              validationErrors.push({
                value: "ShippingAddress recipientName is must be between 2 and 52 characters",
                message: "Invalid shippingAddress recipientName",
                elementName: "shippingAddress[recipientName]",
                translationKey: "invalid.shippingAddress.recipientName",
              });
            }
            else if(shippingAddressName.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "ShippingAddress recipientName is not URL encoded",
                message: "Invalid shippingAddress recipientName",
                elementName: "shippingAddress[recipientName]",
                translationKey: "invalid.shippingAddress.recipientName",
              });
            }
          }
        }
      }

      function validateCo() {
        var co = sanitizeForValidation(shippingAddress.co);
        if(validator.isEmpty(co) && isOptional("co")) {
          return;
        } else {
          if(!validator.isEmpty(co)) {
            if(!isValidName(co)) {
              validationErrors.push({
                value: "ShippingAddress c/o must be between 2 and 52 characters",
                message: "Invalid shippingAddress c/o",
                elementName: "shippingAddress[co]",
                translationKey: "invalid.shippingAddress.co",
              });
            } else if(co.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "ShippingAddress c/o is not URL encoded",
                message: "Invalid shippingAddress c/o",
                elementName: "shippingAddress[co]",
                translationKey: "invalid.shippingAddress.co",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid shippingAddress c/o",
              translationKey: "invalid.shippingAddress.co",
              elementName: "shippingAddress[co]",
              value: "ShippingAddress co is mandatory"
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
        var streetAddress = sanitizeForValidation(shippingAddress.streetAddress);

        if(validator.isEmpty(streetAddress) && isOptional("streetAddress")) {
          return;
        } else {
          if(!validator.isEmpty(streetAddress)) {
            if(!isValidStreetAddress(streetAddress)) {
              validationErrors.push({
                value: "ShippingAddress street address must be between 2 and 52 characters",
                message: "Invalid shippingAddress street address",
                elementName: "shippingAddress[streetAddress]",
                translationKey: "invalid.shippingAddress.streetAddress",
              });
            } else if(streetAddress.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "ShippingAddress street address is not URL encoded",
                message: "Invalid shippingAddress street address",
                elementName: "shippingAddress[streetAddress]",
                translationKey: "invalid.shippingAddress.streetAddress",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid shippingAddress street address",
              translationKey: "invalid.shippingAddress.streetAddress",
              elementName: "shippingAddress[streetAddress]",
              value: "ShippingAddress street address is mandatory"
            });
          }
        }
      }

      function validateStreetAddress2() {
        var streetAddress2 = sanitizeForValidation(shippingAddress.streetAddress2);

        if(validator.isEmpty(streetAddress2) && isOptional("streetAddress2")) {
          return;
        } else {
          if(!validator.isEmpty(streetAddress2)) {
            if(!isValidStreetAddress(streetAddress2)) {
              validationErrors.push({
                value: "ShippingAddress street address 2 must be between 2 and 52 characters",
                message: "Invalid shippingAddress street address 2",
                elementName: "shippingAddress[streetAddress2]",
                translationKey: "invalid.shippingAddress.streetAddress2",
              });
            } else if(streetAddress2.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "ShippingAddress street address 2 is not URL encoded",
                message: "Invalid shippingAddress street address 2",
                elementName: "shippingAddress[streetAddress2]",
                translationKey: "invalid.shippingAddress.streetAddress2",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid shippingAddress street address 2",
              translationKey: "invalid.shippingAddress.streetAddress2",
              elementName: "shippingAddress[streetAddress2]",
              value: "ShippingAddress street address 2 is mandatory"
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
        var postalCode = sanitizeForValidation(shippingAddress.postalCode);
        if(validator.isEmpty(postalCode) && isOptional("postalCode")) {
          return;
        } else {
          if(!validator.isEmpty(postalCode)) {
            if(!isValidPostalCode(postalCode)) {
              validationErrors.push({
                value: "ShippingAddress postal code must be between 2 and 10 characters",
                message: "Invalid shippingAddress postal code",
                elementName: "shippingAddress[postalCode]",
                translationKey: "invalid.shippingAddress.postalCode",
              });
            } else if(postalCode.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "ShippingAddress postal code is not URL encoded",
                message: "Invalid shippingAddress postal code",
                elementName: "shippingAddress[postalCode]",
                translationKey: "invalid.shippingAddress.postalCode",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid shippingAddress postal code",
              translationKey: "invalid.shippingAddress.postalCode",
              elementName: "shippingAddress[postalCode]",
              value: "ShippingAddress postal code is mandatory"
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
        var city = sanitizeForValidation(shippingAddress.city);
        if(validator.isEmpty(city) && isOptional("city")) {
          return;
        } else {
          if(!validator.isEmpty(city)) {
            if(!isValidCity(city)) {
              validationErrors.push({
                value: "ShippingAddress city must be between 2 and 53 characters",
                message: "Invalid shippingAddress city",
                elementName: "shippingAddress[city]",
                translationKey: "invalid.shippingAddress.city",
              });
            } else if(city.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "ShippingAddress city is not URL encoded",
                message: "Invalid shippingAddress city",
                elementName: "shippingAddress[city]",
                translationKey: "invalid.shippingAddress.city",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid shippingAddress city",
              translationKey: "invalid.shippingAddress.city",
              elementName: "shippingAddress[city]",
              value: "ShippingAddress city is mandatory"
            });
          }
        }
      }

      function validateStateOrProvince() {
        var stateOrProvince = sanitizeForValidation(shippingAddress.stateOrProvince);
        if (validator.isEmpty(stateOrProvince) && isOptional("stateOrProvince")) {
          return;
        } else {
          if (!validator.isEmpty(stateOrProvince)) {
            if (stateOrProvince.length < 2 || stateOrProvince.length > 52) {
              validationErrors.push({
                value: "ShippingAddress state or province must be between 2 and 52 characters",
                message: "Invalid shippingAddress state or province",
                elementName: "shippingAddress[stateOrProvince]",
                translationKey: "invalid.shippingAddress.stateOrProvince",
              });
            } else if (stateOrProvince.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "ShippingAddress state or province is not URL encoded",
                message: "Invalid shippingAddress state or province",
                elementName: "shippingAddress[stateOrProvince]",
                translationKey: "invalid.shippingAddress.stateOrProvince",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid shippingAddress state or province",
              translationKey: "invalid.shippingAddress.stateOrProvince",
              elementName: "shippingAddress[stateOrProvince]",
              value: "ShippingAddress state or province is mandatory"
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
        var countryCode = sanitizeForValidation(shippingAddress.countryCode);
        if (validator.isEmpty(countryCode) && isOptional("countryCode")) {
          return;
        } else {
          if (!validator.isEmpty(countryCode)) {
            if (!isValidCountryCode(countryCode)) {
              validationErrors.push({
                value: "ShippingAddress country code is not valid",
                message: "Invalid shippingAddress country code",
                elementName: "shippingAddress[countryCode]",
                translationKey: "invalid.shippingAddress.countryCode",
              });
            }
          } else {
            validationErrors.push({
              message: "Invalid shippingAddress country code",
              translationKey: "invalid.shippingAddress.countryCode",
              elementName: "shippingAddress[countryCode]",
              value: "ShippingAddress country code is mandatory"
            });
          }
        }
      }

      return {
        validate: function() {
          validateRecipientName();
          validateCo();
          validateStreetAddress();
          validateStreetAddress2();
          validatePostalCode();
          validateCity();
          validateStateOrProvince();
          validateCountryCode();
          return validationErrors;
        }
      };
    };

    module.exports = ShippingAddressValidator;
  })();
}());
