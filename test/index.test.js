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
  var secret;

  beforeEach(function() {
    process.env.NODE_ENV = "test";
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    apiKey = "abc123";
    secret = "very secret";
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
        countryCode: "FI",
        mobilePhoneNumber: "34615341892",
        email: "happyconsumer@example.com",
        consumerId: "happyConsujea31"
      },
      shippingAddress: {
        recipientName: "John Doe",
        co: "Jane Doe",
        streetAddress: "Calle Estados Unidos",
        streetAddress2: "Apartment 1122",
        postalCode: "90210",
        city: "Fuengirola",
        stateOrProvince: "Malaga",
        countryCode: "ES"
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
        description: "description",
        title: "title",
        category: "category",
        model: "model",
        imageUrl: "https://example.com/doge.jpg",
        extraData: "manufacturer=Bling Bling&origin=China",
        options: ["size=1","color=blue"]
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
    describe("NODE_TLS_REJECT_UNAUTHORIZED", function() {
      it("is not allowed in production", function() {
        var params = {
          payload: paymentObject,
          apiKey: apiKey
        };

        var token = new PayapiClient(params).encodePaymentToken();
        process.env.NODE_ENV = "production";
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        return expect(new PayapiClient({paymentToken: token, apiKey: apiKey}).call())
          .to.eventually.be.rejected
          .then(function(err) {
            return expect(err.message).to.equal("NODE_TLS_REJECT_UNAUTHORIZED is not allowed in environment 'production'");
          });
      });
      it("is not allowed in staging", function() {
        var params = {
          payload: paymentObject,
          apiKey: apiKey
        };

        var token = new PayapiClient(params).encodePaymentToken();
        process.env.NODE_ENV = "staging";
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        return expect(new PayapiClient({paymentToken: token, apiKey: apiKey}).call())
          .to.eventually.be.rejected
          .then(function(err) {
            return expect(err.message).to.equal("NODE_TLS_REJECT_UNAUTHORIZED is not allowed in environment 'staging'");
          });
      });
      it("is allowed in test", function() {
        var params = {
          payload: paymentObject,
          apiKey: apiKey,
          secret: secret
        };

        process.env.NODE_ENV = "test";
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        return expect(new PayapiClient(params).call())
          .to.eventually.be.rejected
          .then(function(result) {
            // can't think of a good way to verify this.
            // it will break when validations are added/removed
            return expect(result.length).to.equal(13);
          });
      });
    });
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

    /*  it("should encode payload extra fields", function() {
        paymentObject.extra = {
          "diiba ": "daaba "
        };
        var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");
        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.extra["diiba%20"]).to.equal("daaba%20");
          });
      });*/

      it("should delete keys that have undefined values in extra", function() {
        paymentObject.extra = {
          "diiba ": "daaba ",
          "daaba": undefined
        };
        var params = {
          apiKey: apiKey,
          payload: paymentObject
        };
        //var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");
        var corruptPaymentObject = new PayapiClient(params).encodePaymentToken();
        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.extra.daaba).to.equal(undefined);
            for(var key in decodedPaymentToken.extra) {
              expect(key).to.not.equal("daaba");
            }
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

      it("should encode integer product id to string", function() {
        paymentObject.products[0].id = 1;
        var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");
        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.products[0].id).to.be.a("string");
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

      it("should convert Product vatInCents to a number", function() {
        paymentObject.products[0].vatInCents = "113";
        var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");
        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.products[0].vatInCents).to.equal(113);
          });
      });

      it("should convert Order vatInCents to a number", function() {
        paymentObject.order.vatInCents = "0";
        var corruptPaymentObject = jwt.encode(paymentObject, apiKey, "HS512");
        return expect(new PayapiClient({paymentToken: corruptPaymentObject, apiKey: apiKey}).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.order.vatInCents).to.equal(0);
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
            "model": "xyz",
            "priceInCentsIncVat": 122,
            "priceInCentsExcVat": 100,
            "vatInCents": 22,
            "vatPercentage": 22,
            "extraData": "manufacturer=Bling Bling&origin=China",
            "options": ["size=1","color=blue"]
          },
          {
            "id": "pbc123456",
            "quantity": 1,
            "title": "Pink bling cap",
            "description": "Flashy fine cap",
            "imageUrl": "https://staging-store.example.com/image/c526e8973ba519c35bf391e63fae44db/cache/catalog/demo/iphone_1-500x500.jpg",
            "category": "Caps and hats",
            "model": "xyz",
            "priceInCentsIncVat": 222,
            "priceInCentsExcVat": 200,
            "vatInCents": 22,
            "vatPercentage": 22,
            "extraData": "manufacturer=Bling Bling&origin=China",
            "options": ["size=1","color=red"]
          }
          ],
          "consumer": {
            "name": "Peter",
            "co": "Jane Doe",
            "streetAddress": "Calle Andalucia 32",
            "streetAddress2": "Los Boliches",
            "postalCode": 29640,
            "city": "Fuengirola",
            "stateOrProvince": "Malaga",
            "countryCode": "ES",
            "consumerId": "happy88",
            "email": "happyconsumer@example.com",
            "locale": "es-ES",
            "mobilePhoneNumber": "34615321523"
          },
          "shippingAddress": {
            "recipientName": "John Doe",
            "co": "Jane Doe",
            "streetAddress": "Calle Estados Unidos",
            "streetAddress2": "Apartment 1122",
            "postalCode": "90210",
            "city": "Fuengirola",
            "stateOrProvince": "Malaga",
            "countryCode": "ES"
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
        var optionalFields = [ "product.id",
          "product.description",
          "product.imageUrl",
          "product.category",
          "product.extraData",
          "product.options",
          "consumer",
          "shippingAddress",
          "callbacks",
          "returnUrls",
          "payment.ip",
          "payment.cardHolderEmail",
          "payment.cardHolderName",
          "payment.creditCardNumber",
          "payment.paymentMethod",
          "payment.ccv",
          "payment.expiresMonth",
          "payment.expiresYear"
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
