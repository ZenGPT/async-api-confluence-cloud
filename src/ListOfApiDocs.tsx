import {useEffect, useState} from 'react';
import AP from './model/AP'
import ApiDocItem from './components/ApiDocItem';
import {PlusIcon, RefreshIcon} from "@heroicons/react/solid";
// interface ApiDocWrapper {
//   _links: {
//     self: string;
//     webui: string;
//   };
//   id: string;
// }
export default function ListOfApiDocs(this: any) {
  const [apiDocsList, setApiDocsList] = useState([]);
  const [docs, setDocs] = useState< Array<JSX.Element> >();
  async function loadApiDocList() {
    const localAp = AP;
    const context = await localAp.context.getContext();
    localAp.request({
      url: "/rest/api/content/",
      type: "GET",
      data: {
        "type": 'ac:my-api:async-api-doc',
        "spaceKey": context.confluence.space.key,
        "expand": "version"
      },
      success: function (response: any) {
        let apiDocs = JSON.parse(response).results;
        setApiDocsList(apiDocs);
        setTimeout(localAp.resize, 1000);
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
    localAp.events.onPublic('API_DOC_UPDATED', loadApiDocList);
  }, []);

  useEffect(() => {
    setDocs(apiDocsList
      .sort((doc1: any, doc2: any) => Number(doc2.id) - Number(doc1.id))
      .map((doc: any) => {
        return (
          <li key={doc.id}>
            <ApiDocItem id={doc.id} description={''} title={doc.title} version={doc.version?.number}/>
          </li>
        )
      }))
  }, [apiDocsList]);

  function createApiDoc() {
    // @ts-ignore
    AP.dialog.create({
      key: 'editApiDoc',
      chrome: false
    });
  }

  return (
    <>
      <section className="max-w-2xl mx-auto py-8 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
        <header className="flex items-center justify-between">
          <h2 className="text-lg leading-6 font-medium text-black">Async API Documents</h2>
          <div className="flex">
          <button onClick={loadApiDocList}
            className="hover:bg-blue-200 hover:text-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2"
          >
            <RefreshIcon className="w-5 h-5" />
            Reload
          </button>
          <button onClick={createApiDoc}
            className="hover:bg-blue-200 hover:text-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2">
            <PlusIcon className="w-5 h-5" aria-hidden="true"/>
            New
          </button>
          </div>
        </header>
        <ul className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8 bg-gray-100 p-8">
          <li className="hover:shadow-lg flex rounded-lg bg-white">
            <a href="/" onClick={createApiDoc}
               className="hover:border-transparent hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4 text-blue-600">
              <PlusIcon className="w-5 h-5" aria-hidden="true"/> New Async API Doc
            </a>
          </li>
          {docs}
        </ul>
      </section>
    </>
  );
}