import React from 'react';

interface ApiDocSummary {
  id: string;
  link: string;
}

export default function ApiDocItem(props: ApiDocSummary) {
  return (
    <>
      API Doc Item: id: {props.id}, link: {props.link}
    </>
  )
}