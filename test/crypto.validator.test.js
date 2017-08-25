(function () {
  "use strict";

  var should = require("should");
  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;
  var jwt = require("jwt-simple");
  var moment = require("moment");

  chai.use(chaiAsPromised);
  var CryptoValidator = require("../lib/crypto.validator");
  var crypto;
  var optionalFields;

  beforeEach(function() {
    crypto = {
      sumIncVat: 1,
      sumExcVat: 1,
      vat: 1,
      currency: "BTC"
    };
    optionalFields = [];
  });

  describe("Crypto", function() {
    describe("sumIncVat", function() {
      it("can be optional", function() {
        delete crypto.sumIncVat;
        optionalFields = ["sumIncVat"];
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with integer 1", function() {
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with integer 0", function() {
        crypto.sumIncVat = 0;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with fractional 0.1", function() {
        crypto.sumIncVat = 0.1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail with negative 1", function() {
        crypto.sumIncVat = -1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        var validationError = new CryptoValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum including VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumIncVat");
        expect(validationError.value).to.equal(crypto.sumIncVat);
      });

      it("should fail with negative 0.1", function() {
        crypto.sumIncVat = -0.1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        var validationError = new CryptoValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum including VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumIncVat");
        expect(validationError.value).to.equal(crypto.sumIncVat);
      });

      it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
        crypto.sumIncVat = Number.MAX_SAFE_INTEGER + 1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        var validationError = new CryptoValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum including VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumIncVat");
        expect(validationError.value).to.equal(crypto.sumIncVat);
      });
    });

    describe("sumExcVat", function() {
      it("can be optional", function() {
        delete crypto.sumExcVat;
        optionalFields = ["sumExcVat"];
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with integer 1", function() {
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with integer 0", function() {
        crypto.sumExcVat = 0;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with fractional 0.1", function() {
        crypto.sumExcVat = 0.1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail with negative 1", function() {
        crypto.sumExcVat = -1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        var validationError = new CryptoValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumExcVat");
        expect(validationError.value).to.equal(crypto.sumExcVat);
      });

      it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
        crypto.sumExcVat = Number.MAX_SAFE_INTEGER + 1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        var validationError = new CryptoValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid sum excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.order.sumExcVat");
        expect(validationError.value).to.equal(crypto.sumExcVat);
      });

    }); // describe sumExcVat

    describe("vat", function() {
      it("should succeed with integer 1", function() {
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("can be optional", function() {
        delete crypto.vat;
        optionalFields = ["vat"];
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with integer 0", function() {
        crypto.vat = 0;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("can be optional and should succeed with integer 0", function() {
        crypto.vat = 0;
        optionalFields = ["vat"];
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with fractional 0.1", function() {
        crypto.vat = 0.1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail with negative 1", function() {
        crypto.vat = -1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        var validationError = new CryptoValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid VAT");
        expect(validationError.translationKey).to.equal("invalid.order.vat");
        expect(validationError.value).to.equal(crypto.vat);
      });

      it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
        crypto.vat = Number.MAX_SAFE_INTEGER + 1;
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        var validationError = new CryptoValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid VAT");
        expect(validationError.translationKey).to.equal("invalid.order.vat");
        expect(validationError.value).to.equal(crypto.vat);
      });

    }); // describe vat

    describe("currency", function() {
      it("cannot be optional", function() {
        delete crypto.currency;
        optionalFields = ["currency"];
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        var validationError = new CryptoValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid order currency");
        expect(validationError.translationKey).to.equal("invalid.order.currency");
        expect(validationError.value).to.equal("Order currency is mandatory");
      });

      it("should succeed with BTC", function() {
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        return expect(
            new CryptoValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with ['BTC', 'BCH', 'LTC', 'ETH', 'XRP', 'XEM', 'DASH', 'NEO', 'ETC', 'XMR']", function() {
        ["BTC", "BCH", "LTC", "ETH", "XRP", "XEM", "DASH", "NEO", "ETC", "XMR"].forEach(function(cryptoCoinCurrency) {
          crypto.currency = cryptoCoinCurrency;
          var params = {
            crypto: crypto,
            optionalFields: optionalFields
          };
          return expect(
              new CryptoValidator(params).validate()
              ).to.be.empty;
        });
      });

      it("should fail when not found in currencies list", function() {
        crypto.currency = "DIIBA";
        var params = {
          crypto: crypto,
          optionalFields: optionalFields
        };
        var validationError = new CryptoValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid order currency");
        expect(validationError.translationKey).to.equal("invalid.order.currency");
        expect(validationError.value).to.equal(crypto.currency);
      });
    }); // describe currency

  });
}());
