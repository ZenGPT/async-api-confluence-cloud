"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstalled = exports.installed = exports.renderAttachment = exports.descriptor = void 0;
const functions = require("firebase-functions");
const descriptorTemplate = require("./atlassian-connect.json");
var Mixpanel = require('mixpanel');
//Mixpanel project: Confluence Analytics
var mixpanel = Mixpanel.init('0c62cea9ed2247f4824bf196f6817941');
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
function handleLifecycleEvent(req) {
    if (!req.body) {
        return;
    }
    const clientSite = new URL(req.body.baseUrl).hostname;
    mixpanel.track(req.body.eventType, {
        distinct_id: clientSite,
        clientSite,
        key: req.body.key,
        eventType: req.body.eventType,
        serverVersion: req.body.serverVersion,
        pluginVersion: req.body.pluginsVersion,
        productType: req.body.productType,
        description: req.body.description,
        displayProductName: 'Async API'
    });
}
exports.installed = functions.https.onRequest((req, resp) => {
    /* example request.body:
     {
      key: 'my-api',
      clientKey: 'aa4a743a-201f-38c4-b7fd-d7f8f68ec685',
      publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+75i7nBJb4J46KQigYauY3FRM2QyMoVb/YmiygAnmH7aj4mz1iAVUVh/wRyvMtA/Aq1bROtM2Pfu23bM/Z4hDJtC+53OMf/DVTILkSpN8AF6QRO0DcvjPFHDeKhcgQgtYh4q/tjLu38nmKe6yjzILk5TxGlCc/V9w5NO5fHs0oQIDAQAB',
      sharedSecret: 'ATCOfzFTe2Wc3Rh3FRV2h9CUlZCBRpUhIF5LXKDgv1Ru17afsZ4_fPQRqx1PZd21mBMIM0RDjU-uZPxMegaUfwRR_A0678FE89',
      serverVersion: '6452',
      pluginsVersion: '1000.0.0.57d9ee1272a4',
      baseUrl: 'https://whimet4.atlassian.net/wiki',
      productType: 'confluence',
      description: 'Atlassian Confluence at null',
      eventType: 'installed'
    }
    */
    handleLifecycleEvent(req);
    resp.send(`installed`);
});
exports.uninstalled = functions.https.onRequest((req, resp) => {
    /** example request.body:
    {
      key: 'my-api',
      clientKey: 'aa4a743a-201f-38c4-b7fd-d7f8f68ec685',
      publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+75i7nBJb4J46KQigYauY3FRM2QyMoVb/YmiygAnmH7aj4mz1iAVUVh/wRyvMtA/Aq1bROtM2Pfu23bM/Z4hDJtC+53OMf/DVTILkSpN8AF6QRO0DcvjPFHDeKhcgQgtYh4q/tjLu38nmKe6yjzILk5TxGlCc/V9w5NO5fHs0oQIDAQAB',
      serverVersion: '6452',
      pluginsVersion: '1000.0.0.57d9ee1272a4',
      baseUrl: 'https://whimet4.atlassian.net/wiki',
      productType: 'confluence',
      description: 'Atlassian Confluence at null',
      eventType: 'uninstalled'
    }
     */
    handleLifecycleEvent(req);
    resp.send(`uninstalled`);
});
//# sourceMappingURL=index.js.map