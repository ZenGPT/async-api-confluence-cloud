import React from "react";

export default function Viewer() {
  function getUrlParam (param: string) {
    let regExp = new RegExp(`${param}=([^&]*)`);
    let matches = regExp.exec(window.location.search);
    if (matches && matches.length > 0) {
      const codedParam = regExp && matches[1];
      return decodeURIComponent(codedParam);
    }
    return ''
  }

  return (
    <div>Viewing content: {getUrlParam('contentId')}</div>
  )
}