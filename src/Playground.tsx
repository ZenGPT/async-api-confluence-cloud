import React, { Component } from 'react';
import AsyncApi, { ConfigInterface } from '@asyncapi/react-component';

import {
  Navigation,
  CodeEditorComponent,
  FetchSchema,
  RefreshIcon,
  Tabs,
  Tab,
  PlaygroundWrapper,
  CodeEditorsWrapper,
  AsyncApiWrapper,
  SplitWrapper,
} from './components';

import { defaultConfig, parse, debounce } from './common';
import yaml from 'js-yaml';
import * as specs from './specs';

const defaultSchema = specs.streetlights;

interface State {
  schema: string;
  config: string;
  schemaFromExternalResource: string;
  refreshing: boolean;
}

class Playground extends Component<{}, State> {
  updateSchemaFn: (value: string) => void;
  updateConfigFn: (value: string) => void;
  saveConfig = () => {
    console.log('Save config.', this.state.config)
  }
  saveSchema = () => {
    console.log('Save schema.', this.state.schema)
  }

  saveAndClose = () => {
    this.saveConfig();
    this.saveSchema();
    const apiSchemaJson: any = yaml.load(this.state.schema);
    console.log('!!!!!!api schema doc', apiSchemaJson);
    const jsonData = {
      "type": "ac:my-api:async-api-doc",
      "space": {
        "key": "ZS"
      },
      "title": apiSchemaJson?.info?.title || 'Untitled',
      "body": {
        "raw": {
          "value": JSON.stringify({"schema": this.state.schema, "config": this.state.config}),
          "representation": "raw"
        }
      }
    }
    // @ts-ignore
    let localAp = AP;
    if(!localAp) {
      console.log('AP not available. Existing...');
      return;
    }

    localAp.request({
      url: '/rest/api/content',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(jsonData),
      success: function (asyncApi: any) {
        const response = JSON.parse(asyncApi);
        console.log('Async API doc successfully persisted to Confluence', response);
        console.log('Close dialog.')
        localAp.events.emitPublic('API_DOC_CREATED', jsonData);
        localAp.dialog.close();
      }
    });
  }

  state = {
    schema: defaultSchema,
    config: defaultConfig,
    schemaFromExternalResource: '',
    refreshing: false,
  };

  constructor(props: any) {
    super(props);
    this.updateSchemaFn = debounce(
      this.updateSchema,
      750,
      this.startRefreshing,
      this.stopRefreshing,
    );
    this.updateConfigFn = debounce(
      this.updateConfig,
      750,
      this.startRefreshing,
      this.stopRefreshing,
    );
  }

  render() {
    const { schema, config, schemaFromExternalResource } = this.state;
    const parsedConfig = parse<ConfigInterface>(config || defaultConfig);

    return (
      <PlaygroundWrapper>
        <Navigation saveAndClose={this.saveAndClose}/>
        <SplitWrapper>
          <CodeEditorsWrapper>
            <Tabs
              additionalHeaderContent={this.renderAdditionalHeaderContent()}
            >
              <Tab title="Schema" key="Schema">
                <>
                  <FetchSchema
                    parentCallback={this.updateSchemaFromExternalResource}
                  />
                  <CodeEditorComponent
                    key="Schema"
                    code={schema}
                    externalResource={schemaFromExternalResource}
                    parentCallback={this.updateSchemaFn}
                    mode="text/yaml"
                  />
                </>
              </Tab>
              <Tab title="Configuration" key="Configuration">
                <CodeEditorComponent
                  key="Configuration"
                  code={config}
                  parentCallback={this.updateConfigFn}
                />
              </Tab>
            </Tabs>
          </CodeEditorsWrapper>
          <AsyncApiWrapper>
            <AsyncApi schema={schema} config={parsedConfig} />
          </AsyncApiWrapper>
        </SplitWrapper>
      </PlaygroundWrapper>
    );
  }

  private updateSchema = (schema: string) => {
    this.setState({ schema });
  };

  private updateSchemaFromExternalResource = (schema: string) => {
    this.setState({ schemaFromExternalResource: schema });
  };

  private updateConfig = (config: string) => {
    this.setState({ config });
  };

  private startRefreshing = (): void => {
    setTimeout(() => {
      this.setState({ refreshing: true });
    }, 500);
  };

  private stopRefreshing = (): void => {
    this.setState({ refreshing: false });
  };

  private renderAdditionalHeaderContent = () => (
    <RefreshIcon show={this.state.refreshing}>{'\uE00A'}</RefreshIcon>
  );
}

export default Playground;
