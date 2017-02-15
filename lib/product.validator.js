(function () {
  "use strict";
  var ProductValidator = (function() {
    var ProductValidator = function(params) {
      var validator = require("validator");
      var UrlValidator = require("./url.validator");
      var validationErrors = [];
      var product = params.product;
      var optionalFields = params.optionalFields || [];

      function isOptional(field) {
        return optionalFields.indexOf(field) !== -1;
      }

      function validatePriceInCentsIncludingVat() {
        if (product.priceInCentsIncVat === 0 || (!product.priceInCentsIncVat && isOptional("priceInCentsIncVat"))) {
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
        if (product.priceInCentsExcVat === 0 || (!product.priceInCentsExcVat && isOptional("priceInCentsExcVat"))) {
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

      function validateVatPercentage() {
        if(product.vatPercentage === 0 || (!product.vatPercentage && isOptional("vatPercentage"))) {
          return;
        } else {
          if(product.vatPercentage) {
            if(!validator.isFloat("" + product.vatPercentage)) {
              validationErrors.push({
                value: "" + product.vatPercentage,
                message: "Invalid product vatPercentage",
                translationKey: "invalid.product.vatPercentage",
              });
            }
          } else {
            validationErrors.push({
              value: "Product vatPercentage is mandatory",
              message: "Invalid vatPercentage",
              translationKey: "invalid.product.vatPercentage",
            });
          }
        }
      }

      function validateQuantity() {
        if(product.quantity === 0 || (!product.quantity && isOptional("quantity"))) {
          return;
        } else {
          if(product.quantity) {
            if(!validator.isInt("" + product.quantity)) {
              validationErrors.push({
                value: "" + product.quantity,
                message: "Invalid product quantity",
                translationKey: "invalid.product.quantity",
              });
            }
          } else {
            validationErrors.push({
              value: "Product quantity is mandatory",
              message: "Invalid quantity",
              translationKey: "invalid.product.quantity",
            });
          }
        }
      }

      function validateImageUrl() {
        if(!product.imageUrl && isOptional("imageUrl")) {
          return;
        } else {
          if(product.imageUrl) {
            if(!new UrlValidator({url: product.imageUrl}).validate()) {
              validationErrors.push({
                value: "" + product.imageUrl,
                message: "Invalid product imageUrl. Make sure you are using https protocol.",
                translationKey: "invalid.product.imageUrl",
              });
            }
          } else {
            validationErrors.push({
              value: "Product imageUrl is mandatory",
              message: "Invalid imageUrl",
              translationKey: "invalid.product.imageUrl",
            });
          }
        }
      }

      return {
        validate: function() {
          validatePriceInCentsIncludingVat();
          validatePriceInCentsExcludingVat();
          validateVatPercentage();
          validateQuantity();
          validateImageUrl();
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
