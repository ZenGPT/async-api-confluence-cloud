import React, {useEffect, useState} from 'react';
import PureApiDocItem from "./PureApiDocItem";

interface ApiDocSummary {
  id: string;
  link: string;
  title: string;
}

export default function ApiDocItem(props: ApiDocSummary) {

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // @ts-ignore
    AP.navigator.go('contentview', {contentId: props.id});
  }
  const [apiDocSummary, setApiDocSummary] = useState<ApiDocSummary>({id: "", link: "", title: ""});
  useEffect(() => {
    // @ts-ignore
    AP.request({
      url: `/rest/api/content/${props.id}`,
      data: {
        "expand": "body.raw"
      },
      success: function (response: any) {
        const apiDoc = JSON.parse(response);
        console.log(apiDoc);
        setApiDocSummary({
          id: props.id,
          link: 'some link',
          title: apiDoc.title
        });
      }
    });

  }, []);
  return (
    <>
      <PureApiDocItem id={props.id} link="https://link.com" title={apiDocSummary.title} onClick={onClick} />
    </>
  )
}