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

      function sanitizeForValidation(value) {
        value = value ? validator.stripLow(value + "").replace(/\s\s+/g, " ") : value + "";
        return value;
      }

      function isNumber(n) {
        var nSanitized = sanitizeForValidation(n);
        return validator.isNumeric(nSanitized) || validator.isDecimal(nSanitized);
      }

      function isPositiveNumber(n) {
        return isNumber(n) &&
          Number(n) >= 0 &&
          Number(n) <= Number.MAX_SAFE_INTEGER;
      }

      function validatePriceIncludingVat() {
        if (product.priceIncVat === 0 || (!product.priceIncVat && isOptional("priceIncVat"))) {
          return;
        } else {
          if(product.priceIncVat) {
            if(!isPositiveNumber(product.priceIncVat)) {
              validationErrors.push({
                value: "" + product.priceIncVat,
                message: "Invalid product price including VAT",
                translationKey: "invalid.product.priceIncVat",
              });
            } else {
              optionalFields.push("priceInCentsIncVat");
            }
          } else {
            validationErrors.push({
              value: "Product price including VAT is mandatory",
              message: "Invalid product price including VAT",
              translationKey: "invalid.product.priceIncVat",
            });
          }
        }
      }

      function validatePriceExcludingVat() {
        if (product.priceExcVat === 0 || (!product.priceExcVat && isOptional("priceExcVat"))) {
          return;
        } else {
          if(product.priceExcVat) {
            if(!isPositiveNumber(product.priceExcVat)) {
              validationErrors.push({
                value: "" + product.priceExcVat,
                message: "Invalid product price excluding VAT",
                translationKey: "invalid.product.priceExcVat",
              });
            } else {
              optionalFields.push("priceInCentsExcVat");
            }
          } else {
            validationErrors.push({
              value: "Product price excluding VAT is mandatory",
              message: "Invalid product price excluding VAT",
              translationKey: "invalid.product.priceExcVat",
            });
          }
        }
      }

      function validateVat() {
        if (product.vat === 0 || (!product.vat && isOptional("vat"))) {
          return;
        } else {
          if(product.vat) {
            if(!isPositiveNumber(product.vat)) {
              validationErrors.push({
                value: "" + product.vat,
                message: "Invalid product VAT",
                translationKey: "invalid.product.vat",
              });
            } else {
              optionalFields.push("vatInCents");
            }
          } else {
            validationErrors.push({
              value: "Product price in cents excluding VAT is mandatory",
              message: "Invalid product VAT",
              translationKey: "invalid.product.vat",
            });
          }
        }
      }

      function validateVatInCents() {
        if (product.vatInCents === 0 || (!product.vatInCents && isOptional("vatInCents"))) {
          return;
        } else {
          if(product.vatInCents) {
            if(!validator.isInt("" + product.vatInCents)) {
              validationErrors.push({
                value: "" + product.vatInCents,
                message: "Invalid product VAT in cents",
                translationKey: "invalid.product.vatInCents",
              });
            }
          } else {
            validationErrors.push({
              value: "Product price in cents excluding VAT is mandatory",
              message: "Invalid product VAT in cents",
              translationKey: "invalid.product.vatInCents",
            });
          }
        }
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
        if(product.imageUrl === null) {
          delete product.imageUrl;
        }
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

      function validateDescription() {
        if(!product.description && isOptional("description")) {
          return;
        } else {
          if(!product.description) {
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
          if(!product.title) {
            validationErrors.push({
              value: "Product title is mandatory",
              message: "Invalid title",
              translationKey: "invalid.product.title",
            });
          }
        }
      }

      function validateCategory() {
        if(!product.category && isOptional("category")) {
          return;
        } else {
          if(!product.category) {
            validationErrors.push({
              value: "Product category is mandatory",
              message: "Invalid category",
              translationKey: "invalid.product.category",
            });
          }
        }
      }

      function validateModel() {
        if(!product.model && isOptional("model")) {
          return;
        } else {
          if(!product.model) {
            validationErrors.push({
              value: "Product model is mandatory",
              message: "Invalid product model",
              translationKey: "invalid.product.model",
            });
          }
        }
      }

      function validateExtraData() {
        if(!product.extraData && isOptional("extraData")) {
          return;
        } else {
          if(!product.extraData) {
            validationErrors.push({
              value: "Product extraData is mandatory",
              message: "Invalid product extraData",
              translationKey: "invalid.product.extraData",
            });
          }
        }
      }

      function validateOptions() {
        if (!product.options && isOptional("options")) {
          return;
        } else {
          if (!product.options) {
            validationErrors.push({
              value: "Product options is mandatory",
              message: "Invalid product options",
              translationKey: "invalid.product.options",
            });
          }
        }
      }

      return {
        validate: function() {
          validatePriceIncludingVat();
          validatePriceExcludingVat();
          validateVat();
          validatePriceInCentsIncludingVat();
          validatePriceInCentsExcludingVat();
          validateVatInCents();
          validateVatPercentage();
          validateDescription();
          validateTitle();
          validateCategory();
          validateModel();
          validateExtraData();
          validateQuantity();
          validateImageUrl();
          validateOptions();
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
