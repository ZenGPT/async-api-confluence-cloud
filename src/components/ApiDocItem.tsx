import React from 'react';

interface ApiDocSummary {
  id: string;
  link: string;
}

export default function ApiDocItem(props: ApiDocSummary) {

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // @ts-ignore
    AP.navigator.go('contentview', {contentId: props.id});
  }

  return (
    <>
      <a href="/" onClick={onClick}
         className="hover:bg-light-blue-500 hover:border-transparent hover:shadow-lg group block rounded-lg p-4 border border-gray-200">
        <dl className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
          <div>
            <dt className="sr-only">Title {props.id}</dt>
            <dd className="group-hover:text-white leading-6 font-medium text-black">
              Title
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