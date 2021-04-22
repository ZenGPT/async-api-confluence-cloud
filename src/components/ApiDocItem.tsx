import React from 'react';

interface ApiDocSummary {
  id: string;
  link: string;
}

export default function ApiDocItem(props: ApiDocSummary) {
  return (
    <>
      API Doc Item: id: {props.id}, link: {props.link}
      <div className="col-start-2 row-start-1 row-end-3">
        <dt className="sr-only">Users</dt>
        <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2">
          <img x-for="user in item.users" src="user.avatar" alt="user.name" width="48" height="48" className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white" />
      </dd>
    </div>
    </>
  )
}