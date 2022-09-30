# flat-express

Flat express is a route definition function that turns a JS object into an `express.Router`.

## Usage

```js
let router = flat({
  "/":
    "index.html",           // You can statically serve a file using a filename

  "/hello": (req, res) =>   // Or you could bind just the GET route for a path
    res.end("Hello World!"),// by using a function.

  "/greet": {               // And finally you could bind a whole set of
    "GET": (req, res) =>    // methods to a single route, by placing them into
      res.end("Greetings"), // an object. 
    "POST": /* example */   // In an object like this one, each value must be
    "DELETE": /* example */ // a function.
  }
})
```