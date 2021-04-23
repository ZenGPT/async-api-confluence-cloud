import React, {useEffect, useState} from 'react';

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
  const [apiDocSumary, setApiDocSummary] = useState<ApiDocSummary>({id: "", link: "", title: ""});
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
      <a href="/" onClick={onClick}
         className="hover:bg-light-blue-500 hover:border-transparent hover:shadow-lg group block rounded-lg p-4 border border-gray-200">
        <dl className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
          <div>
            <dt className="sr-only">Title</dt>
            <dd className="group-hover:text-white leading-6 font-medium text-black">
              Title {apiDocSumary.title}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Category</dt>
            <dd className="group-hover:text-light-blue-200 text-sm font-medium sm:mb-4 lg:mb-0 xl:mb-4">
              category
            </dd>
          </div>
          <div className="col-start-2 row-start-1 row-end-3">
            <dt className="sr-only">Users</dt>
            <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2">
              image
            </dd>
          </div>
        </dl>
      </a>
    </>
  )
}