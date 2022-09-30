/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import express from "express";
import path from "path";

const METHODS = [
  "get",
  "head",
  "post",
  "put",
  "delete",
  "connect",
  "options",
  "trace",
  "patch",
];

/**
 * @param {object} routes The route structure object.
 * @returns {express.Router}
 *
 * 1. `string` - Strings are interpreted as file paths. A `sendFile` route is
 * constructed from the path.
 * 2. `Router` - Other routers can be mounted to paths within the router.
 * 3. `object` - The primary focus of flat is the ability to construct route
 * maps from objects:
 *
 * ```js
 * let router = flat({
 * "/":
 *   "index.html",           // You can statically serve a file using a filename
 *
 * "/hello": (req, res) =>   // Or you could bind just the GET route for a path
 *   res.end("Hello World!"),// by using a function.
 *
 * "/greet": {               // And finally you could bind a whole set of
 *   "GET": (req, res) =>    // methods to a single route, by placing them into
 *     res.end("Greetings"), // an object. 
 *   "POST": ...             // In an object like this one, each value must be
 *   "DELETE": ...           // a function.
 * }
 * })
 * ```
 */
export default function flat(routes) {
  let router = express.Router();
  for (let [route, view] of Object.entries(routes)) {
    let handler = {};
    switch (typeof view) {
      case "string":
        /**
         * Load a local file from disk and send it directly
         * Safety warning: dot files may be accessed, so don't expose
         */
        handler["get"] = (route, (_, res) =>
          res.sendFile(path.join(path.resolve() + view), {
            dotfiles: "allow",
          }));
        break;
      case "function":
        /**
         * If it is a router, mount it
         * If it is just a function, make it the GET route
         */
        if (view.__proto__ == router.__proto__) {
          router.use(route, view);
          continue;
        } else {
          handler["get"] = view;
        }
        break;
      case "object":
        /**
         * We expect objects to be routemaps, and thus their keys will be added
         * to the handler
         */
        handler = Object.fromEntries(
          Object.entries(view).filter((e) =>
            METHODS.includes(e[0])
          ),
        );
      default:
        console.error(`Flat-Express: Invalid view datatype found in route '${route}'`);
    }
    /**
     * Formulate the handler into router functions
     */
    for (
      let method of METHODS
    ) {
      router[method]?.call(
        router,
        route,
        handler[method] ?? ((_, res) =>
          res.sendStatus(405)),
      );
    }
  }
  return router;
}
