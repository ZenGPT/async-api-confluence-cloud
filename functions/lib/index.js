"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAttachment = exports.descriptor = void 0;
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
exports.renderAttachment = functions.https.onRequest((request, response) => {
    response.send(`<ac:image> <ri:attachment ri:filename="zenuml-${request.query.uuid}.png" /> </ac:image>`);
});
//# sourceMappingURL=index.js.map