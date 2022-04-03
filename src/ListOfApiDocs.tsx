import {useEffect, useState} from 'react';
import AP from './model/AP'
import ApiDocItem from './components/ApiDocItem';
interface ApiDocWrapper {
  _links: {
    self: string;
    webui: string;
  };
  id: string;
}
export default function ListOfApiDocs(this: any) {
  const [apiDocsList, setApiDocsList] = useState<Array<ApiDocWrapper> >([]);

  async function loadApiDocList() {
    const localAp = AP;
    const context = await localAp.context.getContext();
    localAp.request({
      url: "/rest/api/content/",
      type: "GET",
      data: {
        "type": 'ac:my-api:async-api-doc',
        "spaceKey": context.confluence.space.key,
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
  const docs = apiDocsList
    .sort((doc1, doc2) => Number(doc2.id) - Number(doc1.id))
    .map((doc) => {
    const selfUrl = new URL(doc._links.self);
    const apiDocDisplayUrl = `${selfUrl.protocol}//${selfUrl.host}/wiki${doc._links.webui}`
    return (
      <li key={doc.id}>
        <ApiDocItem id={doc.id} link={apiDocDisplayUrl} description={''} title={'Untitled'} version={'Unknown'}/>
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
      <section className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <header className="flex items-center justify-between">
          <h2 className="text-lg leading-6 font-medium text-black">Async API Documents</h2>
          <button onClick={createApiDoc}
            className="hover:bg-light-blue-200 hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2">
            <svg className="group-hover:text-light-blue-600 text-light-blue-500 mr-2" width="12" height="20"
                 fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"/>
            </svg>
            New
          </button>
        </header>
        <ul className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8 bg-gray-100 p-8">
          <li className="hover:shadow-lg flex rounded-lg bg-white">
            <a href="/" onClick={createApiDoc}
               className="hover:border-transparent hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4">
              + New Async API Doc
            </a>
          </li>
          {docs}
        </ul>
      </section>
    </>
  );
}