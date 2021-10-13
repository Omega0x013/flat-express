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
 * @param {any} routes Map of `[String | RegExp]: Object`. The properties of the object listed above are used as route handlers, duplicates are ignored.
 * @returns {Router} Router object
*/
export default function flat(routes) {
    // This has no safety checks on purpose
    let router = require('express').Router();
    for (let [path, view] of Object.entries(routes)) {
        router.get      (path, view['get']      || r405);
        router.head     (path, view['head']     || r405);
        router.post     (path, view['post']     || r405);
        router.put      (path, view['put']      || r405);
        router.delete   (path, view['delete']   || r405);
        router.connect  (path, view['connect']  || r405);
        router.options  (path, view['options']  || r405);
        router.trace    (path, view['trace']    || r405);
        router.patch    (path, view['patch']    || r405);
    }
    return router;
}