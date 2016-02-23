(function () {
  "use strict";
  var jwt = require("jwt-simple");
  var rp = require("request-promise");
  var apiKey;
  var secret;
  var payment;
  var consumer;
  var delivery;
  var callbacks;
  var order;
  var paymentToken;
  var authenticationToken;

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

    function validateSecret(params) {
      return new Promise(function(resolve, reject) {
        if(!secret) {
          reject("secret must not be empty");
        } else {
          resolve(params);
        }
      });
    }

    function validateInputData(params) {
      return new Promise(function(resolve, reject) {
        var validationErrors = new InputDataValidator(params).validate();
        if(validationErrors.length > 0) {
          reject(validationErrors);
        } else {
          resolve(params);
        }
      });
    }

    function validateOrCreateToken(params) {
      return new Promise(function(resolve, reject) {
        if(!params.paymentToken) {
          var payload = {
            payment: params.payment,
            consumer: params.consumer,
            order: params.order,
            products: params.products,
            callbacks: params.callbacks
          };
          params.paymentToken = jwt.encode(payload, params.secret, "HS512");
        }
        resolve(params);
      });
    }

    function doRestCall(params) {
      return new Promise(function(resolve, reject) {
        console.log("doRestCall");
        print("authenticationToken", params.authenticationToken);
        print("paymentToken", params.paymentToken);
        var uri;
        switch(process.env.NODE_ENV) {
          case "production":
            uri = "http://input.payapi.io/v1/api/authorized/payments";
            break;
          case "staging":
            uri = "http://staging-input.payapi.io/v1/api/authorized/payments";
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
        reject(err);
      });
    }

    return {
      call: function(params) {
        if(params) {
          return doRestCall(params).catch(handleError);
        } else {
          return validateApiKey(params)
            .then(validateSecret)
            .then(validateInputData)
            .then(validateOrCreateToken)
            .then(doRestCall)
            .catch(handleError);
        }
      },
      paymentToken: function() {
        return validateOrCreateToken(params)
          .then(function(params) {
            return new Promise(function(resolve, reject) {
              resolve(params.paymentToken);
            });
          })
          .catch(function(err) {
            throw err;
          });
      }
    };
  };
}());
