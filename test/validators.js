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
        extraData: {
          foo: "bar"
        }
      }],
      callbacks: {
        processing: "https://staging-api.loverocksshop.com/v1/callback-processing",
        success: "https://staging-api.loverocksshop.com/v1/callback-success",
        failed: "https://staging-api.loverocksshop.com/v1/callback-failed",
        chargeback: "https://staging-api.loverocksshop.com/v1/callback-chargeback"
      },
      returnUrls: {
        success: "https://staging-api.loverocksshop.com/v1/returnUrl-success",
        cancel: "https://staging-api.loverocksshop.com/v1/returnUrl-cancel",
        failed: "https://staging-api.loverocksshop.com/v1/returnUrl-failed",
      }
    };
    paymentToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwYXltZW50Ijp7ImlwIjoiOC44LjguOCIsImNhcmRIb2xkZXJFbWFpbCI6Im5vc3VjaGVtYWlsYWRkcmVzc0BwYXlhcGkuaW8iLCJjYXJkSG9sZGVyTmFtZSI6ImNhcmQgaG9sZGVyIG5hbWUiLCJwYXltZW50TWV0aG9kIjoidmlzYSIsImNyZWRpdENhcmROdW1iZXIiOiI0MjQyIDQyNDIgNDI0MiA0MjQyIiwiY2N2IjoiMTIzIiwiZXhwaXJlc01vbnRoIjoiNSIsImV4cGlyZXNZZWFyIjoiMjAxNiJ9LCJjb25zdW1lciI6eyJuYW1lIjoiY29uc3VtZXIgbmFtZSIsImxvY2FsZSI6ImVuLVVTIiwiY28iOiJDYXJlIG9mIHNvbWVvbmUiLCJzdHJlZXRBZGRyZXNzIjoiTWFubmVyaGVpbWludGllIDEyIiwic3RyZWV0QWRkcmVzczIiOiJBIDEyMyIsInBvc3RhbENvZGUiOiIwMDEwMCIsImNpdHkiOiJIZWxzaW5raSIsInN0YXRlT3JQcm92aW5jZSI6IlV1c2ltYWEiLCJjb3VudHJ5Q29kZSI6IkZJIn0sIm9yZGVyIjp7InN1bUluQ2VudHNJbmNWYXQiOjEsInN1bUluQ2VudHNFeGNWYXQiOjEsInZhdEluQ2VudHMiOjEsInJlZmVyZW5jZUlkIjoieCIsImN1cnJlbmN5IjoiRVVSIn0sInByb2R1Y3RzIjpbeyJwcmljZUluQ2VudHNJbmNWYXQiOjEsInByaWNlSW5DZW50c0V4Y1ZhdCI6MSwidmF0SW5DZW50cyI6MSwidmF0UGVyY2VudGFnZSI6MjIuNSwicXVhbnRpdHkiOjF9XX0.hJN7HDQnPoNM40tpD-Fkja_GjTLpNiPODuoFScmfyCGIYwG4tJjBkuBu1P0uSqVJZl1zhOu6f8jzs7P9TUtKPw";
  });

  describe("InputDataValidator", function() {
    describe("Consumer", function() {
      it("can be optional", function() {
        delete paymentObject.consumer;
        paymentObject.optionalFields = ["consumer"];
        return expect(
          new InputDataValidator(paymentObject).validate()
        ).to.be.empty;
      });
    });

    describe("Products", function() {
      it("can be optional", function() {
        delete paymentObject.products;
        paymentObject.optionalFields = ["products"];
        return expect(
            new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });
    });
    describe("Order", function() {
      it("can be optional", function() {
        delete paymentObject.order;
        paymentObject.optionalFields = ["order"];
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
          "cardHolderEmail": "diiba69@example.com",
          "paymentMethod": "mastercard"
        },
        "consumer": {
          "consumerId": "diiba69",
          "email": "diiba69@example.com",
          "locale": "en-US",
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
          "tosUrl": "https://payapi.io/terms"
        },
        "products": [
        {
          "id": "bbc123456",
          "quantity": 1,
          "title": "Black bling cap",
          "description": "Flashy fine cap",
          "imageUrl": "https://blingcaps.org/black_bling_cap.png",
          "category": "Caps and hats",
          "model": "xyz",
          "priceInCentsIncVat": 122,
          "priceInCentsExcVat": 100,
          "vatInCents": 22,
          "vatPercentage": 22,
          "extraData": {
            "foo": "bar"
          }
        },
        {
          "id": "pbc123456",
          "quantity": 1,
          "title": "Pink bling cap",
          "description": "Flashy fine cap",
          "imageUrl": "https://blingcaps.org/pink_bling_cap.png",
          "category": "Caps and hats",
          "model": "abc",
          "priceInCentsIncVat": 222,
          "priceInCentsExcVat": 200,
          "vatInCents": 22,
          "vatPercentage": 22,
          "extraData": {
            "foo": "bar"
          }
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
        ],
        "returnUrls": {
          "success": "https://staging-api.loverocksshop.com/v1/returnUrl-success",
          "cancel": "https://staging-api.loverocksshop.com/v1/returnUrl-cancel",
          "failed": "https://staging-api.loverocksshop.com/v1/returnUrl-failed",
        }
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
            "co": "co",
            "streetAddress": "Calle Andalucia 32",
            "streetAddress2": "Escalera 2",
            "postalCode": "90210",
            "city": "Fuengirola",
            "stateOrProvince": "Málaga",
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
            "vat": "€0.22",
            "tosUrl": "https://payapi.io/terms"
          },
          "products": [
            {
              "id": "bbc123456",
              "quantity": 1,
              "title": "Black bling cap",
              "description": "Flashy fine cap",
              "imageUrl": "https://blingcaps.org/black_bling_cap.png",
              "category": "Caps and hats",
              "model": "Pimped with gold bling",
              "priceInCentsIncVat": 122,
              "priceInCentsExcVat": 100,
              "vatInCents": 22,
              "vatPercentage": 22.5,
              "priceIncludingVat": "€1.22",
              "priceExcludingVat": "€1.00",
              "vat": "€0.22",
              "extraData": {
                "foo": "bar"
              }
            },
            {
              "id": "pbc123456",
              "quantity": 1,
              "title": "Pink bling cap",
              "description": "Flashy fine cap",
              "imageUrl": "https://blingcaps.org/pink_bling_cap.png",
              "category": "Caps and hats",
              "model": "Pimped with diamong bling",
              "priceInCentsIncVat": 222,
              "priceInCentsExcVat": 200,
              "vatInCents": 22,
              "vatPercentage": 22.5,
              "priceIncludingVat": "€2.22",
              "priceExcludingVat": "€2.00",
              "vat": "€0.22",
              "extraData": {
                "foo": "bar"
              }
            }
          ],
          "callbacks": {
            "success": "https://api.multimerchantshop.io/payments/success",
            "failed": "https://api.multimerchantshop.io/payments/failed",
            "chargeback": "https://api.multimerchantshop.io/payments/chargeback",
            "processing": "https://api.multimerchantshop.io/payments/processing"
          },
          "returnUrls": {
            "success": "https://staging-api.loverocksshop.com/v1/returnUrl-success",
            "cancel": "https://staging-api.loverocksshop.com/v1/returnUrl-cancel",
            "failed": "https://staging-api.loverocksshop.com/v1/returnUrl-failed",
          }
        };

      it("should succeed", function() {
        return expect(
            new InputDataValidator(fullPayload).validate()
            ).to.be.empty;
      });
    });
  });

  describe("returnUrls", function() {
    describe("success", function() {
      it("can be optional", function() {
        delete paymentObject.returnUrls.success;
        paymentObject.optionalFields = ["returnUrls.success"];
        return expect(
          new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });

      it("must use https protocol", function() {
        paymentObject.returnUrls.success = "http://payapi.io/success";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls success url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.success");
        expect(validationError.value).to.equal(paymentObject.returnUrls.success);
      });

      it("must define a protocol", function() {
        paymentObject.returnUrls.success = "payapi.io/success";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls success url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.success");
        expect(validationError.value).to.equal(paymentObject.returnUrls.success);
      });

      it("must be a valid url", function() {
        paymentObject.returnUrls.success = "hokkus pokkus, filiokkus";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls success url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.success");
        expect(validationError.value).to.equal(paymentObject.returnUrls.success);
      });

      it("must be a valid url even when optional", function() {
        paymentObject.returnUrls.success = "hokkus pokkus, filiokkus";
        paymentObject.optionalFields = ["returnUrls.success"];
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls success url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.success");
        expect(validationError.value).to.equal(paymentObject.returnUrls.success);
      });
    }); // describe success

    describe("cancel", function() {
      it("can be optional", function() {
        delete paymentObject.returnUrls.cancel;
        paymentObject.optionalFields = ["returnUrls.cancel"];
        return expect(
          new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });

      it("must use https protocol", function() {
        paymentObject.returnUrls.cancel = "http://payapi.io/cancel";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls cancel url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.cancel");
        expect(validationError.value).to.equal(paymentObject.returnUrls.cancel);
      });

      it("must define a protocol", function() {
        paymentObject.returnUrls.cancel = "payapi.io/cancel";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls cancel url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.cancel");
        expect(validationError.value).to.equal(paymentObject.returnUrls.cancel);
      });

      it("must be a valid url", function() {
        paymentObject.returnUrls.cancel = "hokkus pokkus, filiokkus";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls cancel url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.cancel");
        expect(validationError.value).to.equal(paymentObject.returnUrls.cancel);
      });

      it("must be a valid url even when optional", function() {
        paymentObject.returnUrls.cancel = "hokkus pokkus, filiokkus";
        paymentObject.optionalFields = ["returnUrls.cancel"];
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls cancel url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.cancel");
        expect(validationError.value).to.equal(paymentObject.returnUrls.cancel);
      });
    }); // describe cancel

    describe("failed", function() {
      it("can be optional", function() {
        delete paymentObject.returnUrls.failed;
        paymentObject.optionalFields = ["returnUrls.failed"];
        return expect(
          new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });

      it("must use https protocol", function() {
        paymentObject.returnUrls.failed = "http://payapi.io/failed";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls failed url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.failed");
        expect(validationError.value).to.equal(paymentObject.returnUrls.failed);
      });

      it("must define a protocol", function() {
        paymentObject.returnUrls.failed = "payapi.io/failed";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls failed url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.failed");
        expect(validationError.value).to.equal(paymentObject.returnUrls.failed);
      });

      it("must be a valid url", function() {
        paymentObject.returnUrls.failed = "hokkus pokkus, filiokkus";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls failed url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.failed");
        expect(validationError.value).to.equal(paymentObject.returnUrls.failed);
      });

      it("must be a valid url even when optional", function() {
        paymentObject.returnUrls.failed = "hokkus pokkus, filiokkus";
        paymentObject.optionalFields = ["returnUrls.failed"];
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid returnUrls failed url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.returnUrls.failed");
        expect(validationError.value).to.equal(paymentObject.returnUrls.failed);
      });
    }); // describe failed
  }); // describe returnUrls

  describe("callbacks", function() {
    describe("success", function() {
      it("can be optional", function() {
        delete paymentObject.callbacks.success;
        paymentObject.optionalFields = ["callbacks.success"];
        return expect(
          new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });

      it("must use https protocol", function() {
        paymentObject.callbacks.success = "http://payapi.io/success";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks success url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.success");
        expect(validationError.value).to.equal(paymentObject.callbacks.success);
      });

      it("must define a protocol", function() {
        paymentObject.callbacks.success = "payapi.io/success";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks success url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.success");
        expect(validationError.value).to.equal(paymentObject.callbacks.success);
      });

      it("must be a valid url", function() {
        paymentObject.callbacks.success = "hokkus pokkus, filiokkus";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks success url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.success");
        expect(validationError.value).to.equal(paymentObject.callbacks.success);
      });

      it("must be a valid url even when optional", function() {
        paymentObject.callbacks.success = "hokkus pokkus, filiokkus";
        paymentObject.optionalFields = ["callbacks.success"];
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks success url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.success");
        expect(validationError.value).to.equal(paymentObject.callbacks.success);
      });
    }); // describe success

    describe("failed", function() {
      it("can be optional", function() {
        delete paymentObject.callbacks.failed;
        paymentObject.optionalFields = ["callbacks.failed"];
        return expect(
          new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });
      it("must use https protocol", function() {
        paymentObject.callbacks.failed = "http://payapi.io/success";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks failed url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.failed");
        expect(validationError.value).to.equal(paymentObject.callbacks.failed);
      });

      it("must define a protocol", function() {
        paymentObject.callbacks.failed = "payapi.io/failed";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks failed url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.failed");
        expect(validationError.value).to.equal(paymentObject.callbacks.failed);
      });

      it("must be a valid url", function() {
        paymentObject.callbacks.failed = "hokkus pokkus, filiokkus";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks failed url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.failed");
        expect(validationError.value).to.equal(paymentObject.callbacks.failed);
      });

      it("must be a valid url even when optional", function() {
        paymentObject.callbacks.failed = "hokkus pokkus, filiokkus";
        paymentObject.optionalFields = ["callbacks.failed"];
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks failed url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.failed");
        expect(validationError.value).to.equal(paymentObject.callbacks.failed);
      });
    }); // describe failed

    describe("chargeback", function() {
      it("can be optional", function() {
        delete paymentObject.callbacks.chargeback;
        paymentObject.optionalFields = ["callbacks.chargeback"];
        return expect(
          new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });
      it("must use https protocol", function() {
        paymentObject.callbacks.chargeback = "http://payapi.io/success";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks chargeback url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.chargeback");
        expect(validationError.value).to.equal(paymentObject.callbacks.chargeback);
      });

      it("must define a protocol", function() {
        paymentObject.callbacks.chargeback = "payapi.io/chargeback";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks chargeback url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.chargeback");
        expect(validationError.value).to.equal(paymentObject.callbacks.chargeback);
      });

      it("must be a valid url", function() {
        paymentObject.callbacks.chargeback = "hokkus pokkus, filiokkus";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks chargeback url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.chargeback");
        expect(validationError.value).to.equal(paymentObject.callbacks.chargeback);
      });

      it("must be a valid url even when optional", function() {
        paymentObject.callbacks.chargeback = "hokkus pokkus, filiokkus";
        paymentObject.optionalFields = ["callbacks.chargeback"];
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks chargeback url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.chargeback");
        expect(validationError.value).to.equal(paymentObject.callbacks.chargeback);
      });
    }); // describe chargeback

    describe("processing", function() {
      it("can be optional", function() {
        delete paymentObject.callbacks.processing;
        paymentObject.optionalFields = ["callbacks.processing"];
        return expect(
          new InputDataValidator(paymentObject).validate()
            ).to.be.empty;
      });
      it("must use https protocol", function() {
        paymentObject.callbacks.processing = "http://payapi.io/success";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks processing url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.processing");
        expect(validationError.value).to.equal(paymentObject.callbacks.processing);
      });

      it("must define a protocol", function() {
        paymentObject.callbacks.processing = "payapi.io/processing";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks processing url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.processing");
        expect(validationError.value).to.equal(paymentObject.callbacks.processing);
      });

      it("must be a valid url", function() {
        paymentObject.callbacks.processing = "hokkus pokkus, filiokkus";
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks processing url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.processing");
        expect(validationError.value).to.equal(paymentObject.callbacks.processing);
      });

      it("must be a valid url even when optional", function() {
        paymentObject.callbacks.processing = "hokkus pokkus, filiokkus";
        paymentObject.optionalFields = ["callbacks.processing"];
        var validationError = new InputDataValidator(paymentObject).validate()[0];
        expect(validationError.message).to.equal("Invalid callbacks processing url. Make sure you are using https protocol.");
        expect(validationError.translationKey).to.equal("invalid.callbacks.processing");
        expect(validationError.value).to.equal(paymentObject.callbacks.processing);
      });
    }); // describe processing

  }); // describe callbacks

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

  describe("Stripe validation problem with v1.1.4", function() {
    it("should be fixed", function() {
      var paymentToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwYXltZW50Ijp7ImlwIjoiOjoxIiwiY2FyZEhvbGRlckVtYWlsIjoiZGV2dGVhbUBwYXlhcGkuaW8iLCJsb2NhbGUiOiJlbi1VUyIsInBheW1lbnRNZXRob2QiOiJ2aXNhIiwiY2FyZEhvbGRlck5hbWUiOiJNYXJrbyIsInBheURhdGFJZCI6IjZjNDEwMThjLWUyMmItNGMzOC1hZjk4LWI3YmFjN2Q0ZTc5ZSIsImNhcmROdW1iZXJMYXN0NCI6IjQyNDIiLCJyZXRyeSI6MSwiY2FyZEJpbiI6IjQyNDI0MiIsInRlcm1zQWNjZXB0ZWQiOiJUZXJtcyBvZiBTZXJ2aWNlIG9mIHBheWFwaShodHRwczovL3BheWFwaS5pby90ZXJtcykgYW5kIFBheUFwaSBPeShodHRwczovL3BheWFwaS5pby90ZXJtcykgYWNjZXB0ZWQgYnkgY29uc3VtZXIgZnJvbSBJUCBhZGRyZXNzOiA6OjEgb24gZGF0ZSAyMDE3LTAyLTA4VDE4OjA5OjUxKzAyOjAwIHdpdGggZm9sbG93aW5nIGNvbnN1bWVyIGRhdGE6IE1hcmtvLCBkZXZ0ZWFtQHBheWFwaS5pbyIsInJlbWVtYmVyTWVUb2tlbiI6ImNhMDY0NDU4ZWExYWZiYTEzOGFkYTFlMDA2ODFhMTlmJDY4OThmZTU3YzNjNGJiMmY3NDE2OTBjNmM2YmZmMTA2JGMxMjFjN2FlYWFmNjcyMTQ2MDcxMDA2MWQ2OWIwODFkYjNhODEyZDI1ZjZlZDdkYWI0ZjcyMDFlMjdjYmE2ZTUiLCJleHBpcmVzWWVhciI6MjAxNywiZXhwaXJlc01vbnRoIjo0LCJjY3YiOiIxMjMiLCJjcmVkaXRDYXJkTnVtYmVyIjoiNDI0MjQyNDI0MjQyNDI0MiJ9LCJjb25zdW1lciI6eyJuYW1lIjoiSm9obiBEb2UiLCJwb3N0YWxDb2RlIjoiMjk2NDAiLCJjbyI6IlBheUFwaSBEZXYgVGVhbSIsInN0cmVldEFkZHJlc3MiOiJDYWxsZSBBbmRhbHVjaWEgMzIiLCJzdHJlZXRBZGRyZXNzMiI6IkxvcyBCb2xpY2hlcyIsImNvdW50cnlDb2RlIjoiRVMiLCJzdGF0ZU9yUHJvdmluY2UiOiJNYWxhZ2EiLCJjaXR5IjoiRnVlbmdpcm9sYSIsImxvY2FsZSI6ImVuLVVTIiwicGhvbmVOdW1iZXIiOiIiLCJwYXlDb25zdW1lcklkIjoiNTU1ZTllYmMtYzBjMy00OGNkLTgzZTYtYmI2MTcwMGFiNDVhIiwiaWQiOiI1ODk4NDcyMmZlNGFkZDE4OTZiOTFlOGQiLCJwYXlEYXRhSWQiOiI2YzQxMDE4Yy1lMjJiLTRjMzgtYWY5OC1iN2JhYzdkNGU3OWUifSwib3JkZXIiOnsic3VtSW5DZW50c0luY1ZhdCI6MjM0NCwic3VtSW5DZW50c0V4Y1ZhdCI6MjMwMCwidmF0SW5DZW50cyI6MjQ0LCJjdXJyZW5jeSI6IkVVUiIsInJlZmVyZW5jZUlkIjoicmVmMTIzIiwidG9zVXJsIjoiaHR0cHM6Ly9wYXlhcGkuaW8vdGVybXMifSwicHJvZHVjdHMiOlt7ImlkIjoiYmJjMTIzNDU2IiwicXVhbnRpdHkiOjEsInRpdGxlIjoiQmxhY2sgYmxpbmcgY3JhcCAiLCJkZXNjcmlwdGlvbiI6IkZsYXNoeSBmaW5lIGNhcCIsImltYWdlVXJsIjoiaHR0cHM6Ly9zdG9yZS5tdWx0aW1lcmNoYW50c2hvcC54eXovbWVkaWEvOTgzYWIxNTE5YThiNTUzZWM1ODEyNWExM2JmMDk0NzEvaW1hZ2UvY2FjaGUvY2F0YWxvZy9pcGhvbmVfMS01MDB4NTAwLmpwZyIsImNhdGVnb3J5IjoiIiwicHJpY2VJbkNlbnRzSW5jVmF0IjoxMTIyLCJwcmljZUluQ2VudHNFeGNWYXQiOjExMDAsInZhdEluQ2VudHMiOjEyMiwidmF0UGVyY2VudGFnZSI6MTIyLCJleHRyYURhdGEiOnsiY29sb3IiOiJibHVlIiwic2l6ZSI6Ik0ifX0seyJpZCI6InBiYzEyMzQ1NiIsInF1YW50aXR5IjoxLCJ0aXRsZSI6IlBpbmsgYmxpbmcgY2FwIiwiZGVzY3JpcHRpb24iOiJGbGFzaHkgZmluZSBjYXAiLCJpbWFnZVVybCI6Imh0dHBzOi8vc3RhZ2luZy1zdG9yZS5tdWx0aW1lcmNoYW50c2hvcC5jb20vaW1hZ2UvYzUyNmU4OTczYmE1MTljMzViZjM5MWU2M2ZhZTQ0ZGIvY2FjaGUvY2F0YWxvZy9kZW1vL2lwaG9uZV8xLTUwMHg1MDAuanBnIiwiY2F0ZWdvcnkiOiJDYXBzIGFuZCBoYXRzIiwicHJpY2VJbkNlbnRzSW5jVmF0IjoxMjIyLCJwcmljZUluQ2VudHNFeGNWYXQiOjEyMDAsInZhdEluQ2VudHMiOjEyMiwidmF0UGVyY2VudGFnZSI6MTIyLCJleHRyYURhdGEiOnsiY29sb3IiOiJibHVlIiwic2l6ZSI6Ik0ifX1dLCJjYWxsYmFja3MiOnsicHJvY2Vzc2luZyI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAvdjEvYXBpL2V2ZW50cy9tZXJjaGFudENhbGxiYWNrIiwic3VjY2VzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAvdjEvYXBpL2V2ZW50cy9tZXJjaGFudENhbGxiYWNrIiwiZmFpbGVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6MzAwMC92MS9hcGkvZXZlbnRzL21lcmNoYW50Q2FsbGJhY2siLCJjaGFyZ2ViYWNrIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6MzAwMC92MS9hcGkvZXZlbnRzL21lcmNoYW50Q2FsbGJhY2sifSwicmV0dXJuaW5nQ29uc3VtZXIiOnRydWUsImV4dHJhIjp7InRpbWVzdGFtcCI6MTQ4NjU3MDE5Njg3NiwicGF5bWVudEdhdGV3YXlJZCI6IjU2YzFkZDcyMjg2NjM3MWUxY2NhMzE4YSIsImNhblN0b3JlQ3JlZGl0Q2FyZE51bWJlciI6dHJ1ZSwiZW5yaWNoZWQiOnRydWV9LCJhdXRoZW50aWNhdGlvblRva2VuIjp7InRva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SmxlSEJwY21Weklqb2lNakF4Tnkwd01pMHhOVlF4TmpveE9UbzFNUzQ1TURKYUlpd2lhMlY1SWpvaVJIUkdOSFJyUTFSYVExZDRibGRsTkhoU1dYbE1PVnAzU21SMFVFYzJaR29pZlEuMEpoYkNoak9QZ3l6Yy0tLWtwSzB5akVJNzJfWkxjX3p2X29XRkU4WDMwbyIsImV4cGlyZXMiOiIyMDE3LTAyLTE1VDE2OjE5OjUxLjkwMloifSwiYXBpS2V5Ijp7Il9pZCI6IjU2YjMzNzU4YjUzYmRlNjQzMmJjYzJiYyIsInNhbHQiOiJ7XHUwMDAyXe-_ve-_vVxc77-977-977-977-9R--_vUvvv73vv71mIiwic2VjcmV0IjoidEZjaFBLeUZCR3FYOGVGbm05Q21xcE00N3RkNkI0cDQ2Y0JRRnhNYmNNV2hiTXk4IiwiYWN0aXZlIjp0cnVlLCJrZXkiOiJEdEY0dGtDVFpDV3huV2U0eFJZeUw5WndKZHRQRzZkaiIsImRlc2NyaXB0aW9uIjoiTmV3bHkgZ2VuZXJhdGVkIEFQSSBrZXkiLCJwdWJsaWNJZCI6ImxvdmVkb2xscyIsInVzZXIiOiI1Njk4ZDk4OWFmNWM5MTQ2MTljMjdkYTAiLCJ1cGRhdGVkQXQiOiIyMDE3LTAyLTA2VDE1OjI4OjI1LjEwN1oiLCJjcmVhdGVkQXQiOiIyMDE2LTAyLTA0VDExOjM0OjQ4LjY4MVoiLCJfX3YiOjEsImV4dHJhSW5wdXREYXRhcyI6W10sImV4dGVybmFsSW50ZWdyYXRpb25zIjpbXSwiY2hhcmdlRmFpbGVkQ291bnQiOjMzNiwiY2hhcmdlU3VjY2Vzc0NvdW50Ijo0MTAsIndlYnNob3BEb21haW5XaGl0ZWxpc3QiOlsiamVua2lucy5wYXlhcGkueHl6Iiwic3RvcmUucGF5YXBpLmlvIiwidmlsb2xhLmNvbSIsInN0YWdpbmctc3RvcmUubXVsdGltZXJjaGFudHNob3AuY29tIiwiMTAuMC4xLjIiXSwicGFzc3dvcmQiOiJqM0k1NmJNb05ndEZFL2p6YWtKT1pVTmtxVmZvRGxsVy9aeENmNTNzV0FzSnN0OHVBb0Rtb1RvcEw5V3FxUDluaW9CRkVlU0l3TkNYRE9GRmtLODRyQT09In0sInV1aWQiOiI5ZmZlN2ZkOC03MzkzLTQwMTAtYjc1ZC03ZGUxNmRjZjk2YTQiLCJmcmF1ZFNjb3JlIjp7ImZyYXVkU2NvcmUiOjEwMCwiY292ZXJhZ2UiOiJTVEFOREFSRCIsImJsYWNrbGlzdGVkSXBBZGRyZXNzU2NvcmUiOjAsInByb3h5U2VydmVyU2NvcmUiOjAsImlwQWRkcmVzc0NvdW50cnlTY29yZSI6MCwidG90YWxQYXltZW50c0luMjRocnNCeUlwU2NvcmUiOjI3LCJpcENvdW50cnlFcXVhbEJpbkNvdW50cnlTY29yZSI6MTAsImlwQ291bnRyeUVxdWFsU2hpcHBpbmdDb3VudHJ5U2NvcmUiOjEwLCJibGFja2xpc3RlZEVtYWlsU2NvcmUiOjAsImRvbWFpbkFnZVNjb3JlIjoxMCwiZG9tYWluTG9jYXRpb25TY29yZSI6MCwidG90YWxQYXltZW50c0luMjRocnNCeUVtYWlsU2NvcmUiOjEwMCwiYmxhY2tsaXN0ZWRFbWFpbERvbWFpblNjb3JlIjoxMCwiaXNCaW5Gb3VuZFNjb3JlIjowLCJiaW5Jc3N1ZXJDb3VudHJ5U2NvcmUiOjAsInNoaXBwaW5nQ291bnRyeVNjb3JlIjowLCJzaGlwcGluZ0FkZHJlc3NEaXN0YW5jZUZyb21JcFNjb3JlIjowLCJiaW5Db3VudHJ5RXF1YWxTaGlwcGluZ0NvdW50cnlTY29yZSI6MTAsInRvdGFsUGF5bWVudHNJbjI0aHJzQnlQYXlEYXRhSWRTY29yZSI6MTYsImJsYWNrbGlzdGVkUGF5RGF0YUlkU2NvcmUiOjAsImZyYXVkVHJhbnNhY3Rpb25JZCI6IjU4OWI0MmQ2MGEzN2NkNTQxZjhkZjM1MiJ9LCJwYXlEYXRhSWQiOiI2YzQxMDE4Yy1lMjJiLTRjMzgtYWY5OC1iN2JhYzdkNGU3OWUiLCJyZW1lbWJlck1lVG9rZW4iOiJjYTA2NDQ1OGVhMWFmYmExMzhhZGExZTAwNjgxYTE5ZiQ2ODk4ZmU1N2MzYzRiYjJmNzQxNjkwYzZjNmJmZjEwNiRjMTIxYzdhZWFhZjY3MjE0NjA3MTAwNjFkNjliMDgxZGIzYTgxMmQyNWY2ZWQ3ZGFiNGY3MjAxZTI3Y2JhNmU1Iiwib3B0aW9uYWxGaWVsZHMiOlsicGF5bWVudC5sb2NhbGUiLCJwYXltZW50LmNyZWRpdENhcmROdW1iZXIiLCJwYXltZW50LmN2diIsInBheW1lbnQuY2N2IiwicGF5bWVudC5leHBpcmVzTW9udGgiLCJwYXltZW50LmV4cGlyZXNZZWFyIiwicGF5bWVudC5wYXlEYXRhSWQiLCJjb25zdW1lci5uYW1lIiwiY29uc3VtZXIuY28iLCJjb25zdW1lci5zdHJlZXRBZGRyZXNzIiwiY29uc3VtZXIuc3RyZWV0QWRkcmVzczIiLCJjb25zdW1lci5wb3N0YWxDb2RlIiwiY29uc3VtZXIuY2l0eSIsImNvbnN1bWVyLnN0YXRlT3JQcm92aW5jZSIsImNvbnN1bWVyLmNvdW50cnlDb2RlIiwiY29uc3VtZXIucGhvbmVOdW1iZXIiLCJjb25zdW1lciIsIm9yZGVyLnN1bUluQ2VudHNFeGNWYXQiLCJvcmRlci52YXRJbkNlbnRzIiwib3JkZXIudG9zVXJsIiwicHJvZHVjdHMiLCJjYWxsYmFja3MiLCJyZXR1cm5VcmxzIl19.JP5DE-BFjsJZ43QhX4-ckiMfKd6lXGnbLMXUtyZm7bG3ZpArws36XudLT9nGN6G1JemBZ-vN5QwCybiXNiCTaA";

      var optionalFields = [
        "payment.locale",
        "payment.creditCardNumber",
        "payment.cvv",
        "payment.ccv",
        "payment.expiresMonth",
        "payment.expiresYear",
        "payment.payDataId",
        "consumer.name",
        "consumer.co",
        "consumer.streetAddress",
        "consumer.streetAddress2",
        "consumer.postalCode",
        "consumer.city",
        "consumer.stateOrProvince",
        "consumer.countryCode",
        "consumer.phoneNumber",
        "consumer",
        "order.sumInCentsExcVat",
        "order.vatInCents",
        "order.tosUrl",
        "products",
        "callbacks",
        "returnUrls"
      ];

      var clientParams = {
        paymentToken: paymentToken,
        apiKey: "DtF4tkCTZCWxnWe4xRYyL9ZwJdtPG6dj",
        optionalFields: optionalFields
      };

      new PayapiClient(clientParams).decodePaymentToken()
        .then(function(decodedMessage) {
          expect(true).to.be.true;
        })
        .catch(function(err) {
          expect(false).to.be.true;
        });
    });
  });

  describe("One-click problem with v0.9.4", function() {
    it("should be fixed", function() {
      var payload = {
        "publicId": "multimerchantshop",
        "order": {
          "currency": "EUR",
          "sumInCentsIncVat": 18200,
          "sumInCentsExcVat": 15000,
          "vatInCents": 3200,
          "referenceId": "multimerchantshop-87c7c6df-e354-493f-9f3d-6dd1a0f092a5",
          "tosUrl": "https://payapi.io/terms"
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
          "model": "EOS 5D",
          "description": "Canon's press material for the EOS 5D states that it 'defines (a) new D-SLR category', while we'r..",
          "imageUrl": "https://store.multimerchantshop.com/image/e3fdad58ef62a70bf356e0042d2e4e51/cache/catalog/demo/canon_eos_5d_1-228x228.jpg",
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
          "success": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/successful",
          "cancel": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/cancelled",
          "failed": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/failed"
        },
        "callbacks": {
          "success": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
          "failed": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
          "chargeback": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback",
          "processing": "https://store.multimerchantshop.com/index.php?route=payment/payapi_payments/callback"
        },
        "consumer": {
          "name": "Peter",
          "co": "co",
          "streetAddress": "Kiwi street",
          "streetAddress2": "Main avenue",
          "postalCode": "29260",
          "city": "Fuengirola",
          "stateOrProvince": "Málaga",
          "countryCode": "FI",
          "locale": "en-US",
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
          "payment.paymentMethod",
          "consumer",
          "consumer.countryCode"
        ]
      };
      return expect(
          new InputDataValidator(payload).validate()
          ).to.be.empty;
    });
  });
  describe("Product.imageUrl problem with v1.2.5", function() {
    it("is not a client issue", function() {
      var payload =
{ publicId: "public_086s4dsbmrn7",
  order:
   { currency: "EUR",
     tosUrl: "https://nets.multimerchantshop.xyz/terms",
     shippingHandlingFeeInCentsIncVat: 0,
     shippingHandlingFeeInCentsExcVat: 0,
     sumInCentsIncVat: 150000,
     sumInCentsExcVat: 150000,
     vatInCents: 0,
     referenceId: "public_086s4dsbmrn7-9bbc76e1-b419-465e-ac7f-6c39330e7d2b" },
  products:
   [ { priceInCentsIncVat: 150000,
       priceInCentsExcVat: 150000,
       vatInCents: 0,
       vatPercentage: 0,
       id: "46",
       quantity: "1",
       title: "Sony VAIO",
       description: "Unprecedented power. The next generation of processing technology has arrived. Built into the new..",
       imageUrl: "https://nets.multimerchantshop.xyz/media/754ab12ab1ed9620b5c067f44b257066/image/cache/catalog/demo/sony_vaio_1-228x228.jpg",
       category: "Laptops",
       model: "SONYVAIO",
       },
     { priceInCentsIncVat: 0,
       priceInCentsExcVat: 0,
       vatInCents: 0,
       vatPercentage: 0,
       id: "shipping_and_handling",
       quantity: 1,
       title: "Shipping and Handling",
       description: "Shipping and handling fees. Added automatically to the order with One-Click payment",
       category: "Shipping" } ],
  returnUrls:
   { success: "https://nets.multimerchantshop.xyz/index.php?route=payment/payapi_payments/successful",
     cancel: "https://nets.multimerchantshop.xyz/index.php?route=payment/payapi_payments/cancelled",
     failed: "https://nets.multimerchantshop.xyz/index.php?route=payment/payapi_payments/failed" },
  callbacks:
   { success: "https://nets.multimerchantshop.xyz/index.php?route=payment/payapi_payments/callback",
     failed: "https://nets.multimerchantshop.xyz/index.php?route=payment/payapi_payments/callback",
     chargeback: "https://nets.multimerchantshop.xyz/index.php?route=payment/payapi_payments/callback",
     processing: "https://nets.multimerchantshop.xyz/index.php?route=payment/payapi_payments/callback" },
  consumer:
    {
      name: "Peter",
      co: "co",
      streetAddress: "Calle andalucía nº 32",
      streetAddress2: "Escalera 1",
      postalCode: "29640",
      city: "Fuengirola",
      stateOrProvince: "Málaga",
      countryCode: "ES",
      locale: "en-US",
      email: "",
      consumerId: ""
    },
  url: "https://nets.multimerchantshop.xyz/sony-vaio&locale=en_US&ip=83.61.237.13",
  scrapeMoment: "2017-02-20T10:54:47.716Z",
  optionalFields:
   [ "products.id",
     "products.description",
     "products.imageUrl",
     "products.category",
     "products.model",
     "products.extraData",
     "order.tosUrl",
     "consumer",
     "callbacks",
     "returnUrls",
     "payment.ip",
     "payment.cardHolderEmail",
     "payment.cardHolderName",
     "payment.paymentMethod",
     "payment.creditCardNumber",
     "payment.ccv",
     "payment.expiresMonth",
     "payment.expiresYear",
     "payment.paymentMethod",
     "consumer",
     "consumer.countryCode" ]
};
      return expect(
          new InputDataValidator(payload).validate()
          ).to.be.empty;
    });
  });
}());
