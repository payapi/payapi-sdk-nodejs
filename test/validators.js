(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;
  const moment = require("moment");
  chai.use(chaiAsPromised);
  var InputDataValidator = require("../lib/validators");
  var params;

  beforeEach(function() {
    params = {
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

      describe("cardHolderName", function() {
        it("should succeed with a western cardHolderName", function() {
          params.payment.cardHolderName = "Matti Meikäläinen";
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should succeed with a chinese cardHolderName", function() {
          params.payment.cardHolderName = "王 秀英";
          params.payment.locale = "zh_CN";
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should fail with empty cardHolderName", function() {
          delete params.payment.cardHolderName;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderName");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
          expect(validationError.value).to.equal(params.payment.cardHolderName);
        });
        it("should fail with blacklisted characters", function() {
          params.payment.cardHolderName = "< diiba";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderName");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
          expect(validationError.value).to.equal(params.payment.cardHolderName);
        });
        it("should fail with cardHolderName shorter than 2 characters", function() {
          params.payment.cardHolderName = "x";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderName");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
          expect(validationError.value).to.equal(params.payment.cardHolderName);
        });
        it("should fail with cardHolderName longer than 53 characters", function() {
          params.payment.cardHolderName = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderName");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
          expect(validationError.value).to.equal(params.payment.cardHolderName);
        });
      });

      describe("paymentMethod", function() {
        it("should be valid with alpha characters", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail with non-alpha characters", function() {
          params.payment.paymentMethod = "visa2";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment method");
          expect(validationError.translationKey).to.equal("invalid.payment.paymentMethod");
          expect(validationError.value).to.equal(params.payment.paymentMethod);
        });
      });

      describe("creditCardNumber", function() {
        it("should be valid with a valid cc number of 16 integers", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail with an invalid cc number of 15 integers", function() {
          params.payment.creditCardNumber = "123456789012345";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment credit card number");
          expect(validationError.translationKey).to.equal("invalid.payment.creditCardNumber");
          expect(validationError.value).to.equal(params.payment.creditCardNumber);
        });
      });

      describe("ccv", function() {
        it("should be valid with a valid ccv number of 3 integers", function() {
          // note: american express: 4 digits, everyone else: 3 digits
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should fail with an invalid ccv number of 2 integers", function() {
          params.payment.ccv = "12";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment ccv");
          expect(validationError.translationKey).to.equal("invalid.payment.ccv");
          expect(validationError.value).to.equal(params.payment.ccv);
        });
        it("should fail with an invalid ccv number of 5 integers", function() {
          params.payment.ccv = "12345";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment ccv");
          expect(validationError.translationKey).to.equal("invalid.payment.ccv");
          expect(validationError.value).to.equal(params.payment.ccv);
        });
        it("should fail with an invalid ccv other than integers", function() {
          params.payment.ccv = "12a";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment ccv");
          expect(validationError.translationKey).to.equal("invalid.payment.ccv");
          expect(validationError.value).to.equal(params.payment.ccv);
        });
      });

      describe("expiresMonth", function() {
        it("should be valid with a valid month", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should be invalid with a zero month", function() {
          params.payment.expiresMonth = "0";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment expires month");
          expect(validationError.translationKey).to.equal("invalid.payment.expiresMonth");
          expect(validationError.value).to.equal(params.payment.expiresMonth);
        });
        it("should be invalid with a month larger than 12", function() {
          params.payment.expiresMonth = "13";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment expires month");
          expect(validationError.translationKey).to.equal("invalid.payment.expiresMonth");
          expect(validationError.value).to.equal(params.payment.expiresMonth);
        });
      });

      describe("expiresYear", function() {
        it("should be valid with a valid year", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should be invalid with a year smaller than current", function() {
          params.payment.expiresYear = moment().year() - 1;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment expires year");
          expect(validationError.translationKey).to.equal("invalid.payment.expiresYear");
          expect(validationError.value).to.equal(params.payment.expiresYear);
        });
      });

      describe("Expiration month and year", function() {
        it("should be current month or later", function() {
          var expiredDate = moment().subtract(1, 'month');
          params.payment.expiresMonth = expiredDate.month() + 1;
          params.payment.expiresYear = expiredDate.year();
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Card has expired");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHasExpired");
          expect(validationError.value).to.equal(params.payment.expiresMonth + "/" + params.payment.expiresYear);
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
        it("should fail with blacklisted characters", function() {
          params.consumer.co = "< diiba";
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
        it("should fail with blacklisted characters", function() {
          params.consumer.streetAddress = "< diiba";
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
        it("should fail with blacklisted characters", function() {
          params.consumer.streetAddress2 = "< diiba";
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
        it("should fail with blacklisted characters", function() {
          params.consumer.postalCode = "< diiba";
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
        it("should fail with blacklisted characters", function() {
          params.consumer.city = "< diiba";
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
        it("should fail with blacklisted characters", function() {
          params.consumer.stateOrProvince = "< diiba";
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
        it("should fail with blacklisted characters", function() {
          params.consumer.country = "< diiba";
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
        it("should fail with blacklisted characters", function() {
          params.consumer.locale = "<iiba";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer locale");
          expect(validationError.translationKey).to.equal("invalid.consumer.locale");
          expect(validationError.value).to.equal(params.consumer.locale);
        });
        it("should fail when being under 5 characters long", function() {
          params.consumer.locale = "fi-F";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer locale");
          expect(validationError.translationKey).to.equal("invalid.consumer.locale");
          expect(validationError.value).to.equal(params.consumer.locale);
        });
        it("should fail when being over 10 characters long", function() {
          params.consumer.locale = "12345678901";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer locale");
          expect(validationError.translationKey).to.equal("invalid.consumer.locale");
          expect(validationError.value).to.equal(params.consumer.locale);
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
          expect(validationError.message).to.equal("Invalid order reference ID");
          expect(validationError.translationKey).to.equal("invalid.order.referenceId");
          expect(validationError.value).to.equal(params.order.referenceId);
        });

        it("should fail when not alphanumeric", function() {
          params.order.referenceId = "!";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid order reference ID");
          expect(validationError.translationKey).to.equal("invalid.order.referenceId");
          expect(validationError.value).to.equal(params.order.referenceId);
        });

        it("should fail with blacklisted characters", function() {
          params.order.referenceId = "<iiba";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid order reference ID");
          expect(validationError.translationKey).to.equal("invalid.order.referenceId");
          expect(validationError.value).to.equal(params.order.referenceId);
        });

      });
    });

//    describe("Seller", function() {
//      describe("companyName", function() {
//        it("should ", function() {
//          console.log("TBD companyName");
//          return expect(
//            new InputDataValidator(params).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("streetAddress", function() {
//        it("should ", function() {
//          console.log("TBD streetAddress");
//          return expect(
//            new InputDataValidator(params).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("streetAddress2", function() {
//        it("should ", function() {
//          console.log("TBD streetAddress2");
//          return expect(
//            new InputDataValidator(params).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("postalCode", function() {
//        it("should ", function() {
//          console.log("TBD postalCode");
//          return expect(
//            new InputDataValidator(params).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("city", function() {
//        it("should ", function() {
//          console.log("TBD city");
//          return expect(
//            new InputDataValidator(params).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("country", function() {
//        it("should ", function() {
//          console.log("TBD country");
//          return expect(
//            new InputDataValidator(params).validate()
//          ).to.be.empty;
//        });
//      });
//
//      describe("businessVatId", function() {
//        it("should ", function() {
//          console.log("TBD businessVatId");
//          return expect(
//            new InputDataValidator(params).validate()
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
}());
