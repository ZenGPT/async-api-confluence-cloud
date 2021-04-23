import React, {useEffect, useState} from "react";
interface ApiDoc {
  value: string;
}
export default function Viewer() {
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
    AP.request({
      url: `/rest/api/content/${contentId}`,
      data: {
        "expand": "body.raw"
      },
      success: function (response: any) {
        const apiDoc = JSON.parse(response).body;
        console.log(apiDoc);
        setApiDoc(apiDoc)
      }
    });
  });

  return (
    <div>Viewing content: {JSON.stringify(apiDoc)}</div>
  )
}