// This module provide an AP instance based on the context:
// 1. it returns window.AP if it is running on the confluence platform;
// 2. it returns a MockAp instance otherwise

import MockAp from "./MockAp";

// @ts-ignore
const providedAp = window.AP;
let onConfluence = providedAp && providedAp.confluence;
export default onConfluence ? providedAp : new MockAp();

function getUrlParam (param: string): string | null {
  let codeParams = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
  if(codeParams && codeParams.length >= 1) {
    const codedParam = codeParams[1];
    return decodeURIComponent(codedParam);
  }
  return null;
}

const versionParam = getUrlParam('version');
console.log('URL version parameter:', versionParam); // Debug the URL parameter
// @ts-ignore
export const hasMacroSupport = versionParam >= '2023.01';
console.log('hasMacroSupport calculated as:', hasMacroSupport); // Debug the final value