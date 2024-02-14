import * as htmlToImage from 'html-to-image';
import "./styles.css";

window.toPng = () => {
  const root = window.rootElement || document.body;
  return htmlToImage.toBlob(root, { bgcolor: 'white' });
}

window.addEventListener('message', async ({ source, data }) => {
  if (data?.action === 'load') {
    console.debug('loading data:\n', data?.data);
    render(data?.data);
  }
  else if (data?.action === 'export') {
    const data = await window.toPng();
    source.postMessage({ action: 'export.result', data });
    console.debug('asyncapi-viewer - PNG exported');
  }
})