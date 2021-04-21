import React, {useEffect, useState} from 'react';

export default function ListOfApiDocs() {
  const [apiDocsList, setApiDocsList] = useState('empty');

  useEffect(() => {
    console.log('use effect');
    // @ts-ignore
    AP.request({

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
      },
      error: function (err: any) {
        console.log("err - ", err)
      }
    })
  }, []);
  return (
    <div>List of API Docs: {JSON.stringify(apiDocsList)}</div>
  );
}