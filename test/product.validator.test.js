(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;
  const jwt = require("jwt-simple");
  chai.use(chaiAsPromised);
  var ProductValidator = require("../lib/product.validator");
  var product;
  var optionalFields;

  beforeEach(function() {
    product = {
      priceInCentsIncVat: 1,
      priceInCentsExcVat: 1,
      vatInCents: 1,
      vatPercentage: 22.5,
      quantity: 1,
      imageUrl: "https://example.com/doge.jpg"
    };
    optionalFields = [];
  });

  describe("Product", function() {
    describe("priceInCentsIncVat", function() {
      it("can be optional", function() {
        delete product.priceInCentsIncVat;
        optionalFields = ["priceInCentsIncVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("can be optional but must be valid anyway", function() {
        product.priceInCentsIncVat = "diiba";
        optionalFields = ["priceInCentsIncVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price in cents including VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceInCentsIncVat");
        expect(validationError.value).to.equal("diiba");
      });
      it("should succeed with integer 1", function() {
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '1'", function() {
        product.priceInCentsIncVat = "1";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 0", function() {
        product.priceInCentsIncVat = 0;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '0'", function() {
        product.priceInCentsIncVat = "0";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with 150000", function() {
        product.priceInCentsIncVat = 150000;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with fractional 0.1", function() {
        product.priceInCentsIncVat = 0.1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price in cents including VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceInCentsIncVat");
        expect(validationError.value).to.equal("" + product.priceInCentsIncVat);
      });
    });
    describe("priceInCentsExcVat", function() {
      it("can be optional", function() {
        delete product.priceInCentsExcVat;
        optionalFields = ["priceInCentsExcVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("can be optional but must be valid anyway", function() {
        product.priceInCentsExcVat = "diiba";
        optionalFields = ["priceInCentsExcVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceInCentsExcVat");
        expect(validationError.value).to.equal("diiba");
      });
      it("should succeed with integer 1", function() {
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '1'", function() {
        product.priceInCentsExcVat = "1";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '0'", function() {
        product.priceInCentsExcVat = "0";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string 0", function() {
        product.priceInCentsExcVat = 0;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '99900'", function() {
        product.priceInCentsExcVat = "99900";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with fractional 0.1", function() {
        product.priceInCentsExcVat = 0.1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceInCentsExcVat");
        expect(validationError.value).to.equal("" + product.priceInCentsExcVat);
      });
    });
    describe("vatPercentage", function() {
      it("can be optional", function() {
        var vatPercentage = product.vatPercentage;
        delete product.vatPercentage;
        optionalFields = ["vatPercentage"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 1", function() {
        product.vatPercentage = 1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 0", function() {
        product.vatPercentage = 0;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '1'", function() {
        product.vatPercentage = "1";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '22.5'", function() {
        product.vatPercentage = "22.5";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '22.12345'", function() {
        product.vatPercentage = "22.12345";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with string '22,5'", function() {
        product.vatPercentage = "22,5";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product vatPercentage");
        expect(validationError.translationKey).to.equal("invalid.product.vatPercentage");
        expect(validationError.value).to.equal("" + product.vatPercentage);
      });
      it("should succeed with fractional 0.1", function() {
        product.vatPercentage = 0.1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
    });
    describe("quantity", function() {
      it("can be optional", function() {
        delete product.quantity;
        optionalFields = ["quantity"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 1", function() {
        product.quantity = 1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 0", function() {
        product.quantity = 0;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '1'", function() {
        product.quantity = "1";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with fractional 0.1", function() {
        product.quantity = 0.1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product quantity");
        expect(validationError.translationKey).to.equal("invalid.product.quantity");
        expect(validationError.value).to.equal("" + product.quantity);
      });
    }); // quantity

    describe("imageUrl", function() {
      it("can be optional", function() {
        delete product.imageUrl;
        optionalFields = ["imageUrl"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("is successful with staging image", function() {
        product.imageUrl = "https://store.multimerchantshop.xyz/media/983ab1519a8b553ec58125a13bf09471/image/cache/catalog/hp_1-228x228.jpg";
        optionalFields = ["imageUrl"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
    }); // imageUrl
  });
}());
