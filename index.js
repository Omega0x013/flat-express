/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import express from "express";
import pathm from "path"; // path-module

/**
 * Takes a set of routes and produces an express Router object.
 *
 * ```js
 * // HTTP method names (keys)
 * {get, head, post, put, delete, connect, options, trace, patch}
 * ```
 *
 * @param routes Map of `[String]: [Object | String]`. The properties of
   the object listed above are used as route handlers, duplicates are ignored.
   A string may be used which creates a GET that reads from a path.
 * @returns {Router} Router object
*/

export default function flat(routes) {
  let router = express.Router();
  for (let [path, view] of Object.entries(routes)) {
    if (typeof view === "String") {
      router.get((_, res) => res.sendFile(pathm.join(pathm.resolve() + view)));
    } else {
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
          this,
          view[method] || ((_, res) => res.sendStatus(405)),
        );
      }
    }
  }
  return router;
}
