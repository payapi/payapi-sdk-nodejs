(function () {
  "use strict";
  var jwt = require("jwt-simple");
  var rp = require("request-promise");
  var InputDataValidator = require("./validators");

  module.exports = function PayapiClient(params) {

    function print(key, value) {
      console.log(key + ":" + JSON.stringify(value, null, 2));
    }

    function toPaymentObject() {
      var jwtHeader64 = params.paymentToken.split(".")[0];
      var jwtHeader = JSON.parse(new Buffer(jwtHeader64, "base64").toString());
      var alg = jwtHeader.alg;
      if (false && alg === "HS512" ||
          alg === "HS384" ||
          alg === "HS256" ||
          alg === "RS256") {
        return jwt.decode(params.paymentToken, params.apiKey);
      } else {
        throw new Error("Only HS256, HS384, HS512 and RS256 algorithms are supported for JWT.");
      }
    }

    function sanitizeAndExtractBinAndLast4(apiKeyAndToken) {
      var paymentObject = toPaymentObject();
      if(params.optionalFields.indexOf("payment") < 0 &&
          params.optionalFields.indexOf("payment.creditCardNumber") < 0) {
        paymentObject.payment.creditCardNumber = paymentObject.payment.creditCardNumber.replace(/\s/g,"");
        paymentObject.payment.cardBin = paymentObject.payment.creditCardNumber
          .replace(/\s/g, "")
          .substring(0, 6);
      }
      return paymentObject;
    }

    function toPaymentToken() {
      return jwt.encode(params.payload, params.apiKey, "HS512");
    }

    if(params) {
      params.returningConsumer = params.returningConsumer || false;
      params.optionalFields = params.optionalFields || [];
      params.extra = params.extra || {};

      if(params.payment && params.payment.creditCardNumber) {
        params.payment.creditCardNumber = params.payment.creditCardNumber.replace(/\s/g, "");
        params.payment.cardBin = params.payment.creditCardNumber
          .replace(/\s/g, "")
          .substring(0, 6);
      }

      if(params.paymentToken) {
        // decode, sanitize and re-package
        params.payload = sanitizeAndExtractBinAndLast4();
        params.paymentToken = toPaymentToken();
      }
    }

    function validateApiKey(params) {
      return new Promise(function(resolve, reject) {
        if(!params.apiKey) {
          reject("apiKey must not be empty");
        } else {
          resolve(params);
        }
      });
    }

    // secret is unused in v1, but is here as a placeholder for v2
    function validateSecret(params) {
      return new Promise(function(resolve, reject) {
        if(!params.secret) {
          reject("secret must not be empty");
        } else {
          resolve(params);
        }
      });
    }

    function validatePayload(params) {
      return new Promise(function(resolve, reject) {
        var payload = {
          payment: params.payment,
          consumer: params.consumer,
          order: params.order,
          products: params.products,
          callbacks: params.callbacks,
          returningConsumer: params.returningConsumer || false,
          optionalFields: params.optionalFields || [],
          extra: params.extra || {}
        };
        var validationErrors = new InputDataValidator(payload).validate();
        if(validationErrors.length > 0) {
          reject(validationErrors);
        } else {
          params.payload = payload;
          resolve(params);
        }
      });
    }

    function createToken(params) {
      return new Promise(function(resolve, reject) {
        if(params.payload) {
          params.paymentToken = toPaymentToken(params.payload, params.apiKey, "HS512");
          resolve(params);
        } else if(params.paymentToken) {
          resolve(params);
        } else {
          reject(new Error("No payment token or payload to create a payment token from. Unable to continue."));
        }
      });
    }

    function doRestCall(params) {
      return new Promise(function(resolve, reject) {
        var uri;
        switch(process.env.NODE_ENV) {
          case "production":
            uri = "https://input.payapi.io/v1/api/authorized/payments";
            break;
          case "staging":
            uri = "https://staging-input.payapi.io/v1/api/authorized/payments";
            break;
          default:
            uri = "http://localhost:3000/v1/api/authorized/payments";
        }
        rp({
          method: "POST",
          uri: uri,
          body: {
            authenticationToken: params.authenticationToken,
            paymentToken: params.paymentToken
          },
          json: true
        }).then(function(params) {
          resolve(params);
        }).catch(function(err) {
          reject(err);
        });
      });
    }

    function handleError(err) {
      return new Promise(function(resolve, reject) {
        console.log("Payapi Client Error:" + JSON.stringify(err, null, 2));
        reject(err);
      });
    }

    function convertNumberToNumber(params) {
      return new Promise(function(resolve, reject) {
        for(var i = 0; i < params.payload.products.length; i++) {
          params.payload.products[i].quantity = Number(params.payload.products[i].quantity);
          params.payload.products[i].priceInCentsIncVat = Number(params.payload.products[i].priceInCentsIncVat);
          params.payload.products[i].priceInCentsExcVat = Number(params.payload.products[i].priceInCentsExcVat);
          params.payload.products[i].vatPercentage = Number(params.payload.products[i].vatPercentage);
        }
        params.payload.order.sumInCentsIncVat = Number(params.payload.order.sumInCentsIncVat);
        params.payload.order.sumInCentsExcVat = Number(params.payload.order.sumInCentsExcVat);
        resolve(params);
      });
    }

    return {
      call: function(callParams) {
        if(callParams) {
          return doRestCall(callParams).catch(handleError);
        } else {
          return validateApiKey(params)
            .then(validateSecret)
            .then(validatePayload)
            .then(convertNumberToNumber)
            .then(createToken)
            .then(doRestCall)
            .catch(handleError);
        }
      },
      paymentToken: function() {
        return validatePayload(params)
          .then(convertNumberToNumber)
          .then(createToken)
          .then(function(params) {
            return new Promise(function(resolve, reject) {
              resolve(params.paymentToken);
            });
          })
          .catch(function(err) {
            throw err;
          });
      },
      validate: function() {
        return validatePayload(params);
      },
      encodePaymentToken: function() {
        return toPaymentToken();
      },
      decodePaymentToken: function() {
        var paymentObject = toPaymentObject();
        paymentObject.optionalFields = params.optionalFields;
        return validatePayload(paymentObject)
          .then(convertNumberToNumber)
          .then(function(result) {
            return result;
          })
          .catch(function(err) {
            throw err;
          });
      },
    };
  };
}());
