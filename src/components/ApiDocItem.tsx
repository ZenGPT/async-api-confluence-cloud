import React, {useEffect, useState} from 'react';

import PureApiDocItem from "./PureApiDocItem";
import yaml from "js-yaml";

interface ApiDocSummary {
  id: string;
  description: string;
  title: string;
  version: string;
}

export default function ApiDocItem(props: ApiDocSummary) {

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // @ts-ignore
    AP.navigator.go('contentview', {contentId: props.id});
  }
  const [apiDocSummary, setApiDocSummary] = useState<ApiDocSummary>({id: "", description: "", title: "", version: ""});
  useEffect(() => {
    // @ts-ignore
    AP.request({
      url: `/rest/api/content/${props.id}`,
      data: {
        "expand": "body.raw"
      },
      success: function (response: any) {
        const apiDoc = JSON.parse(response);
        const apiDocContent = JSON.parse(apiDoc.body.raw.value);
        const schema: any = yaml.load(apiDocContent.code || apiDocContent.schema);

        setApiDocSummary({
          id: props.id,
          description: schema?.info?.description,
          title: apiDoc.title,
          version: schema?.info?.version
        });
      }
    });
  }, [props.id, props.version]);
  return (
    <>
      <PureApiDocItem id={props.id} description={apiDocSummary.description} title={props.title} version={props.version} onClick={onClick} />
    </>
  )
}