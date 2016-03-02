(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;
  const moment = require("moment");
  chai.use(chaiAsPromised);
  var InputDataValidator = require("../lib/validators").InputDataValidator;
  var params;

  beforeEach(function() {
    params = {
      payment: {
        ip: "8.8.8.8",
        cardHolderEmail: 'nosuchemailaddress@payapi.io'
      },
      consumer: {
        name: "consumer name",
        locale: "en-US",
        co: "Care of someone",
        streetAddress: "Mannerheimintie 12",
        streetAddress: "A 123",
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
      }
    };
  });

  describe("InputDataValidator", function() {
    describe("Payment", function() {
      describe("Email address", function() {
        it("should succeed with email nosuchemailaddress@payapi.io", function() {
          params.payment.cardHolderEmail = "nosuchemailaddress@payapi.io";
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail with email diiba", function() {
          params.payment.cardHolderEmail = "diiba";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment card holder email");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderEmail");
          expect(validationError.value).to.equal(params.payment.cardHolderEmail);
        });

        it("should fail with blacklisted characters", function() {
          params.payment.cardHolderEmail = "diiba;@example.com";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment card holder email");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderEmail");
          expect(validationError.value).to.equal(params.payment.cardHolderEmail);
        });
      });

      describe("IP address", function() {
        it("should succeed with ip 8.8.8.8", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail with ip ::1:127.0.0.1.ö", function() {
          params.payment.ip = "::1:127.0.0.1.ö";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment IP address");
          expect(validationError.translationKey).to.equal("invalid.payment.ip.address");
          expect(validationError.value).to.equal(params.payment.ip);
        });

        it("should fail with ip :", function() {
          params.payment.ip = ":";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment IP address");
          expect(validationError.translationKey).to.equal("invalid.payment.ip.address");
          expect(validationError.value).to.equal(params.payment.ip);
        });

        it("should fail with ip that contains blacklisted characters", function() {
          params.payment.ip = "::1;:127.0.0.1";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment IP address");
          expect(validationError.translationKey).to.equal("invalid.payment.ip.address");
          expect(validationError.value).to.equal(params.payment.ip);
        });

        it("should succeed with ip ::1:127.0.0.1", function() {
          params.payment.ip = "::1:127.0.0.1";
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
      });
    });

    describe("Consumer", function() {

      describe("Name", function() {
        it("should succeed with a western name", function() {
          params.consumer.name = "Matti Meikäläinen";
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should succeed with a chinese name", function() {
          params.consumer.name = "王 秀英";
          params.consumer.locale = "zh_CN";
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should fail with empty name", function() {
          delete params.consumer.name;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.value).to.equal(params.consumer.name);
        });
        it("should fail with blacklisted characters", function() {
          params.consumer.name = "< diiba";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.value).to.equal(params.consumer.name);
        });
        it("should fail with name shorter than 2 characters", function() {
          params.consumer.name = "x";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.value).to.equal(params.consumer.name);
        });
        it("should fail with name longer than 53 characters", function() {
          params.consumer.name = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.value).to.equal(params.consumer.name);
        });
      });

      describe("c/o (care of)", function() {
        it("should succeed when left empty", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should fail with co longer than 53 characters", function() {
          params.consumer.co = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer c/o");
          expect(validationError.translationKey).to.equal("invalid.consumer.co");
          expect(validationError.value).to.equal(params.consumer.co);
        });
      });

      describe("Street address", function() {
        it("should fail when left empty", function() {
          delete params.consumer.streetAddress;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
          expect(validationError.value).to.equal(params.consumer.streetAddress);
        });
        it("should fail with streetAddress longer than 53 characters", function() {
          params.consumer.streetAddress = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
          expect(validationError.value).to.equal(params.consumer.streetAddress);
        });
      });

      describe("Street address 2", function() {
        it("should succeed when left empty", function() {
          delete params.consumer.streetAddress2;
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should fail with streetAddress longer than 53 characters", function() {
          params.consumer.streetAddress2 = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address 2");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress2");
          expect(validationError.value).to.equal(params.consumer.streetAddress2);
        });
      });

      describe("Postal code", function() {
        it("should fail when left empty", function() {
          delete params.consumer.postalCode;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer postal code");
          expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
          expect(validationError.value).to.equal(params.consumer.postalCode);
        });
        it("should fail with postalCode longer than 10 characters", function() {
          params.consumer.postalCode = "12345678901";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer postal code");
          expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
          expect(validationError.value).to.equal(params.consumer.postalCode);
        });
      });

      describe("City", function() {
        it("should fail when left empty", function() {
          delete params.consumer.city;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer city");
          expect(validationError.translationKey).to.equal("invalid.consumer.city");
          expect(validationError.value).to.equal(params.consumer.city);
        });
        it("should fail with city longer than 53 characters", function() {
          params.consumer.city = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer city");
          expect(validationError.translationKey).to.equal("invalid.consumer.city");
          expect(validationError.value).to.equal(params.consumer.city);
        });
      });

      describe("State or province", function() {
        it("should succeed when left empty", function() {
          delete params.consumer.stateOrProvince;
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should fail with stateOrProvince longer than 53 characters", function() {
          params.consumer.stateOrProvince = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer state or province");
          expect(validationError.translationKey).to.equal("invalid.consumer.stateOrProvince");
          expect(validationError.value).to.equal(params.consumer.stateOrProvince);
        });
      });

      describe("Country", function() {
        it("should fail when left empty", function() {
          delete params.consumer.country;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer country");
          expect(validationError.translationKey).to.equal("invalid.consumer.country");
          expect(validationError.value).to.equal(params.consumer.country);
        });
        it("should fail with country longer than 53 characters", function() {
          params.consumer.country = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer country");
          expect(validationError.translationKey).to.equal("invalid.consumer.country");
          expect(validationError.value).to.equal(params.consumer.country);
        });
      });

      describe("Locale", function() {
        it("should fall back to en-US when left empty", function() {
          delete params.consumer.locale;
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
      });
    });

    describe("Order", function() {
      describe("sumInCentsIncVat", function() {
        it("should succeed with integer 1", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail with fractional 0.1", function() {
          params.order.sumInCentsIncVat = 0.1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents including VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsIncVat");
          expect(validationError.value).to.equal(params.order.sumInCentsIncVat);
        });

        it("should fail with negative 1", function() {
          params.order.sumInCentsIncVat = -1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents including VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsIncVat");
          expect(validationError.value).to.equal(params.order.sumInCentsIncVat);
        });

        it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
          params.order.sumInCentsIncVat = Number.MAX_SAFE_INTEGER + 1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents including VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsIncVat");
          expect(validationError.value).to.equal(params.order.sumInCentsIncVat);
        });

      });

      describe("sumInCentsExcVat", function() {
        it("should succeed with integer 1", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail with fractional 0.1", function() {
          params.order.sumInCentsExcVat = 0.1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsExcVat");
          expect(validationError.value).to.equal(params.order.sumInCentsExcVat);
        });

        it("should fail with negative 1", function() {
          params.order.sumInCentsExcVat = -1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsExcVat");
          expect(validationError.value).to.equal(params.order.sumInCentsExcVat);
        });

        it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
          params.order.sumInCentsExcVat = Number.MAX_SAFE_INTEGER + 1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid sum in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.sumInCentsExcVat");
          expect(validationError.value).to.equal(params.order.sumInCentsExcVat);
        });
      });

      describe("vatInCents", function() {
        it("should succeed with integer 1", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail with fractional 0.1", function() {
          params.order.vatInCents = 0.1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid VAT in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
          expect(validationError.value).to.equal(params.order.vatInCents);
        });

        it("should fail with negative 1", function() {
          params.order.vatInCents = -1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid VAT in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
          expect(validationError.value).to.equal(params.order.vatInCents);
        });

        it("should fail with Number.MAX_SAFE_INTEGER + 1", function() {
          params.order.vatInCents = Number.MAX_SAFE_INTEGER + 1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid VAT in cents excluding VAT");
          expect(validationError.translationKey).to.equal("invalid.order.vatInCents");
          expect(validationError.value).to.equal(params.order.vatInCents);
        });
      });

      describe("referenceId", function() {
        it("should succeed with x", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail when longer than 255 characters", function() {
          params.order.referenceId = new Array(257).join('x');
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid reference ID");
          expect(validationError.translationKey).to.equal("invalid.order.referenceId");
          expect(validationError.value).to.equal(params.order.referenceId);
        });

        it("should fail when not alphanumeric", function() {
          params.order.referenceId = "!";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid reference ID");
          expect(validationError.translationKey).to.equal("invalid.order.referenceId");
          expect(validationError.value).to.equal(params.order.referenceId);
        });

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
            "expiresYear": "2016",
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
}());
