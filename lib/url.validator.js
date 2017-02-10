(function () {
  "use strict";
  var UrlValidator = (function() {
    var UrlValidator = function(params) {
      var validator = require("validator");
      var BLACKLISTED_CHARACTERS = /[`'";{}<>]+/gi;

      function sanitizeForValidation(value) {
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : value + "";
        return value;
      }

      function validateUrl() {
        var urlOptions = {
          protocols: ["https"],
          require_valid_protocol: true,
          require_protocol: true
        };
        return validator.isURL(sanitizeForValidation(params.url), urlOptions);
      }

      return {
        validate: function() {
          return validateUrl();
        }
      };
    };

    if (typeof window === "undefined") {
      module.exports = UrlValidator;
    } else {
      window.UrlValidator = UrlValidator;
    }
  })();
}());
