/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const r405 = (_, res) => res.sendStatus(405);

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
            .get(view['get'] || r405)
            .head(view['head'] || r405)
            .post(view['post'] || r405)
            .put(view['put'] || r405)
            .delete(view['delete'] || r405)
            .connect(view['connect'] || r405)
            .options(view['options'] || r405)
            .trace(view['trace'] || r405)
            .patch(view['patch'] || r405);
    }
}