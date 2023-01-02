import * as functions from "firebase-functions";
import * as descriptorTemplate from "./atlassian-connect.json";

export const descriptor = functions.https.onRequest((req, resp) => {
  const url = req.url;
  const basePath = url.substring(0, url.lastIndexOf("/"));
  const self = url.substring(url.lastIndexOf("/"));
  const result = Object.assign({},
      descriptorTemplate,
      {
        baseUrl: `${req.protocol}://${req.hostname}${basePath}`,
        links: {
          self: self,
        },
      });
  resp.json(result);
});

export const renderAttachment = functions.https.onRequest((request, response) => {
  response.send(`<ac:image> <ri:attachment ri:filename="zenuml-${request.query.uuid}.png" /> </ac:image>`);
});