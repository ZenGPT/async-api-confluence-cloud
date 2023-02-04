import {trackEvent} from "@/utils/window";
import AP from "@/model/AP";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";

function loadViewer(url: string) {
  const e = document.createElement('meta');
  e.setAttribute('http-equiv', 'refresh');
  e.setAttribute('content', `0;URL='${url}'`);
  const h = document.getElementsByTagName('head')[0];
  h && h.appendChild(e);
}

function getViewerUrl() {
  return '/confluence-plugin/asyncapi-viewer.html';
}

async function initializeMacro() {
  try {
    const contentProvider = defaultContentProvider(new ApWrapper2(AP));
    await contentProvider.load()
    
    const url = `${getViewerUrl()}${window.location.search}`;
    loadViewer(url);
    
  } catch (e) {
    console.error('Error on initializing macro:', e);
    trackEvent(JSON.stringify(e), 'load_macro', 'error');
  }
}

initializeMacro();