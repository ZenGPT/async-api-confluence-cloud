import React from "react";
import ReactDOM from "react-dom";
import AsyncApiComponent from "@asyncapi/react-component";
import "@asyncapi/react-component/lib/styles/fiori.css";
import * as htmlToImage from 'html-to-image';
import "./styles.css";

const urlParams = new URLSearchParams(window.location.search);
const sessionStorageKey = urlParams.get('sessionStorageKey');
const data = sessionStorageKey && sessionStorage[sessionStorageKey] || localStorage.document;

const rootElement = document.getElementById("root");
const config = {
  expand: {
    channels: {
      root: true,
      elements: true,
    },
    servers: {
      root: true,
      elements: true,
    },
    messages: {
      root: true,
      elements: true,
    },
    schemas: {
      root: true,
      elements: true,
    },
  }
};

function render(schema, _config) {
  ReactDOM.render(<AsyncApiComponent schema={schema} config={_config} />, rootElement);
}

if(data) {
  render(data, config);
}

window.toPng = () => {
  const root = rootElement || document.body;
  return htmlToImage.toBlob(root, { bgcolor: 'white' });
}

window.addEventListener('message', async ({ source, data }) => {
  if (source.location.href === window.location.href) {
    return;
  }
  if (data?.action === 'load') {
    console.debug('loading data:\n', data?.data);
    render(data?.data, config);
  }
  else if (data?.action === 'export') {
    const data = await window.toPng();
    source.postMessage({ action: 'export.result', data });
    console.debug('asyncapi-viewer - PNG exported');
  }
})