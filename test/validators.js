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
  var InputDataValidator = require("../lib/validators");
  var ProductValidator = require("../lib/product.validator");
  var paymentObject;
  var paymentToken;
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
        countryCode: "FI",
        phoneNumber: "34615344819"
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
    paymentToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwYXltZW50Ijp7ImlwIjoiOC44LjguOCIsImNhcmRIb2xkZXJFbWFpbCI6Im5vc3VjaGVtYWlsYWRkcmVzc0BwYXlhcGkuaW8iLCJjYXJkSG9sZGVyTmFtZSI6ImNhcmQgaG9sZGVyIG5hbWUiLCJwYXltZW50TWV0aG9kIjoidmlzYSIsImNyZWRpdENhcmROdW1iZXIiOiI0MjQyIDQyNDIgNDI0MiA0MjQyIiwiY2N2IjoiMTIzIiwiZXhwaXJlc01vbnRoIjoiNSIsImV4cGlyZXNZZWFyIjoiMjAxNiJ9LCJjb25zdW1lciI6eyJuYW1lIjoiY29uc3VtZXIgbmFtZSIsImxvY2FsZSI6ImVuLVVTIiwiY28iOiJDYXJlIG9mIHNvbWVvbmUiLCJzdHJlZXRBZGRyZXNzIjoiTWFubmVyaGVpbWludGllIDEyIiwic3RyZWV0QWRkcmVzczIiOiJBIDEyMyIsInBvc3RhbENvZGUiOiIwMDEwMCIsImNpdHkiOiJIZWxzaW5raSIsInN0YXRlT3JQcm92aW5jZSI6IlV1c2ltYWEiLCJjb3VudHJ5Q29kZSI6IkZJIn0sIm9yZGVyIjp7InN1bUluQ2VudHNJbmNWYXQiOjEsInN1bUluQ2VudHNFeGNWYXQiOjEsInZhdEluQ2VudHMiOjEsInJlZmVyZW5jZUlkIjoieCIsImN1cnJlbmN5IjoiRVVSIn0sInByb2R1Y3RzIjpbeyJwcmljZUluQ2VudHNJbmNWYXQiOjEsInByaWNlSW5DZW50c0V4Y1ZhdCI6MSwidmF0SW5DZW50cyI6MSwidmF0UGVyY2VudGFnZSI6MjIuNSwicXVhbnRpdHkiOjF9XX0.hJN7HDQnPoNM40tpD-Fkja_GjTLpNiPODuoFScmfyCGIYwG4tJjBkuBu1P0uSqVJZl1zhOu6f8jzs7P9TUtKPw";
  });

  describe("InputDataValidator", function() {
    describe("Consumer", function() {
      it("can be optional", function() {
        delete paymentObject.consumer;
        paymentObject.optionalFields = ['consumer'];
        return expect(
          new InputDataValidator(paymentObject).validate()
        ).to.be.empty;
      });
    });

    describe("Products", function() {
      it("can be optional", function() {
        delete paymentObject.products;
        paymentObject.optionalFields = ['products'];
        return expect(
            new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });
    });
    describe("Order", function() {
      it("can be optional", function() {
        delete paymentObject.order;
        paymentObject.optionalFields = ['order'];
        return expect(
            new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });

    });

//    describe("Seller", function() {
//      describe("companyName", function() {
//        it("should ", function() {
//          console.log("TBD companyName");
//          return expect(
//            new InputDataValidator(paymentObject).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("streetAddress", function() {
//        it("should ", function() {
//          console.log("TBD streetAddress");
//          return expect(
//            new InputDataValidator(paymentObject).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("streetAddress2", function() {
//        it("should ", function() {
//          console.log("TBD streetAddress2");
//          return expect(
//            new InputDataValidator(paymentObject).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("postalCode", function() {
//        it("should ", function() {
//          console.log("TBD postalCode");
//          return expect(
//            new InputDataValidator(paymentObject).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("city", function() {
//        it("should ", function() {
//          console.log("TBD city");
//          return expect(
//            new InputDataValidator(paymentObject).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("country", function() {
//        it("should ", function() {
//          console.log("TBD country");
//          return expect(
//            new InputDataValidator(paymentObject).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("businessVatId", function() {
//        it("should ", function() {
//          console.log("TBD businessVatId");
//          return expect(
//            new InputDataValidator(paymentObject).validate()
//          ).to.be.empty;
//        });
//      });
//    });

    describe("Error payload", function() {
      var errorPayload = {
        "payment": {
          "ip": "::1",
          "cardHolderEmail": "diiba69@example.com"
        },
        "consumer": {
          "consumerId": "diiba69",
          "email": "diiba69@example.com",
          "locale": "en_US",
          "recipientName": "John Doe",
          "co": "Jane Doe",
          "streetAddress": "Calle Andalucia 32",
          "streetAddress2": "Los Boliches",
          "postalCode": 29640,
          "city": "Fuengirola",
          "stateOrProvince": "Malaga",
          "countryCode": "ES",
          "name": "John Doe",
          "phoneNumber": "34615344814"
        },
        "order": {
          "sumInCentsIncVat": 322,
          "sumInCentsExcVat": 300,
          "vatInCents": 22,
          "currency": "EUR",
          "referenceId": "ref123",
          "tosUrl": "https://payapi.io/terms",
          "sumIncludingVat": "€3.22",
          "sumExcludingVat": "€3.00",
          "vat": "€0.22"
        },
        "products": [
        {
          "id": "bbc123456",
          "quantity": 1,
          "title": "Black bling cap",
          "description": "Flashy fine cap",
          "imageUrl": "https://blingcaps.org/black_bling_cap.png",
          "category": "Caps and hats",
          "priceInCentsIncVat": 122,
          "priceInCentsExcVat": 100,
          "vatInCents": 22,
          "vatPercentage": 22,
          "extraData": "color=blue&size=M",
          "priceIncludingVat": "€1.22",
          "priceExcludingVat": "€1.00",
          "vat": "€0.22"
        },
        {
          "id": "pbc123456",
          "quantity": 1,
          "title": "Pink bling cap",
          "description": "Flashy fine cap",
          "imageUrl": "https://blingcaps.org/pink_bling_cap.png",
          "category": "Caps and hats",
          "priceInCentsIncVat": 222,
          "priceInCentsExcVat": 200,
          "vatInCents": 22,
          "vatPercentage": 22,
          "extraData": "color=blue&size=M",
          "priceIncludingVat": "€2.22",
          "priceExcludingVat": "€2.00",
          "vat": "€0.22"
        }
        ],
        "callbacks": {
          "processing": "https://staging-api.loverocksshop.com/v1/callback-processing",
          "success": "https://staging-api.loverocksshop.com/v1/callback-success",
          "failed": "https://staging-api.loverocksshop.com/v1/callback-failed",
          "chargeback": "https://staging-api.loverocksshop.com/v1/callback-chargeback"
        },
        "returningConsumer": false,
        "optionalFields": [
          "payment.cardHolderName",
          "payment.paymentMethod",
          "payment.creditCardNumber",
          "payment.ccv",
          "payment.expiresMonth",
          "payment.expiresYear"
        ]
      };
      it("should succeed", function() {
        return expect(
            new InputDataValidator(errorPayload).validate()
            ).to.be.empty;
      });
    });

    describe("Full payload", function() {
      var fullPayload =
        {
          "payment": {
            "cardHolderEmail": "marko@payapi.io",
            "cardHolderName": "Marko",
            "paymentMethod": "mastercard",
            "creditCardNumber": "4242 4242 4242 4242",
            "ccv": "1234",
            "expiresMonth": "2",
            "expiresYear": "3016",
            "ip": "::ffff:127.0.0.1"
          },
          "consumer": {
            "name": "Marko",
            "co": "",
            "streetAddress": "Calle Andalucia 32",
            "streetAddress2": "",
            "postalCode": "90210",
            "city": "Fuengirola",
            "stateOrProvince": "",
            "countryCode": "ES",
            "locale": "en-US",
            "phoneNumber": ""
          },
          "order": {
            "sumInCentsIncVat": 322,
            "sumInCentsExcVat": 300,
            "vatInCents": 22,
            "currency": "EUR",
            "referenceId": "ref123",
            "sumIncludingVat": "€3.22",
            "sumExcludingVat": "€3.00",
            "vat": "€0.22"
          },
          "products": [
            {
              "id": "bbc123456",
              "quantity": 1,
              "title": "Black bling cap",
              "description": "Flashy fine cap",
              "imageUrl": "https://blingcaps.org/black_bling_cap.png",
              "category": "Caps and hats",
              "priceInCentsIncVat": 122,
              "priceInCentsExcVat": 100,
              "vatInCents": 22,
              "vatPercentage": 22.5,
              "priceIncludingVat": "€1.22",
              "priceExcludingVat": "€1.00",
              "vat": "€0.22"
            },
            {
              "id": "pbc123456",
              "quantity": 1,
              "title": "Pink bling cap",
              "description": "Flashy fine cap",
              "imageUrl": "https://blingcaps.org/pink_bling_cap.png",
              "category": "Caps and hats",
              "priceInCentsIncVat": 222,
              "priceInCentsExcVat": 200,
              "vatInCents": 22,
              "vatPercentage": 22.5,
              "priceIncludingVat": "€2.22",
              "priceExcludingVat": "€2.00",
              "vat": "€0.22"
            }
          ],
          "callbacks": {
            "success": "https://api.multimerchantshop.io/payments/success",
            "failed": "https://api.multimerchantshop.io/payments/failed",
            "chargeback": "https://api.multimerchantshop.io/payments/chargeback"
          }
        };

      it("should succeed", function() {
        return expect(
            new InputDataValidator(fullPayload).validate()
            ).to.be.empty;
      });
    });
  });

  describe("PayapiClient", function() {
    //describe("Encoding a payment object to a payment token", function() {
    //  // this test will fail each time we enter into a new month or year
    //  it("should succeed", function() {
    //    var params = {
    //      apiKey: apiKey,
    //      payload: paymentObject
    //    };
    //    return expect(
    //      new PayapiClient(params).encodePaymentToken()
    //    ).to.equal(paymentToken);
    //  });
    //});
    describe("Encoding a payment token to a payment object", function() {
      it("should succeed", function() {
        var params = {
          apiKey: apiKey,
          paymentToken: jsonwebtoken.sign(paymentObject, apiKey, { algorithm: "HS512" })
        };
        return expect(new PayapiClient(params).decodePaymentToken())
          .to.eventually.be.fulfilled
          .then(function(decodedPaymentToken) {
            expect(decodedPaymentToken.payment.cardHolderName).to.equal(paymentObject.payment.cardHolderName);
          });
      });

      it("should not succeed with a token encoded with other algorithm than HS256, HS384, HS512 and RS256", function() {
        var params = {
          apiKey: apiKey,
          paymentToken: jsonwebtoken.sign(paymentObject, apiKey, { algorithm: "none" })
        };
        expect(function() {
          new PayapiClient(params).decodePaymentToken()
        }).to.throw("Only HS256, HS384, HS512 and RS256 algorithms are supported for JWT.");
      });

    });
  });

  describe("One-click problem with v0.9.4", function() {
    it("should be fixed", function() {
      var payload = {
        "publicId": "multimerchantshop",
        "order": {
          "tosUrl": "http://store.multimerchantshop.com/terms",
          "currency": "EUR",
          "sumInCentsIncVat": 18200,
          "sumInCentsExcVat": 15000,
          "vatInCents": 3200,
          "referenceId": "multimerchantshop-87c7c6df-e354-493f-9f3d-6dd1a0f092a5"
        },
        "products": [
        {
          "priceInCentsIncVat": 18200,
          "priceInCentsExcVat": 15000,
          "vatInCents": 3200,
          "vatPercentage": 21,
          "id": "30",
          "quantity": "1",
          "title": "Canon EOS 5D",
          "description": "Canon's press material for the EOS 5D states that it 'defines (a) new D-SLR category', while we'r..",
          "imageUrl": "http://store.multimerchantshop.com/image/e3fdad58ef62a70bf356e0042d2e4e51/cache/catalog/demo/canon_eos_5d_1-228x228.jpg",
          "category": "Desktops,Cameras",
          "extraData": {
            "quantity": "1",
            "consumerId": "",
            "email": "",
            "Select": "15"
          }
        }
        ],
        "returnUrls": {
          "success": "http://store.multimerchantshop.com/index.php?route=payment/payapi_payments/successful",
          "cancel": "http://store.multimerchantshop.com/index.php?route=payment/payapi_payments/cancelled",
          "failed": "http://store.multimerchantshop.com/index.php?route=payment/payapi_payments/failed"
        },
        "callbacks": {
          "success": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
          "failed": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
          "chargeback": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
          "processing": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback"
        },
        "consumer": {
          "locale": "en",
          "email": "",
          "consumerId": ""
        },
        "optionalFields": [
          "payment.ip",
          "payment.cardHolderName",
          "payment.cardHolderEmail",
          "payment.paymentMethod",
          "payment.creditCardNumber",
          "payment.ccv",
          "payment.expiresMonth",
          "payment.expiresYear",
          "consumer"
        ]
      };
      return expect(
          new InputDataValidator(payload).validate()
          ).to.be.empty;
    });
  });
}());
