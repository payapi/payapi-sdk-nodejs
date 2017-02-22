(function () {
  "use strict";
  var ProductValidator = (function() {
    var ProductValidator = function(params) {
      const validator = require("validator");
      const UrlValidator = require("./url.validator");
      const BLACKLISTED_CHARACTERS = /[`´";{}<>]+/gi;

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
            if(product.imageUrl.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "Product imageUrl is not URL encoded",
                message: "Invalid product imageUrl",
                translationKey: "invalid.product.imageUrl",
              });
            } else if(!new UrlValidator({url: product.imageUrl}).validate()) {
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

      function validateDescription() {
        if(!product.description && isOptional("description")) {
          return;
        } else {
          if(product.description) {
            if(product.description.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "Product description is not URL encoded",
                message: "Invalid product description",
                translationKey: "invalid.product.description",
              });
            }
          } else {
            validationErrors.push({
              value: "Product description is mandatory",
              message: "Invalid description",
              translationKey: "invalid.product.description",
            });
          }
        }
      }

      function validateTitle() {
        if(!product.title && isOptional("title")) {
          return;
        } else {
          if(product.title) {
            if(product.title.match(BLACKLISTED_CHARACTERS)) {
              validationErrors.push({
                value: "Product title is not URL encoded",
                message: "Invalid product title",
                translationKey: "invalid.product.title",
              });
            }
          } else {
            validationErrors.push({
              value: "Product title is mandatory",
              message: "Invalid title",
              translationKey: "invalid.product.title",
            });
          }
        }
      }

      return {
        validate: function() {
          validatePriceInCentsIncludingVat();
          validatePriceInCentsExcludingVat();
          validateVatPercentage();
          validateDescription();
          validateTitle();
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
