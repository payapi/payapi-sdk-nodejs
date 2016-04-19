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
        country: "Finland",
        locale: "en-US"
      },
      order: {
        sumInCentsIncVat: 1,
        sumInCentsExcVat: 1,
        vatInCents: 1,
        referenceId: 'x'
      },
      products: [{
        priceInCentsIncVat: 1,
        priceInCentsExcVat: 1,
        vatInCents: 1,
        quantity: 1
      }]
    };
    paymentToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwYXltZW50Ijp7ImlwIjoiOC44LjguOCIsImNhcmRIb2xkZXJFbWFpbCI6Im5vc3VjaGVtYWlsYWRkcmVzc0BwYXlhcGkuaW8iLCJjYXJkSG9sZGVyTmFtZSI6ImNhcmQgaG9sZGVyIG5hbWUiLCJwYXltZW50TWV0aG9kIjoidmlzYSIsImNyZWRpdENhcmROdW1iZXIiOiI0MjQyIDQyNDIgNDI0MiA0MjQyIiwiY2N2IjoiMTIzIiwiZXhwaXJlc01vbnRoIjoiNCIsImV4cGlyZXNZZWFyIjoiMjAxNiJ9LCJjb25zdW1lciI6eyJuYW1lIjoiY29uc3VtZXIgbmFtZSIsImxvY2FsZSI6ImVuLVVTIiwiY28iOiJDYXJlIG9mIHNvbWVvbmUiLCJzdHJlZXRBZGRyZXNzIjoiTWFubmVyaGVpbWludGllIDEyIiwic3RyZWV0QWRkcmVzczIiOiJBIDEyMyIsInBvc3RhbENvZGUiOiIwMDEwMCIsImNpdHkiOiJIZWxzaW5raSIsInN0YXRlT3JQcm92aW5jZSI6IlV1c2ltYWEiLCJjb3VudHJ5IjoiRmlubGFuZCJ9LCJvcmRlciI6eyJzdW1JbkNlbnRzSW5jVmF0IjoxLCJzdW1JbkNlbnRzRXhjVmF0IjoxLCJ2YXRJbkNlbnRzIjoxLCJyZWZlcmVuY2VJZCI6IngifSwicHJvZHVjdHMiOlt7InByaWNlSW5DZW50c0luY1ZhdCI6MSwicHJpY2VJbkNlbnRzRXhjVmF0IjoxLCJ2YXRJbkNlbnRzIjoxLCJxdWFudGl0eSI6MX1dfQ.mWsbaAV_SEtaBnTbDXxHFKp1eSmXiu2LNtm5yg2oguryUyIO9vsERlDHQAoaojad7Vv5FrYkczHH5OKnmsXLAw";
  });

  describe("InputDataValidator", function() {
    describe("Payment", function() {
      describe("Email address", function() {
        it("should succeed with email nosuchemailaddress@payapi.io", function() {
          paymentObject.payment.cardHolderEmail = "nosuchemailaddress@payapi.io";
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });

        it("should fail with email diiba", function() {
          paymentObject.payment.cardHolderEmail = "diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment card holder email");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderEmail");
          expect(validationError.elementName).to.equal("payment[cardHolderEmail]");
          expect(validationError.value).to.equal(paymentObject.payment.cardHolderEmail);
        });

        it("should fail with blacklisted characters", function() {
          paymentObject.payment.cardHolderEmail = "diiba;@example.com";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment card holder email");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderEmail");
          expect(validationError.elementName).to.equal("payment[cardHolderEmail]");
          expect(validationError.value).to.equal(paymentObject.payment.cardHolderEmail);
        });
      });

      describe("IP address", function() {
        it("should succeed with ip 8.8.8.8", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });

        it("should fail with ip ::1:127.0.0.1.ö", function() {
          paymentObject.payment.ip = "::1:127.0.0.1.ö";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment IP address");
          expect(validationError.translationKey).to.equal("invalid.payment.ip.address");
          expect(validationError.elementName).to.equal("payment[ip]");
          expect(validationError.value).to.equal(paymentObject.payment.ip);
        });

        it("should fail with ip :", function() {
          paymentObject.payment.ip = ":";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment IP address");
          expect(validationError.translationKey).to.equal("invalid.payment.ip.address");
          expect(validationError.elementName).to.equal("payment[ip]");
          expect(validationError.value).to.equal(paymentObject.payment.ip);
        });

        it("should fail with ip that contains blacklisted characters", function() {
          paymentObject.payment.ip = "::1;:127.0.0.1";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment IP address");
          expect(validationError.translationKey).to.equal("invalid.payment.ip.address");
          expect(validationError.elementName).to.equal("payment[ip]");
          expect(validationError.value).to.equal(paymentObject.payment.ip);
        });

        it("should succeed with ip ::1:127.0.0.1", function() {
          paymentObject.payment.ip = "::1:127.0.0.1";
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
      });

      describe("cardHolderName", function() {
        it("should succeed with a western cardHolderName", function() {
          paymentObject.payment.cardHolderName = "Matti Meikäläinen";
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should succeed with a chinese cardHolderName", function() {
          paymentObject.payment.cardHolderName = "王 秀英";
          paymentObject.payment.locale = "zh_CN";
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with empty cardHolderName", function() {
          delete paymentObject.payment.cardHolderName;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderName");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
          expect(validationError.elementName).to.equal("payment[cardHolderName]");
          expect(validationError.value).to.equal(paymentObject.payment.cardHolderName);
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.payment.cardHolderName = "< diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderName");
          expect(validationError.elementName).to.equal("payment[cardHolderName]");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
          expect(validationError.value).to.equal(paymentObject.payment.cardHolderName);
        });
        it("should fail with cardHolderName shorter than 2 characters", function() {
          paymentObject.payment.cardHolderName = "x";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderName");
          expect(validationError.elementName).to.equal("payment[cardHolderName]");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
          expect(validationError.value).to.equal(paymentObject.payment.cardHolderName);
        });
        it("should fail with cardHolderName longer than 53 characters", function() {
          paymentObject.payment.cardHolderName = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderName");
          expect(validationError.elementName).to.equal("payment[cardHolderName]");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
          expect(validationError.value).to.equal(paymentObject.payment.cardHolderName);
        });
      });

      describe("paymentMethod", function() {
        it("should be valid with alpha characters", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });

        it("should fail with non-alpha characters", function() {
          paymentObject.payment.paymentMethod = "visa2";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment method");
          expect(validationError.elementName).to.equal("payment[paymentMethod]");
          expect(validationError.translationKey).to.equal("invalid.payment.paymentMethod");
          expect(validationError.value).to.equal(paymentObject.payment.paymentMethod);
        });
      });

      describe("creditCardNumber", function() {
        it("should be valid with a valid cc number of 16 integers", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });

        it("should fail with an invalid cc number of 15 integers", function() {
          paymentObject.payment.creditCardNumber = "123456789012345";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment credit card number");
          expect(validationError.elementName).to.equal("payment[creditCardNumber]");
          expect(validationError.translationKey).to.equal("invalid.payment.creditCardNumber");
          expect(validationError.value).to.equal(paymentObject.payment.creditCardNumber);
        });
      });

      describe("ccv", function() {
        it("should be valid with a valid ccv number of 3 integers", function() {
          // note: american express: 4 digits, everyone else: 3 digits
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with an invalid ccv number of 2 integers", function() {
          paymentObject.payment.ccv = "12";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment ccv");
          expect(validationError.elementName).to.equal("payment[ccv]");
          expect(validationError.translationKey).to.equal("invalid.payment.ccv");
          expect(validationError.value).to.equal(paymentObject.payment.ccv);
        });
        it("should fail with an invalid ccv number of 5 integers", function() {
          paymentObject.payment.ccv = "12345";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment ccv");
          expect(validationError.elementName).to.equal("payment[ccv]");
          expect(validationError.translationKey).to.equal("invalid.payment.ccv");
          expect(validationError.value).to.equal(paymentObject.payment.ccv);
        });
        it("should fail with an invalid ccv other than integers", function() {
          paymentObject.payment.ccv = "12a";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment ccv");
          expect(validationError.elementName).to.equal("payment[ccv]");
          expect(validationError.translationKey).to.equal("invalid.payment.ccv");
          expect(validationError.value).to.equal(paymentObject.payment.ccv);
        });
      });

      describe("expiresMonth", function() {
        it("should be valid with a valid month", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should be invalid with a zero month", function() {
          paymentObject.payment.expiresMonth = "0";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment expires month");
          expect(validationError.elementName).to.equal("payment[expiresMonth]");
          expect(validationError.translationKey).to.equal("invalid.payment.expiresMonth");
          expect(validationError.value).to.equal(paymentObject.payment.expiresMonth);
        });
        it("should be invalid with a month larger than 12", function() {
          paymentObject.payment.expiresMonth = "13";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment expires month");
          expect(validationError.elementName).to.equal("payment[expiresMonth]");
          expect(validationError.translationKey).to.equal("invalid.payment.expiresMonth");
          expect(validationError.value).to.equal(paymentObject.payment.expiresMonth);
        });
      });

      describe("expiresYear", function() {
        it("should be valid with a valid year", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should be invalid with a year smaller than current", function() {
          paymentObject.payment.expiresYear = moment().year() - 1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid payment expires year");
          expect(validationError.translationKey).to.equal("invalid.payment.expiresYear");
          expect(validationError.value).to.equal(paymentObject.payment.expiresYear);
        });
      });

      describe("Expiration month and year", function() {
        it("should be current month or later", function() {
          var expiredDate = moment().subtract(1, 'month');
          paymentObject.payment.expiresMonth = expiredDate.month() + 1;
          paymentObject.payment.expiresYear = expiredDate.year();
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Card has expired");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHasExpired");
          expect(validationError.value).to.equal(paymentObject.payment.expiresMonth + "/" + paymentObject.payment.expiresYear);
        });
      });

    });

    describe("Consumer", function() {
      describe("Name", function() {
        it("should succeed with a western name", function() {
          paymentObject.consumer.name = "Matti Meikäläinen";
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should succeed with a chinese name", function() {
          paymentObject.consumer.name = "王 秀英";
          paymentObject.consumer.locale = "zh_CN";
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with empty name", function() {
          delete paymentObject.consumer.name;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.elementName).to.equal("consumer[name]");
          expect(validationError.value).to.equal(paymentObject.consumer.name);
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.consumer.name = "< diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.elementName).to.equal("consumer[name]");
          expect(validationError.value).to.equal(paymentObject.consumer.name);
        });
        it("should fail with name shorter than 2 characters", function() {
          paymentObject.consumer.name = "x";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.elementName).to.equal("consumer[name]");
          expect(validationError.value).to.equal(paymentObject.consumer.name);
        });
        it("should fail with name longer than 53 characters", function() {
          paymentObject.consumer.name = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.elementName).to.equal("consumer[name]");
          expect(validationError.value).to.equal(paymentObject.consumer.name);
        });
      });

      describe("c/o (care of)", function() {
        it("should succeed when left empty", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with co longer than 53 characters", function() {
          paymentObject.consumer.co = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer c/o");
          expect(validationError.translationKey).to.equal("invalid.consumer.co");
          expect(validationError.elementName).to.equal("consumer[co]");
          expect(validationError.value).to.equal(paymentObject.consumer.co);
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.consumer.co = "< diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer c/o");
          expect(validationError.elementName).to.equal("consumer[co]");
          expect(validationError.translationKey).to.equal("invalid.consumer.co");
          expect(validationError.value).to.equal(paymentObject.consumer.co);
        });
      });

      describe("Street address", function() {
        it("should fail when left empty", function() {
          delete paymentObject.consumer.streetAddress;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
          expect(validationError.value).to.equal(paymentObject.consumer.streetAddress);
        });
        it("should fail with streetAddress longer than 53 characters", function() {
          paymentObject.consumer.streetAddress = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
          expect(validationError.elementName).to.equal("consumer[streetAddress]");
          expect(validationError.value).to.equal(paymentObject.consumer.streetAddress);
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.consumer.streetAddress = "< diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
          expect(validationError.elementName).to.equal("consumer[streetAddress]");
          expect(validationError.value).to.equal(paymentObject.consumer.streetAddress);
        });
      });

      describe("Street address 2", function() {
        it("should succeed when left empty", function() {
          delete paymentObject.consumer.streetAddress2;
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with streetAddress longer than 53 characters", function() {
          paymentObject.consumer.streetAddress2 = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address 2");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress2");
          expect(validationError.elementName).to.equal("consumer[streetAddress2]");
          expect(validationError.value).to.equal(paymentObject.consumer.streetAddress2);
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.consumer.streetAddress2 = "< diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address 2");
          expect(validationError.elementName).to.equal("consumer[streetAddress2]");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress2");
          expect(validationError.value).to.equal(paymentObject.consumer.streetAddress2);
        });
      });

      describe("Postal code", function() {
        it("should fail when left empty", function() {
          delete paymentObject.consumer.postalCode;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer postal code");
          expect(validationError.elementName).to.equal("consumer[postalCode]");
          expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
          expect(validationError.value).to.equal(paymentObject.consumer.postalCode);
        });
        it("should fail with postalCode longer than 10 characters", function() {
          paymentObject.consumer.postalCode = "12345678901";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer postal code");
          expect(validationError.elementName).to.equal("consumer[postalCode]");
          expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
          expect(validationError.value).to.equal(paymentObject.consumer.postalCode);
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.consumer.postalCode = "< diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer postal code");
          expect(validationError.elementName).to.equal("consumer[postalCode]");
          expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
          expect(validationError.value).to.equal(paymentObject.consumer.postalCode);
        });
      });

      describe("City", function() {
        it("should fail when left empty", function() {
          delete paymentObject.consumer.city;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer city");
          expect(validationError.translationKey).to.equal("invalid.consumer.city");
          expect(validationError.elementName).to.equal("consumer[city]");
          expect(validationError.value).to.equal(paymentObject.consumer.city);
        });
        it("should fail with city longer than 53 characters", function() {
          paymentObject.consumer.city = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer city");
          expect(validationError.translationKey).to.equal("invalid.consumer.city");
          expect(validationError.elementName).to.equal("consumer[city]");
          expect(validationError.value).to.equal(paymentObject.consumer.city);
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.consumer.city = "< diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer city");
          expect(validationError.translationKey).to.equal("invalid.consumer.city");
          expect(validationError.elementName).to.equal("consumer[city]");
          expect(validationError.value).to.equal(paymentObject.consumer.city);
        });
      });

      describe("State or province", function() {
        it("should succeed when left empty", function() {
          delete paymentObject.consumer.stateOrProvince;
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with stateOrProvince longer than 53 characters", function() {
          paymentObject.consumer.stateOrProvince = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer state or province");
          expect(validationError.translationKey).to.equal("invalid.consumer.stateOrProvince");
          expect(validationError.elementName).to.equal("consumer[stateOrProvince]");
          expect(validationError.value).to.equal(paymentObject.consumer.stateOrProvince);
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.consumer.stateOrProvince = "< diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer state or province");
          expect(validationError.elementName).to.equal("consumer[stateOrProvince]");
          expect(validationError.translationKey).to.equal("invalid.consumer.stateOrProvince");
          expect(validationError.value).to.equal(paymentObject.consumer.stateOrProvince);
        });
      });

      describe("Country", function() {
        it("should fail when left empty", function() {
          delete paymentObject.consumer.country;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer country");
          expect(validationError.translationKey).to.equal("invalid.consumer.country");
          expect(validationError.elementName).to.equal("consumer[country]");
          expect(validationError.value).to.equal(paymentObject.consumer.country);
        });
        it("should fail with country longer than 53 characters", function() {
          paymentObject.consumer.country = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer country");
          expect(validationError.translationKey).to.equal("invalid.consumer.country");
          expect(validationError.elementName).to.equal("consumer[country]");
          expect(validationError.value).to.equal(paymentObject.consumer.country);
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.consumer.country = "< diiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer country");
          expect(validationError.translationKey).to.equal("invalid.consumer.country");
          expect(validationError.elementName).to.equal("consumer[country]");
          expect(validationError.value).to.equal(paymentObject.consumer.country);
        });
      });

      describe("Locale", function() {
        it("should fall back to en-US when left empty", function() {
          delete paymentObject.consumer.locale;
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with blacklisted characters", function() {
          paymentObject.consumer.locale = "<iiba";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer locale");
          expect(validationError.translationKey).to.equal("invalid.consumer.locale");
          expect(validationError.elementName).to.equal("consumer[locale]");
          expect(validationError.value).to.equal(paymentObject.consumer.locale);
        });
        it("should fail when being under 5 characters long", function() {
          paymentObject.consumer.locale = "fi-F";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer locale");
          expect(validationError.elementName).to.equal("consumer[locale]");
          expect(validationError.translationKey).to.equal("invalid.consumer.locale");
          expect(validationError.value).to.equal(paymentObject.consumer.locale);
        });
        it("should fail when being over 10 characters long", function() {
          paymentObject.consumer.locale = "12345678901";
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer locale");
          expect(validationError.elementName).to.equal("consumer[locale]");
          expect(validationError.translationKey).to.equal("invalid.consumer.locale");
          expect(validationError.value).to.equal(paymentObject.consumer.locale);
        });
      });
    });

    describe("Product", function() {
      describe("priceInCentsIncVat", function() {
        it("should succeed with integer 1", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should succeed with string '1'", function() {
          paymentObject.products[0].priceInCentsIncVat = '1';
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with fractional 0.1", function() {
          paymentObject.products[0].priceInCentsIncVat = 0.1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid product price in cents including VAT");
          expect(validationError.translationKey).to.equal("invalid.product.priceInCentsIncVat");
          expect(validationError.value).to.equal('' + paymentObject.products[0].priceInCentsIncVat);
        });
      });
      describe("priceInCentsExcVat", function() {
        it("should succeed with integer 1", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should succeed with string '1'", function() {
          paymentObject.products[0].priceInCentsExcVat = '1';
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with fractional 0.1", function() {
          paymentObject.products[0].priceInCentsExcVat = 0.1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid product price in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.product.priceInCentsExcVat");
          expect(validationError.value).to.equal('' + paymentObject.products[0].priceInCentsExcVat);
        });
      });
      describe("quantity", function() {
        it("should succeed with integer 1", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should succeed with string '1'", function() {
          paymentObject.products[0].quantity = '1';
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });
        it("should fail with fractional 0.1", function() {
          paymentObject.products[0].quantity = 0.1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid product quantity");
          expect(validationError.translationKey).to.equal("invalid.product.quantity");
          expect(validationError.value).to.equal('' + paymentObject.products[0].quantity);
        });
      });
    });

    describe("Order", function() {
      describe("sumInCentsIncVat", function() {
        it("should succeed with integer 1", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });

        it("should fail with fractional 0.1", function() {
          paymentObject.order.sumInCentsIncVat = 0.1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents including VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsIncVat");
          expect(validationError.value).to.equal(paymentObject.order.sumInCentsIncVat);
        });

        it("should fail with negative 1", function() {
          paymentObject.order.sumInCentsIncVat = -1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents including VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsIncVat");
          expect(validationError.value).to.equal(paymentObject.order.sumInCentsIncVat);
        });

        it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
          paymentObject.order.sumInCentsIncVat = Number.MAX_SAFE_INTEGER + 1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents including VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsIncVat");
          expect(validationError.value).to.equal(paymentObject.order.sumInCentsIncVat);
        });

      });

      describe("sumInCentsExcVat", function() {
        it("should succeed with integer 1", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });

        it("should fail with fractional 0.1", function() {
          paymentObject.order.sumInCentsExcVat = 0.1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsExcVat");
          expect(validationError.value).to.equal(paymentObject.order.sumInCentsExcVat);
        });

        it("should fail with negative 1", function() {
          paymentObject.order.sumInCentsExcVat = -1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsExcVat");
          expect(validationError.value).to.equal(paymentObject.order.sumInCentsExcVat);
        });

        it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
          paymentObject.order.sumInCentsExcVat = Number.MAX_SAFE_INTEGER + 1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsExcVat");
          expect(validationError.value).to.equal(paymentObject.order.sumInCentsExcVat);
        });
      });

      describe("vatInCents", function() {
        it("should succeed with integer 1", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });

        it("should fail with fractional 0.1", function() {
          paymentObject.order.vatInCents = 0.1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid VAT in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
          expect(validationError.value).to.equal(paymentObject.order.vatInCents);
        });

        it("should fail with negative 1", function() {
          paymentObject.order.vatInCents = -1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid VAT in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
          expect(validationError.value).to.equal(paymentObject.order.vatInCents);
        });

        it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
          paymentObject.order.vatInCents = Number.MAX_SAFE_INTEGER + 1;
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid VAT in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
          expect(validationError.value).to.equal(paymentObject.order.vatInCents);
        });
      });

      describe("referenceId", function() {
        it("should succeed with x", function() {
          return expect(
            new InputDataValidator(paymentObject).validate()
          ).to.be.empty;
        });

        it("should fail when longer than 255 characters", function() {
          paymentObject.order.referenceId = new Array(257).join('x');
          var validationError = new InputDataValidator(paymentObject).validate()[0];
          expect(validationError.message).to.equal("Invalid order reference ID");
          expect(validationError.translationKey).to.equal("invalid.order.referenceId");
          expect(validationError.value).to.equal(paymentObject.order.referenceId);
        });

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
            "locale": "en-US",
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
            "country": "Spain"
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
              "vatPercentage": "22%",
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
              "vatPercentage": "22%",
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
    describe("Encoding a payment object to a payment token", function() {
      it("should succeed", function() {
        var params = {
          apiKey: apiKey,
          payload: paymentObject
        };
        return expect(
          new PayapiClient(params).encodePaymentToken()
        ).to.equal(paymentToken);
      });
    });
    describe("Encoding a payment token to a payment object", function() {
      it("should succeed", function() {
        var params = {
          apiKey: apiKey,
          paymentToken: paymentToken
        };
        return expect(
          new PayapiClient(params).decodePaymentToken().payment.cardHolderName
        ).to.equal(paymentObject.payment.cardHolderName);
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
}());
