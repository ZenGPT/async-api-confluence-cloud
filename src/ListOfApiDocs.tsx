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

  function loadApiDocList() {
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
    });
  }

// Load list of API Docs
  useEffect(() => {
    console.log('use effect');
    // @ts-ignore
    const localAp = AP;
    loadApiDocList();
    localAp.events.onPublic('API_DOC_CREATED', loadApiDocList);
  }, []);
  const docs = apiDocsList.map((doc) => {
    const selfUrl = new URL(doc._links.self);
    const apiDocDisplayUrl = `${selfUrl.protocol}//${selfUrl.host}/wiki${doc._links.webui}`
    return (
      <li key={doc.id}>
        <ApiDocItem id={doc.id} link={apiDocDisplayUrl} title={'Untitled'}/>
      </li>
    )
  });

  function createApiDoc() {
    // @ts-ignore
    AP.dialog.create({
      key: 'newApiDoc',
      chrome: false
    });
  }

  return (
    <>
      <div>List of API Docs:</div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        <li className="hover:shadow-lg flex rounded-lg">
          <a href="/" onClick={createApiDoc}
             className="hover:border-transparent hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4">
            New Async API Doc
          </a>
        </li>
        {docs}
      </ul>
    </>
  );
}