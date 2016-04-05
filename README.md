# PayApi Client

A node.js client library for https://payapi.io/. Runtime depends on

* https://www.npmjs.com/package/request-promise
* https://www.npmjs.com/package/jwt-simple
* https://www.npmjs.com/package/validator

## Promise

The client uses Promises only.

## Quick PoC

package.json
```javascript
  "dependencies": {
    "request-promise": "^0.4.1",
    "jwt-simple": "^0.4.1",
  }
```

Execute
```javascript
npm i
```
### Generate browser validator

Execute
```javascript
browserify node_modules/payapi-client/lib/validators.js -o public/payapi.client.validator.js
```
