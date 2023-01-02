import { Component } from 'react';
import AsyncApi, { ConfigInterface } from '@asyncapi/react-component';
import AP from './model/AP'

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
  version: number;
  contentId: string;
}

class Editor extends Component<{}, State> {
  getCustomData = async (): Promise<any> => {
    return new Promise<any>((reject, resolve) => {
      AP.dialog.getCustomData(resolve, reject);
    })
  };

  updateSchemaFn: (value: string) => void;
  updateConfigFn: (value: string) => void;
  saveConfig = () => {
    console.log('Save config.', this.state.config)
  }
  saveSchema = () => {
    console.log('Save schema.', this.state.schema)
  }

  saveAndClose = async () => {
    this.saveConfig();
    this.saveSchema();
    const contentId = this.state.contentId;

    const apiSchemaJson: any = yaml.load(this.state.schema);
    let localAp = AP;
    const context = await localAp.context.getContext();
    const jsonData = {
      "id": contentId,
      "type": "ac:my-api:async-api-doc",
      "space": {
        "key": context.confluence.space.key || "UNKNOWN"
      },
      "title": apiSchemaJson?.info?.title || 'Untitled',
      "body": {
        "raw": {
          "value": JSON.stringify({"code": this.state.schema, "config": this.state.config}),
          "representation": "raw"
        }
      },
      "version": {
        "number": this.state.version + 1
      }
    }
    if (!localAp) {
      console.log('AP not available. Existing...');
      return;
    }

    localAp.request({
      url: `/rest/api/content/${contentId}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(jsonData),
      success: function (asyncApi: any) {
        const response = JSON.parse(asyncApi);
        console.log('Async API doc successfully persisted to Confluence', response);
        console.log('Close dialog.')
        localAp.events.emitPublic('API_DOC_UPDATED', jsonData);
        localAp.dialog.close();
      }
    });
  }

  state = {
    schema: defaultSchema,
    config: defaultConfig,
    schemaFromExternalResource: '',
    refreshing: false,
    version: 1,
    contentId: '',
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

  async componentWillMount() {

    try {
      const customData = await this.getCustomData();
      console.log('customData', customData);
      this.setState({contentId: customData.contentId});
      // let query = queryString.parse(window.location.search);
      const contentId = this.state.contentId;
      if (!contentId) return;
      const that = this;
      // @ts-ignore
      const localAp = AP;
      localAp.request({
        url: `/rest/api/content/${contentId}`,
        data: {
          "expand": "body.raw,version"
        },
        success: function (response: any) {
          let parsedResponse = JSON.parse(response);
          const apiDoc = parsedResponse.body;

          if(apiDoc) {
            const value = JSON.parse(apiDoc.raw.value);
            that.updateSchemaFromExternalResource(value.schema || value.code);
            that.updateConfig(value.config);
            that.updateVersion(parsedResponse.version.number);
          }
          setTimeout(function () {
            localAp.resize();
            localAp.sizeToParent();
          }, 2000);
        }
      });
    } catch (e) {
      console.log('Error getting custom data', e);
    } finally {
      console.log('Finally');
    }
  }

  render() {
    const { schema, config, schemaFromExternalResource, version } = this.state;
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
                  <label>content version: {version}</label>
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
            <AsyncApi schema={schema} config={parsedConfig}/>
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

  private updateVersion = (version: number) => {
    this.setState({ version });
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

export default Editor;
