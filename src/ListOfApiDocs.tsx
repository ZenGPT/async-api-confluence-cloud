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
  const [apiDocsList, setApiDocsList] = useState<Array<ApiDocWrapper> >([]);

  async function loadApiDocList() {
    // @ts-ignore
    const localAp = AP;
    const context = await localAp.context.getContext();
    localAp.request({
      url: "/rest/api/content/",
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
      <section className="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg leading-6 font-medium text-black">Async API Documents</h2>
          <button
            className="hover:bg-light-blue-200 hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2">
            <svg className="group-hover:text-light-blue-600 text-light-blue-500 mr-2" width="12" height="20"
                 fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"/>
            </svg>
            New
          </button>
        </header>
        <form className="relative">
          <svg width="20" height="20" fill="currentColor"
               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
          </svg>
          <input
            className="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10"
            type="text" aria-label="Filter projects" placeholder="Filter projects"/>
        </form>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          <li className="hover:shadow-lg flex rounded-lg">
            <a href="/" onClick={createApiDoc}
               className="hover:border-transparent hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4">
              New Async API Doc
            </a>
          </li>
          {docs}
        </ul>
      </section>
    </>
  );
}