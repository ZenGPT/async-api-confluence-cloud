import Vue from 'vue'
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton.vue";
// @ts-ignore
import './assets/tailwind.css'

import globals from '@/model/globals';
import AP from "@/model/AP";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import { DiagramType } from "@/model/Diagram/Diagram";
import { saveToPlatform } from "@/model/ContentProvider/Persistence";
import ApWrapper2 from "@/model/ApWrapper2";
import './utils/IgnoreEsc.ts'
import yaml from 'js-yaml';
import {example} from './utils/asyncapi-example';

const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));

new Vue({
  render: h => h(SaveAndGoBackButton, {
    props: {
      saveAndExit: async () => {
        const code = localStorage.document || example;
        const apiSchemaJson: any = yaml.load(code);
        // @ts-ignore
        window.diagram = Object.assign(window.diagram || {}, 
          { diagramType: DiagramType.AsyncApi, code });
        
          // @ts-ignore
        window.diagram.title = apiSchemaJson?.info?.title;

        // @ts-ignore
        await saveToPlatform(window.diagram);
        AP.events.emitPublic('API_DOC_UPDATED');
        AP.dialog.close();
      }
    }
  })
}).$mount('#save-and-go-back');

function loadMainFrame(data: string) {
  const e = document.getElementById('mainFrame');
  if (e) {
    localStorage.document = data;
    // @ts-ignore
    e.src = `/asyncapi-studio/index.html`;
  }
}

async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  const { doc } = await compositeContentProvider.load();

  // @ts-ignore
  window.diagram = doc;

  //backwards compatible with old data model in Async API plugin
  // @ts-ignore
  if(doc.schema) {
    // @ts-ignore
    doc.code = doc.schema;
    // @ts-ignore
    delete doc.schema;
  }

  // @ts-ignore
  loadMainFrame(doc.code);

}

initializeMacro();