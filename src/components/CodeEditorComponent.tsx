import { Component } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { yaml } from '@codemirror/lang-yaml';

import { CodeEditorWrapper } from './styled';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

interface Props {
  code: string;
  externalResource?: string;
  mode?: string;
  parentCallback(value: string): void;
}

interface State {
  code: string;
}

class CodeEditorComponent extends Component<Props, State> {
  state = {
    code: this.props.code,
  };

  componentDidUpdate(nextProps: Props) {
    const { externalResource } = this.props;
    if (nextProps.externalResource !== externalResource) {
      this.setState({ code: externalResource! });
    }
  }

  render() {
    const {
      props: { mode = 'application/json' },
      state: { code },
    } = this;

    // Map modes to extensions
    const getExtensions = () => {
      if (mode === 'javascript' || mode === 'application/json') {
        return [javascript({ jsx: true })];
      }
      if (mode === 'yaml') {
        return [yaml()];
      }
      return [];
    };

    return (
      <CodeEditorWrapper>
        <CodeMirror
          value={code}
          theme="dark"
          extensions={getExtensions()}
          onChange={this.onChangeValue}
          basicSetup={{
            lineNumbers: true,
          }}
        />
      </CodeEditorWrapper>
    );
  }

  private onChangeValue = (value: string): void => {
    this.props.parentCallback(value);
  };
}

export default CodeEditorComponent;
