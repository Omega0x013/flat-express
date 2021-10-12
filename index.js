/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const r404 = (_, res) => res.sendStatus(404);

/**
 * Takes a set of routes and mounts them to your express app.
 * 
 * ```js
 * // HTTP method names (keys)
 * {get, head, post, put, delete, connect, options, trace, patch}
 * ```
 * 
 * @param {any} app
 * @param {any} routes Map of `[String | RegExp]: Object`. The properties of the object listed above are used as route handlers, duplicates are ignored.
 */
module.exports = function flat(app, routes) {
    // This has no safety checks on purpose
    for (let [path, view] of Object.entries(routes)) {
        app.route(path)
            .get(view['get'] || r404)
            .head(view['head'] || r404)
            .post(view['post'] || r404)
            .put(view['put'] || r404)
            .delete(view['delete'] || r404)
            .connect(view['connect'] || r404)
            .options(view['options'] || r404)
            .trace(view['trace'] || r404)
            .patch(view['patch'] || r404);
    }
}