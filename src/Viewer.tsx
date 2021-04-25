import React, {useEffect, useState} from "react";
import AsyncApi from "@asyncapi/react-component";
import {AsyncApiWrapper} from "./components";
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
    const contentId = getUrlParam('contentId');
    // @ts-ignore
    const localAp = AP;
    localAp.request({
      url: `/rest/api/content/${contentId}`,
      data: {
        "expand": "body.raw"
      },
      success: function (response: any) {
        const apiDoc = JSON.parse(response).body;
        console.log(apiDoc);
        setApiDoc(apiDoc);
        setLoaded(true);
        setTimeout(function () {
          localAp.resize();
          localAp.sizeToParent();
        }, 2000);
      }
    });
  }, []);
  function getContent() {
    if(loaded && apiDoc) {
      const value = JSON.parse(apiDoc.raw.value);
      return (
        <AsyncApiWrapper>
          <AsyncApi schema={value.schema} config={value.schema}/>
        </AsyncApiWrapper>
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