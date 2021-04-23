import React, {useEffect, useState} from 'react';
import ApiDocItem from './components/ApiDocItem';
interface ApiDocWrapper {
  _links: {
    self: string;
    webui: string;
  };
  id: string;
}
export default function ListOfApiDocs(this: any) {
  const [apiDocsList, setApiDocsList] = useState<Array<ApiDocWrapper> >([{
    id: "1234",
    _links: {
      webui: "a web link",
      self: "https://zenuml-stg.atlassian.net"
    }
  }]);

  useEffect(() => {
    console.log('use effect');
    // @ts-ignore
    const localAp = AP;
    localAp.request({

      url: "/rest/api/content/",
      data: {
        "type": 'ac:my-api:async-api-doc',
        "spaceKey": "ZS",
        "expand": "children"
      },
      success: function (response: any) {
        let customers = JSON.parse(response).results;
        console.log(customers);
        setApiDocsList(customers);
        localAp.resize();
      },
      error: function (err: any) {
        console.log("err - ", err)
      }
    })
  }, []);
  const docs = apiDocsList.map((doc) => {
    const selfUrl = new URL(doc._links.self);
    const apiDocDisplayUrl = `${selfUrl.protocol}//${selfUrl.host}/wiki${doc._links.webui}`
    return (
      <li key={doc.id}>
        <ApiDocItem id={doc.id} link={apiDocDisplayUrl}/>
      </li>
    )
  });
  return (
    <>
      <div>List of API Docs:</div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      {docs}
      </ul>
    </>
  );
}