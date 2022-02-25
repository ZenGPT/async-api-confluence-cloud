"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptor = void 0;
const functions = require("firebase-functions");
const descriptorTemplate = require("./atlassian-connect.json");
exports.descriptor = functions.https.onRequest((req, resp) => {
    const url = req.url;
    const basePath = url.substring(0, url.lastIndexOf("/"));
    const self = url.substring(url.lastIndexOf("/"));
    const result = Object.assign({}, descriptorTemplate, {
        baseUrl: `${req.protocol}://${req.hostname}${basePath}`,
        links: {
            self: self,
        },
    });
    resp.json(result);
});
//# sourceMappingURL=index.js.map