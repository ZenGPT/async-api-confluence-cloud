import {useEffect} from "react";
import AP from './model/AP'
import {uuidv4} from "./common/helpers";
import ViewerHeader from "./components/ViewerHeader";

export default function Viewer() {

  function getUrlParam (param: string) {
    let regExp = new RegExp(`${param}=([^&]*)`);
    let matches = regExp.exec(window.location.search);
    if (matches && matches.length > 0) {
      const codedParam = regExp && matches[1];
      return decodeURIComponent(codedParam);
    }
    return ''
  }

  useEffect(() => {
    function loadContent() {
      const contentId = getUrlParam('contentId');
      const localAp = AP;
      localAp.request({
        url: `/rest/api/content/${contentId}`,
        data: {
          "expand": "body.raw"
        },
        success: function (response: any) {
          const apiDoc = JSON.parse(response).body;
          
          const sessionStorageKey = `asyncapi-viewer-${uuidv4()}`;
          //TODO: clean sessionStorage
          sessionStorage[sessionStorageKey] = JSON.parse(apiDoc.raw.value).code;
          console.debug(`Viewer - set sessionStorage[${sessionStorageKey}]=`, sessionStorage[sessionStorageKey]);

          const e = document.getElementById('mainFrame');
          if(e) {
            // @ts-ignore
            e.src = `/asyncapi-viewer/index.html?sessionStorageKey=${sessionStorageKey}`;
          }

          setTimeout(function () {
            localAp.resize();
            localAp.sizeToParent();
          }, 2000);
        }
      });
    }

    loadContent();
    // @ts-ignore
    const localAp = AP;
    localAp.events.onPublic('API_DOC_UPDATED', loadContent);

  }, []);

  function iframeLoaded() {
    const frame = document.getElementById('mainFrame');
    if(frame) {
      // @ts-ignore
      frame.height = frame.contentWindow.document.body.scrollHeight + "px";
      AP.resize();
    }
  }

  function getContent() {
    return (
      <>
        <ViewerHeader/>
        
        <iframe id="mainFrame" title="mainFrame" width="100%" height="100%" onLoad={iframeLoaded}></iframe>
      </>
    );
  }
  return (
    <div>
      {getContent()}
    </div>
  )
}