(function () {
  "use strict";
  var jwt = require("jwt-simple");
  var rp = require("request-promise");
  var InputDataValidator = require("./validators");
  var apiKey;
  var secret;
  var payment;
  var consumer;
  var delivery;
  var callbacks;
  var order;
  var paymentToken;
  var authenticationToken;
  var returningConsumer;
  var enriched;
  var extra;

  module.exports = function PayapiClient(params) {

    function print(key, value) {
      console.log(key + ":" + JSON.stringify(value, null, 2));
    }

    if(params) {
      this.apiKey = params.apiKey;
      this.secret = params.secret;
      this.payment = params.payment;
      this.consumer = params.consumer;
      this.products = params.products;
      this.order = params.order;
      this.callbacks = params.callbacks;
      this.authenticationToken = params.authenticationToken;
      this.paymentToken = params.paymentToken;
      this.enriched = params.enriched;
      this.returningConsumer = params.returningConsumer || false;
      this.extra = params.extra || {};
    }

    function toPaymentToken() {
      return jwt.encode(params.payload, params.apiKey, "HS512");
    }

    function toPaymentObject() {
      var jwtHeader64 = params.paymentToken.split(".")[0];
      var jwtHeader = JSON.parse(new Buffer(jwtHeader64, "base64").toString());
      var alg = jwtHeader.alg;
      if(alg === "HS512" ||
          alg === "HS384" ||
          alg === "HS256" ||
          alg === "RS256") {
        return jwt.decode(params.paymentToken, params.apiKey);
      } else {
        throw new Error("Only HS256, HS384, HS512 and RS256 algorithms are supported for JWT.");
      }
    }

    function validateApiKey(params) {
      return new Promise(function(resolve, reject) {
        if(!apiKey) {
          reject("apiKey must not be empty");
        } else {
          resolve(params);
        }
      });
    }

    // secret is unused in v1, but is here as a placeholder for v2
    function validateSecret(params) {
      return new Promise(function(resolve, reject) {
        if(!secret) {
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
          enriched: params.enriched,
          returningConsumer: params.returningConsumer || false,
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

    function convertIntegersToInteger(params) {
      return new Promise(function(resolve, reject) {
        for(var i = 0; i < params.payload.products; i++) {
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
      call: function(params) {
        if(params) {
          return doRestCall(params).catch(handleError);
        } else {
          return validateApiKey(params)
            .then(validateSecret)
            .then(validatePayload)
            .then(convertIntegersToInteger)
            .then(createToken)
            .then(doRestCall)
            .catch(handleError);
        }
      },
      paymentToken: function() {
        return validatePayload(params)
          .then(convertIntegersToInteger)
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
        return toPaymentObject();
      }
    };
  };
}());
