# flat-express

Literally as little extra code as I could manage, offers a basic route creation solution. Any method you don't set will be filled by a `405 - METHOD NOT ALLOWED`

```
npm install git+https://github.com/Omega0x013/flat-express.git
```

---

```js
// example.js

const app = require('express')();
const flat = require('@omega0x013/flat-express');
const example = require(/* example */);
const example2 = require(/* example2 */);

flat(app, { // you can mix and match methods
    "/": {
        get: (req, res) => res.end("Hello World"),
        post: (req, res) => example
    },
    "/home": {
        post: (req, res) => res.end("<h1>Home!</h1>")
    },
    "/2": example2, // this exports matching methods
    "/err": {} // leave it empty and everything will be a 405 (method not allowed)
});
```
