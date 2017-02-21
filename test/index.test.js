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
        currency: "EUR",
        tosUrl: "https://payapi.io/terms"
      },
      products: [{
        priceInCentsIncVat: 1,
        priceInCentsExcVat: 1,
        vatInCents: 1,
        vatPercentage: 22.5,
        quantity: 1,
        imageUrl: "https://example.com/doge.jpg"
      }],
      callbacks: {
        success: "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
        failed: "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
        chargeback: "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
        processing: "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback"
      },
      returnUrls: {
        success: "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
        cancel: "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
        failed: "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
      }
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
      it("should encode Product imageUrl", function() {
        paymentObject.products[0].imageUrl = "https://www.example.com/media/3901fe62872146838fdcafc0b673dbf6/image/cache/catalog/ZALE SS17/9215_11 copy-600x800.jpg";
        var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");

        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.products[0].imageUrl).to.equal(
              "https://www.example.com/media/3901fe62872146838fdcafc0b673dbf6/image/cache/catalog/ZALE%20SS17/9215_11%20copy-600x800.jpg"
            );
          });
      });

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

      it("should work with secure form's fake data object", function() {
        // NOTE: in secure form the shipping address fields are merged into consumer.
        var fakeDataObject = {
          "order": {
            "sumInCentsIncVat": 344,
            "sumInCentsExcVat": 300,
            "vatInCents": 22,
            "currency": "EUR",
            "referenceId": "ref123",
            "tosUrl":"https://payapi.io/terms"
          },
          "products": [
          {
            "id": "bbc123456",
            "quantity": 1,
            "title": "Black bling cap",
            "description": "Flashy fine cap",
            "imageUrl": "https://staging-store.example.com/image/c526e8973ba519c35bf391e63fae44db/cache/catalog/demo/canon_eos_5d_1-228x228.jpg",
            "category": "Caps and hats",
            "priceInCentsIncVat": 122,
            "priceInCentsExcVat": 100,
            "vatInCents": 22,
            "vatPercentage": 22,
            "extraData": "color=blue&size=M"
          },
          {
            "id": "pbc123456",
            "quantity": 1,
            "title": "Pink bling cap",
            "description": "Flashy fine cap",
            "imageUrl": "https://staging-store.example.com/image/c526e8973ba519c35bf391e63fae44db/cache/catalog/demo/iphone_1-500x500.jpg",
            "category": "Caps and hats",
            "priceInCentsIncVat": 222,
            "priceInCentsExcVat": 200,
            "vatInCents": 22,
            "vatPercentage": 22,
            "extraData": "color=blue&size=M"
          }
          ],
          "consumer": {
            "recipientName": "John Doe",
            "co": "Jane Doe",
            "streetAddress": "Calle Andalucia 32",
            "streetAddress2": "Los Boliches",
            "postalCode": 29640,
            "city": "Fuengirola",
            "stateOrProvince": "Malaga",
            "countryCode": "ES",
            "consumerId": "happy88",
            "email": "happyconsumer@example.com"
          },
          "callbacks": {
            "processing": "https://staging-api.example.com/v1/callback-processing",
            "success": "https://staging-api.example.com/v1/callback-success",
            "failed": "https://staging-api.example.com/v1/callback-failed",
            "chargeback": "https://staging-api.example.com/v1/callback-chargeback"
          },
          "returnUrls": {
            "success": "https://staging-api.example.com/v1/callback-success",
            "cancel": "https://staging-api.example.com/v1/callback-cancel",
            "failed": "https://staging-api.example.com/v1/callback-failed"
          }
        };
        var paymentToken = jwt.encode(fakeDataObject, apiKey, "HS512");
        var optionalFields = [ 'product.id',
          'product.description',
          'product.imageUrl',
          'product.category',
          'product.extraData',
          'consumer',
          'callbacks',
          'returnUrls',
          'payment.ip',
          'payment.cardHolderEmail',
          'payment.cardHolderName',
          'payment.creditCardNumber',
          'payment.paymentMethod',
          'payment.ccv',
          'payment.expiresMonth',
          'payment.expiresYear'
        ];
        var clientParams = {
          paymentToken: paymentToken,
          apiKey: apiKey,
          optionalFields: optionalFields
        };
        return expect(new PayapiClient(clientParams).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.order).to.not.be.null;
            expect(decodedPaymentToken.order.currency).to.equal("EUR");
            expect(decodedPaymentToken.optionalFields).to.equal(optionalFields);
          });
      });
    });
  });
}());
