(function () {
  "use strict";
  var ProductValidator = (function() {
    var ProductValidator = function(params) {
      var validator = require("validator");
      var validationErrors = [];
      var product = params.product;
      var optionalFields = params.optionalFields || [];

      function isOptional(field) {
        return optionalFields.indexOf(field) !== -1;
      }

      function validatePriceInCentsIncludingVat() {
        if(!product.priceInCentsIncVat && isOptional("priceInCentsIncVat")) {
          return;
        } else {
          if(product.priceInCentsIncVat) {
            if(!validator.isInt("" + product.priceInCentsIncVat)) {
              validationErrors.push({
                value: "" + product.priceInCentsIncVat,
                message: "Invalid product price in cents including VAT",
                translationKey: "invalid.product.priceInCentsIncVat",
              });
            }
          } else {
            validationErrors.push({
              value: "Product price in cents including VAT is mandatory",
              message: "Invalid product price in cents including VAT",
              translationKey: "invalid.product.priceInCentsIncVat",
            });
          }
        }
      }

      function validatePriceInCentsExcludingVat() {
        if(!product.priceInCentsExcVat && isOptional("priceInCentsExcVat")) {
          return;
        } else {
          if(product.priceInCentsExcVat) {
            if(!validator.isInt("" + product.priceInCentsExcVat)) {
              validationErrors.push({
                value: "" + product.priceInCentsExcVat,
                message: "Invalid product price in cents excluding VAT",
                translationKey: "invalid.product.priceInCentsExcVat",
              });
            }
          } else {
            validationErrors.push({
              value: "Product price in cents excluding VAT is mandatory",
              message: "Invalid product price in cents excluding VAT",
              translationKey: "invalid.product.priceInCentsExcVat",
            });
          }
        }
      }

      //function validatePriceInCentsExcludingVat() {
      //  if(!isOptional("priceInCentsExcVat") &&
      //      !validator.isInt("" + product.priceInCentsExcVat)) {
      //    validationErrors.push({
      //      value: "" + product.priceInCentsExcVat,
      //      message: "Invalid product price in cents excluding VAT",
      //      translationKey: "invalid.product.priceInCentsExcVat",
      //    });
      //  }
      //}

      function validateVatPercentage() {
        if(!isOptional("vatPercentage") &&
            !validator.isFloat("" + product.vatPercentage)) {
          validationErrors.push({
            value: "" + product.vatPercentage,
            message: "Invalid product vatPercentage",
            translationKey: "invalid.product.vatPercentage",
          });
        }
      }

      function validateQuantity() {
        if(!isOptional("quantity") && !validator.isInt("" + product.quantity)) {
          validationErrors.push({
            value: "" + product.quantity,
            message: "Invalid product quantity",
            translationKey: "invalid.product.quantity",
          });
        }
      }

      return {
        validate: function() {
          validatePriceInCentsIncludingVat();
          validatePriceInCentsExcludingVat();
          validateVatPercentage();
          validateQuantity();
          return validationErrors;
        }
      };
    };

    if (typeof window === "undefined") {
      module.exports = ProductValidator;
    } else {
      window.ProductValidator = ProductValidator;
    }
  })();
}());
