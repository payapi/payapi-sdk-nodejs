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
      quantity: 1
    };
    optionalFields = [];
  });

  describe("Product", function() {
    describe("priceInCentsIncVat", function() {
      it("can be optional", function() {
        delete product.priceInCentsIncVat;
        optionalFields = ['priceInCentsIncVat'];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
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
        product.priceInCentsIncVat = '1';
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
        expect(validationError.value).to.equal('' + product.priceInCentsIncVat);
      });
    });
    describe("priceInCentsExcVat", function() {
      it("can be optional", function() {
        delete product.priceInCentsExcVat;
        optionalFields = ['priceInCentsExcVat'];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
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
        product.priceInCentsExcVat = '1';
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
        expect(validationError.value).to.equal('' + product.priceInCentsExcVat);
      });
    });
    describe("vatPercentage", function() {
      it("can be optional", function() {
        var vatPercentage = product.vatPercentage;
        delete product.vatPercentage;
        optionalFields = ['vatPercentage'];
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
      it("should fail with string '22,5'", function() {
        product.vatPercentage = "22,5";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product vatPercentage");
        expect(validationError.translationKey).to.equal("invalid.product.vatPercentage");
        expect(validationError.value).to.equal('' + product.vatPercentage);
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
        optionalFields = ['quantity'];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
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
        product.quantity = '1';
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
        expect(validationError.value).to.equal('' + product.quantity);
      });
    });
  });

}());
