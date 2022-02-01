/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import express from "express";
import path from "path";

/**
 * @param {string | express.Router | object} routes The route structure object.
 * @returns {express.Router}
 *
 * 1. `string` - Strings are interpreted as file paths. A `sendFile` route is
 * constructed from the path.
 * 2. `Router` - Other routers can be mounted to paths within the router.
 * 3. `object` - The primary focus of flat is the ability to construct route
 * maps from objects:
 *
 * ```js
 * app.use(flat({
 *     "/": "index.html",
 *     "/hello": {
 *         get: (req, res) => res.end("Hello World!"),
 *         post: function(req, res) {res.end("Hi")}
 *     }
 * }));
 * ```
 */
export default function flat(routes) {
  let router = express.Router();
  for (let [route, view] of Object.entries(routes)) {
    let handler = {};
    // console.log(`${route} (${typeof view}): ${view}`);
    switch (typeof view) {
      case "string":
        /**
         * Load a local file from disk and send it directly
         * Safety warning: dot files may be accessed, so don't use
         */
        handler["get"] = (route, (_, res) =>
          res.sendFile(path.join(path.resolve() + view), {
            dotfiles: "allow",
          }));
        console.log(path.join(path.resolve() + view));
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
      default:
        /**
         * We expect objects to be routemaps, and thus their keys will be added
         * to the handler
         */
        handler = Object.fromEntries(
          Object.entries(view).filter((e) =>
            [
              "get",
              "head",
              "post",
              "put",
              "delete",
              "connect",
              "options",
              "trace",
              "patch",
            ].includes(e[0])
          ),
        );
        console.log(handler);
    }
    /**
     * Formulate the handler into router functions
     */
    for (
      let method of [
        "get",
        "head",
        "post",
        "put",
        "delete",
        "connect",
        "options",
        "trace",
        "patch",
      ]
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
