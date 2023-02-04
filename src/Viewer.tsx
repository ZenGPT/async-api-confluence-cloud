import {useEffect, useState} from "react";
import AsyncApi from "@asyncapi/react-component";
import AP from './model/AP'
import {AsyncApiWrapper} from "./components";
import ViewerHeader from "./components/ViewerHeader";
interface ApiDoc {
  raw: {
    value: string;
  }
}
export default function Viewer() {
  const [loaded, setLoaded] = useState(false);
  const [apiDoc, setApiDoc] = useState<ApiDoc>();

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
          setApiDoc(apiDoc);
          setLoaded(true);
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
  function getContent() {
    if(loaded && apiDoc) {
      const value = JSON.parse(apiDoc.raw.value);
      return (
        <>
          <ViewerHeader/>
          <AsyncApiWrapper>
            <AsyncApi schema={value.code || value.schema} config={value.config}/>
          </AsyncApiWrapper>
        </>
      );
    } else {
      return "Loading";
    }

  }
  return (
    <div>
      {getContent()}
    </div>
  )
}