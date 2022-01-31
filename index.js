/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import express from "express";

/**
 * Flat creates a new Router object for use with express. It accepts:
 * 
 * 1. `string` - Strings are interpreted as file paths. A `sendFile` route is constructed from the path.
 * 2. `Router` - Other routers can be mounted to paths within the router.
 * 3. `object` - The objective of flat is to support route creation
 * 
 * @param {string | express.Router | object} routes The route structure object.
 * @returns {express.Router}
 */
export default function flat(routes) {

}