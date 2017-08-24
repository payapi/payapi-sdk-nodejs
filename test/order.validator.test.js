(function () {
  "use strict";

  var should = require("should");
  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;
  var jwt = require("jwt-simple");
  var moment = require("moment");
  //const BLACKLISTED_CHARACTERS = ["`", "´", "\"", "{", "}", "<", ">"];

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
      currency: "EUR",
      tosUrl: "https://payapi.io/terms"
    };
    optionalFields = [];
  });

  describe("Order", function() {
    describe("cryptocurrencies", function() {
      it("should not collide with fiat currencies", function() {
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        new OrderValidator(params).cryptoCurrencies.forEach(function(cryptoCurrency){
          if(new OrderValidator(params).fiatCurrencies.indexOf(cryptoCurrency) != -1) {
            throw new Error(cryptoCurrency);
          }
          return expect(
            new OrderValidator(params).fiatCurrencies.indexOf(cryptoCurrency)
            ).to.eql(-1);
          });
      });
    });

    describe("sumInCentsIncVat", function() {
      it("can be optional", function() {
        delete order.sumInCentsIncVat;
        optionalFields = ["sumInCentsIncVat"];
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

      it("should succeed with integer 0", function() {
        order.sumInCentsIncVat = 0;
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
      it("can be optional", function() {
        delete order.sumInCentsExcVat;
        optionalFields = ["sumInCentsExcVat"];
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

      it("should succeed with integer 0", function() {
        order.sumInCentsExcVat = 0;
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

      it("can be optional", function() {
        delete order.vatInCents;
        optionalFields = ["vatInCents"];
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with integer 0", function() {
        order.vatInCents = 0;
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("can be optional and should succeed with integer 0", function() {
        order.vatInCents = 0;
        optionalFields = ["vatInCents"];
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
        expect(validationError.message).to.equal("Invalid VAT in cents");
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
        expect(validationError.message).to.equal("Invalid VAT in cents");
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
        expect(validationError.message).to.equal("Invalid VAT in cents");
        expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
        expect(validationError.value).to.equal(order.vatInCents);
      });

    }); // describe vatInCents

    describe("referenceId", function() {
      it("can be optional", function() {
        delete order.referenceId;
        optionalFields = ["referenceId"];
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("can be mandatory", function() {
        delete order.referenceId;
        optionalFields = ["referenceId"];
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
        order.referenceId = new Array(257).join("x");
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid order reference ID");
        expect(validationError.translationKey).to.equal("invalid.order.referenceId");
        expect(validationError.value).to.equal(order.referenceId);
      });

      /*it("should fail when it contains blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          order.referenceId = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            order: order,
            optionalFields: optionalFields
          };
          var validationError = new OrderValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid order referenceId");
          expect(validationError.translationKey).to.equal("invalid.order.referenceId");
          expect(validationError.elementName).to.equal("order[referenceId]");
          expect(validationError.value).to.equal("Order referenceId is not URL encoded");
        }
      });*/
    }); // describe referenceId

    describe("currency", function() {
      it("cannot be optional", function() {
        delete order.currency;
        optionalFields = ["currency"];
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

      it("should succeed with ['BTC', 'BCH', 'LTC', 'ETH', 'XRP', 'XEM', 'DASH', 'NEO', 'ETC', 'XMR']", function() {
        ["BTC", "BCH", "LTC", "ETH", "XRP", "XEM", "DASH", "NEO", "ETC", "XMR"].forEach(function(cryptoCoin) {
          order.currency = cryptoCoin;
          var params = {
            order: order,
            optionalFields: optionalFields
          };
          return expect(
              new OrderValidator(params).validate()
              ).to.be.empty;
        });
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

    describe("tosUrl", function() {
      it("can be optional", function() {
        delete order.tosUrl;
        optionalFields = ["tosUrl"];
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        return expect(
            new OrderValidator(params).validate()
            ).to.be.empty;
      });

      it("must use https protocol", function() {
        order.tosUrl = "http://payapi.io/terms";
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid order tosUrl. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.order.tosUrl");
        expect(validationError.value).to.equal(order.tosUrl);
      });

      it("must define a protocol", function() {
        order.tosUrl = "payapi.io/terms";
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid order tosUrl. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.order.tosUrl");
        expect(validationError.value).to.equal(order.tosUrl);
      });

      it("must be a valid url", function() {
        order.tosUrl = "hokkus pokkus, filiokkus";
        optionalFields = ["tosUrl"];
        var params = {
          order: order,
          optionalFields: optionalFields
        };
        var validationError = new OrderValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid order tosUrl. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.order.tosUrl");
        expect(validationError.value).to.equal(order.tosUrl);
      });
    }); // describe tosUrl
  });
}());
