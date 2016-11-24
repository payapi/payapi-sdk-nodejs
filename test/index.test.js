(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;
  const moment = require("moment");
  const jwt = require("jwt-simple");
  const jsonwebtoken = require("jsonwebtoken");
  chai.use(chaiAsPromised);
  var PayapiClient = require("../lib/index");
  var paymentObject;
  var apiKey;

  beforeEach(function() {
    apiKey = "abc123";
    paymentObject = {
      payment: {
        ip: "8.8.8.8",
        cardHolderEmail: "nosuchemailaddress@payapi.io",
        cardHolderName: "card holder name",
        paymentMethod: "visa",
        creditCardNumber: "4242 4242 4242 4242",
        ccv: "123",
        expiresMonth: moment().month() + 1 + "",
        expiresYear: moment().year() + ""
      },
      consumer: {
        name: "consumer name",
        locale: "en-US",
        co: "Care of someone",
        streetAddress: "Mannerheimintie 12",
        streetAddress2: "A 123",
        postalCode: "00100",
        city: "Helsinki",
        stateOrProvince: "Uusimaa",
        countryCode: "FI"
      },
      order: {
        sumInCentsIncVat: 1,
        sumInCentsExcVat: 1,
        vatInCents: 1,
        referenceId: "x",
        currency: "EUR"
      },
      products: [{
        priceInCentsIncVat: 1,
        priceInCentsExcVat: 1,
        vatInCents: 1,
        vatPercentage: 22.5,
        quantity: 1
      }]
    };
  });

  describe("PayapiClient", function() {
    describe("CreditCardNumber", function() {
      it("is sanitized", function() {
        var params = {
          payload: paymentObject,
          apiKey: apiKey
        };
        var token = new PayapiClient(params).encodePaymentToken();
        return expect(new PayapiClient({paymentToken: token, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.payment.creditCardNumber).to.equal("4242424242424242");
          });
      });
    });
    describe("CardBin", function() {
      it("is extracted from the cc number before generating the token", function() {
        var params = {
          payload: paymentObject,
          apiKey: apiKey
        };
        var token = new PayapiClient(params).encodePaymentToken();

        return expect(new PayapiClient({paymentToken: token, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.payment.cardBin).to.equal("424242");
          });
      });
    });
    describe("Decoding a token", function() {
      it("should convert Product vatPercentage to a number", function() {
        paymentObject.products[0].vatPercentage = "12.12345";
        var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");
        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.products[0].vatPercentage).to.equal(12.12345);
          });
      });

      it("should convert Product quantity to a number", function() {
        paymentObject.products[0].quantity = "3";
        var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");
        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.products[0].quantity).to.equal(3);
          });
      });

      it("should convert Product priceInCentsIncVat to a number", function() {
        paymentObject.products[0].priceInCentsIncVat = "235";
        var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");
        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.products[0].priceInCentsIncVat).to.equal(235);
          });
      });

      it("should convert Product priceInCentsExcVat to a number", function() {
        paymentObject.products[0].priceInCentsExcVat = "235";
        var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");
        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.products[0].priceInCentsExcVat).to.equal(235);
          });
      });

      it("should contain Order", function() {
        var paymentToken = jwt.encode(paymentObject, apiKey, "HS512");
        return expect(new PayapiClient({paymentToken: paymentToken, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.order).to.not.be.null;
            expect(decodedPaymentToken.order.currency).to.equal("EUR");
          });
      });
    });
  });
}());
