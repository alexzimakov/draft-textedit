import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  Modifier,
  DefaultDraftBlockRenderMap,
} from 'draft-js';
import pick from 'lodash.pick';
import { Map } from 'immutable';
import classNames from 'classnames';
import * as blockTypes from '../../constants/blockTypes';
import * as preferences from './preferences';
import Toolbar, { InlineStyleControlPropType } from './Toolbar';
import './Editor.css';

const blockRenderMap = DefaultDraftBlockRenderMap.merge(
  Map({
    [blockTypes.paragraph]: {
      element: 'p',
    },
  })
);
const styleMap = {
  CODE: {
    paddingRight: 2,
    paddingLeft: 2,
    color: '#8e93a5',
    borderRadius: 2,
    fontFamily: "'Courier New', monospace",
  },
};

class Editor extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    blockTypeOptions: PropTypes.arrayOf(PropTypes.string),
    inlineStyleControls: PropTypes.arrayOf(InlineStyleControlPropType),
    // eslint-disable-next-line
    value: PropTypes.instanceOf(EditorState),
    defaultValue: PropTypes.instanceOf(EditorState),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    placeholder: '',
    blockTypeOptions: preferences.blockTypeOptions,
    inlineStyleControls: preferences.inlineStyleControls,
    defaultValue: EditorState.createEmpty(),
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.state = {
      editorState: props.defaultValue,
      hasFocus: false,
    };
  }

  getState = () => ({ ...this.state, ...pick(this.props, ['value']) });

  getEditorState = () => {
    const { editorState } = this.getState();
    return editorState;
  };

  setEditorState = editorState => {
    const { onChange } = this.props;

    this.setState({ editorState });
    onChange(editorState);
  };

  setBlockType = blockType => {
    const editorState = this.getEditorState();
    const contentState = Modifier.setBlockType(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      blockType
    );

    this.setEditorState(EditorState.push(editorState, contentState, 'change-block-type'));
  };

  toggleInlineStyle = inlineStyle => {
    this.setEditorState(RichUtils.toggleInlineStyle(this.getEditorState(), inlineStyle));
  };

  undo = () => {
    const editorState = this.getEditorState();
    this.setState({ editorState: EditorState.undo(editorState) });
  };

  redo = () => {
    const editorState = this.getEditorState();
    this.setState({ editorState: EditorState.redo(editorState) });
  };

  shouldHidePlaceholder = () => {
    const editorState = this.getEditorState();
    const contentState = editorState.getCurrentContent();

    return (
      !contentState.hasText() &&
      contentState
        .getBlockMap()
        .first()
        .getType() !== blockTypes.paragraph
    );
  };

  handleFocus = () => {
    this.setState({ hasFocus: true });
  };

  handleBlur = () => {
    this.setState({ hasFocus: false });
  };

  handleKeyCommand = (command, editorState) => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);

    if (newEditorState) {
      this.setEditorState(newEditorState);
      return 'handled';
    }

    return 'not-handled';
  };

  handleTabPress = event => {
    this.setEditorState(RichUtils.onTab(event, this.getEditorState(), preferences.maxListDepth));
  };

  render() {
    const { placeholder, blockTypeOptions, inlineStyleControls } = this.props;
    const { editorState, hasFocus } = this.getState();
    const editorClassName = classNames(
      'DraftTextEditEditor',
      hasFocus && 'DraftTextEditEditor_hasFocus',
      this.shouldHidePlaceholder() && 'DraftTextEditEditor_hidePlaceholder'
    );

    return (
      <div ref={this.editorRef} className={editorClassName}>
        <Toolbar
          blockTypeOptions={blockTypeOptions}
          inlineStyleControls={inlineStyleControls}
          editorRef={this.editorRef}
          editorHasFocus={hasFocus}
          editorState={editorState}
          setBlockType={this.setBlockType}
          toggleInlineStyle={this.toggleInlineStyle}
          undo={this.undo}
          redo={this.redo}
        />
        <div className="DraftTextEditEditor-Content DraftTextEditContent">
          <DraftEditor
            editorState={editorState}
            placeholder={placeholder}
            spellCheck
            blockRenderMap={blockRenderMap}
            customStyleMap={styleMap}
            handleKeyCommand={this.handleKeyCommand}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onTab={this.handleTabPress}
            onChange={this.setEditorState}
          />
        </div>
      </div>
    );
  }
}

export default Editor;
