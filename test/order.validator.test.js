(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;
  const jwt = require("jwt-simple");
  const moment = require("moment");
  chai.use(chaiAsPromised);
  var OrderValidator = require("../lib/order.validator");
  var order;
  var optionalFields;

  beforeEach(function() {
    order = {
      sumInCentsIncVat: 1,
      sumInCentsExcVat: 1,
      vatInCents: 1,
      referenceId: "x",
      currency: "EUR"
    };
    optionalFields = [];
  });

  describe("Order", function() {
    describe("sumInCentsIncVat", function() {
      it("can be optional", function() {
        delete order.sumInCentsIncVat;
        optionalFields = ['sumInCentsIncVat'];
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with integer 1", function() {
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail with fractional 0.1", function() {
        order.sumInCentsIncVat = 0.1;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum in cents including VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumInCentsIncVat");
        expect(validationError.value).to.equal(order.sumInCentsIncVat);
      });

      it("should fail with negative 1", function() {
        order.sumInCentsIncVat = -1;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum in cents including VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumInCentsIncVat");
        expect(validationError.value).to.equal(order.sumInCentsIncVat);
      });

      it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
        order.sumInCentsIncVat = Number.MAX_SAFE_INTEGER + 1;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum in cents including VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumInCentsIncVat");
        expect(validationError.value).to.equal(order.sumInCentsIncVat);
      });
    });

    describe("sumInCentsExcVat", function() {
      it("should succeed with integer 1", function() {
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail with fractional 0.1", function() {
        order.sumInCentsExcVat = 0.1;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumInCentsExcVat");
        expect(validationError.value).to.equal(order.sumInCentsExcVat);
      });

      it("should fail with negative 1", function() {
        order.sumInCentsExcVat = -1;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumInCentsExcVat");
        expect(validationError.value).to.equal(order.sumInCentsExcVat);
      });

      it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
        order.sumInCentsExcVat = Number.MAX_SAFE_INTEGER + 1;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumInCentsExcVat");
        expect(validationError.value).to.equal(order.sumInCentsExcVat);
      });

    }); // describe sumInCentsExcVat

    describe("vatInCents", function() {
      it("should succeed with integer 1", function() {
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail with fractional 0.1", function() {
        order.vatInCents = 0.1;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid VAT in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
        expect(validationError.value).to.equal(order.vatInCents);
      });

      it("should fail with negative 1", function() {
        order.vatInCents = -1;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid VAT in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
        expect(validationError.value).to.equal(order.vatInCents);
      });

      it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
        order.vatInCents = Number.MAX_SAFE_INTEGER + 1;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid VAT in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
        expect(validationError.value).to.equal(order.vatInCents);
      });

    }); // describe vatInCents

    describe("referenceId", function() {
      it("can be optional", function() {
        delete order.referenceId;
        optionalFields = ['referenceId'];
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with x", function() {
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail when longer than 255 characters", function() {
        order.referenceId = new Array(257).join('x');
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid order reference ID");
        expect(validationError.translationKey).to.equal("invalid.order.referenceId");
        expect(validationError.value).to.equal(order.referenceId);
      });
    }); // describe referenceId

    describe("currency", function() {
      it("cannot be optional", function() {
        delete order.currency;
        optionalFields = ['currency'];
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid order currency");
        expect(validationError.translationKey).to.equal("invalid.order.currency");
        expect(validationError.value).to.equal("Order currency is mandatory");
      });

      it("should succeed with EUR", function() {
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail when not found in currencies list", function() {
        order.currency = "DIIBA";
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid order currency");
        expect(validationError.translationKey).to.equal("invalid.order.currency");
        expect(validationError.value).to.equal(order.currency);
      });

    }); // describe currency

  });
}());

