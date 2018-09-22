// @flow

import * as React from 'react';
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  CompositeDecorator,
} from 'draft-js';
import { Map } from 'immutable';
import isFunction from 'lodash/isFunction';
import type { Plugin, Ref, Decorator } from '../../constants/types';
import { monospaceFontStack } from '../../constants/fonts';
import { monospaceStyleTextColor, monospaceStyleBackgroundColor } from '../../constants/colors';
import { EventsManager } from '../../lib';
import { plugins, maxListDepth } from '../../constants/preferences';
import {
  StyledEditor,
  Toolbar,
  ToolbarItems,
  ToolbarItem,
  EditorContent,
  Widgets,
  WidgetItem,
  Unstyled,
  HeaderOne,
  HeaderTwo,
  HeaderThree,
  HeaderFour,
  HeaderFive,
  HeaderSix,
  Blockquote,
  CodeBlock,
  Atomic,
} from './styled';

type Props = {
  plugins: Array<Plugin>,
  defaultEditorState: EditorState,
  editorState?: EditorState,
  placeholder?: string,
  readOnly?: boolean,
  onChange?: (editorState: EditorState) => void,
};
type State = {
  activePlugins: Array<Plugin>,
  editorState: EditorState,
  hasFocus: boolean,
  isLocked: boolean,
  isToolbarStickyOnTop: boolean,
  isToolbarStickyOnBottom: boolean,
  toolbarStyle: {
    position: 'absolute' | 'fixed',
    top: number | 'auto',
    bottom: number | 'auto',
    left: number | 'auto',
    maxWidth: number | 'none',
    borderTopRightRadius: number,
    borderTopLeftRadius: number,
    borderBottomRightRadius: number,
    borderBottomLeftRadius: number,
    boxShadow: string,
  },
};

class Editor extends React.Component<Props, State> {
  editorRef: Ref<HTMLDivElement>;
  toolbarRef: Ref<HTMLDivElement>;
  editorContentRef: Ref<HTMLDivElement>;
  draftEditorRef: Ref<DraftEditor>;
  ticking: boolean;

  static defaultProps = {
    plugins: plugins,
    defaultEditorState: EditorState.createEmpty(),
    placeholder: '',
    readOnly: false,
  };

  static getDerivedStateFromProps(props: Props) {
    if ('editorState' in props) {
      return { editorState: props.editorState };
    }

    return null;
  }

  get defaultToolbarStyle() {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 'auto',
      maxWidth: 'none',
      borderTopRightRadius: 2,
      borderTopLeftRadius: 2,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      boxShadow: 'none',
    };
  }

  get blockRenderMap() {
    const builtinBlockRenderMap = Map({
      unstyled: { element: Unstyled },
      'header-one': { element: HeaderOne },
      'header-two': { element: HeaderTwo },
      'header-three': { element: HeaderThree },
      'header-four': { element: HeaderFour },
      'header-five': { element: HeaderFive },
      'header-six': { element: HeaderSix },
      blockquote: { element: Blockquote },
      'code-block': { element: CodeBlock },
      atomic: { element: Atomic },
    });

    return DefaultDraftBlockRenderMap.merge(builtinBlockRenderMap);
  }

  get customStyleMap() {
    return {
      CODE: {
        padding: '2px 4px',
        color: monospaceStyleTextColor,
        borderRadius: 4,
        background: monospaceStyleBackgroundColor,
        fontFamily: monospaceFontStack,
        fontSize: '100%',
      },
    };
  }

  constructor(props: Props) {
    super(props);
    this.editorRef = React.createRef();
    this.toolbarRef = React.createRef();
    this.editorContentRef = React.createRef();
    this.draftEditorRef = React.createRef();
    this.ticking = false;
    this.state = {
      activePlugins: [],
      editorState: props.defaultEditorState,
      hasFocus: false,
      isLocked: false,
      isToolbarStickyOnTop: false,
      isToolbarStickyOnBottom: false,
      toolbarStyle: this.defaultToolbarStyle,
    };
  }

  componentDidMount() {
    this.registerPlugins();
    window.addEventListener('scroll', this.handleWindowScroll);
    window.addEventListener('resize', this.updateToolbarStyle);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleWindowScroll);
    window.removeEventListener('resize', this.updateToolbarStyle);
  }

  getEditorState = () => {
    return this.state.editorState;
  };

  setEditorState = (editorState: EditorState, callback?: () => mixed) => {
    this.setState({ editorState }, callback);
    isFunction(this.props.onChange) && this.props.onChange(editorState);
  };

  focus = () => {
    const draftEditorRef = this.draftEditorRef.current;

    if (draftEditorRef) {
      draftEditorRef.focus();
    }
  };

  blur = () => {
    const draftEditorRef = this.draftEditorRef.current;

    if (draftEditorRef) {
      draftEditorRef.blur();
    }
  };

  lock = (callback?: () => mixed) => {
    this.setState({ isLocked: true }, callback);
  };

  unlock = (callback?: () => mixed) => {
    this.setState({ isLocked: false }, callback);
  };

  registerPlugins() {
    const decorators: Array<Decorator> = [];

    for (let i = 0; i < this.props.plugins.length; i += 1) {
      const plugin = this.props.plugins[i];

      plugin.setEditorActions({
        setEditorState: this.setEditorState,
        getEditorState: this.getEditorState,
        focus: this.focus,
        blur: this.blur,
        lock: this.lock,
        unlock: this.unlock,
      });

      if (isFunction(plugin.getDecorator)) {
        decorators.push(plugin.getDecorator());
      }
    }

    this.setEditorState(
      EditorState.set(this.state.editorState, { decorator: new CompositeDecorator(decorators) })
    );
  }

  shouldHidePlaceholder() {
    const editorState = this.getEditorState();
    const contentState = editorState.getCurrentContent();

    return (
      !contentState.hasText() &&
      contentState
        .getBlockMap()
        .first()
        .getType() !== 'unstyled'
    );
  }

  updateToolbarStyle = () => {
    const editorRef = this.editorRef.current;
    const toolbarRef = this.toolbarRef.current;

    if (editorRef && toolbarRef) {
      const editorBoundaries = editorRef.getBoundingClientRect();
      let {
        position,
        top,
        bottom,
        left,
        maxWidth,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        boxShadow,
      } = this.defaultToolbarStyle;

      if (editorBoundaries.bottom <= toolbarRef.offsetHeight) {
        position = 'absolute';
        top = 'auto';
        bottom = 0;
        maxWidth = 'none';
        boxShadow = 'none';
        borderTopRightRadius = 0;
        borderTopLeftRadius = 0;
        borderBottomRightRadius = 2;
        borderBottomLeftRadius = 2;
      } else if (editorBoundaries.top <= 0) {
        position = 'fixed';
        left = editorRef.offsetLeft + editorRef.clientLeft;
        maxWidth = editorRef.clientWidth;
        borderTopRightRadius = 0;
        borderTopLeftRadius = 0;
        boxShadow = '0 1px 2px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15)';
      }

      this.setState({
        toolbarStyle: {
          position,
          top,
          bottom,
          left,
          maxWidth,
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomLeftRadius,
          borderBottomRightRadius,
          boxShadow,
        },
      });
    }
  };

  handleWindowScroll = () => {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateToolbarStyle();
        this.ticking = false;
      });
      this.ticking = true;
    }
  };

  handleWrapperMouseDown = (event: SyntheticMouseEvent<HTMLDivElement>) => {
    if (event.target === this.editorContentRef.current) {
      event.preventDefault();
    }

    this.focus();
  };

  handleChange = (editorState: EditorState) => {
    EventsManager.dispatchEvent('change-editor-state', editorState);
    this.setEditorState(editorState);
  };

  handleFocus = () => {
    EventsManager.dispatchEvent('editor-focus');
    this.setState({ hasFocus: true });
  };

  handleBlur = () => {
    EventsManager.dispatchEvent('editor-blur');
    this.setState({ hasFocus: false });
  };

  handleKeyCommand = (command: string, editorState: EditorState): 'handled' | 'not-handled' => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);

    if (newEditorState) {
      this.setEditorState(newEditorState);
      return 'handled';
    }

    return 'not-handled';
  };

  handleTabPress = (event: SyntheticKeyboardEvent<EventTarget>) => {
    this.setEditorState(RichUtils.onTab(event, this.getEditorState(), maxListDepth));
  };

  render() {
    return (
      <StyledEditor innerRef={this.editorRef} hasFocus={this.state.hasFocus}>
        <Toolbar innerRef={this.toolbarRef} style={this.state.toolbarStyle}>
          <ToolbarItems>
            {this.props.plugins.map((plugin, key) => {
              return (
                <ToolbarItem key={key}>
                  {plugin.renderToolbarItem({
                    isToolbarFixed: this.state.toolbarStyle.position === 'fixed',
                  })}
                </ToolbarItem>
              );
            })}
          </ToolbarItems>
        </Toolbar>
        <EditorContent
          innerRef={this.editorContentRef}
          shouldHidePlaceholder={this.shouldHidePlaceholder()}
          onMouseDown={this.handleWrapperMouseDown}>
          <DraftEditor
            ref={ref => (this.draftEditorRef.current = ref)}
            editorState={this.state.editorState}
            placeholder={this.props.placeholder}
            readOnly={this.props.readOnly || this.state.isLocked}
            spellCheck
            blockRenderMap={this.blockRenderMap}
            customStyleMap={this.customStyleMap}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            handleKeyCommand={this.handleKeyCommand}
            onTab={this.handleTabPress}
          />
        </EditorContent>
        <Widgets>
          {this.props.plugins.map((plugin, key) => {
            return (
              <WidgetItem key={key}>
                {plugin.renderWidget({ editorRef: this.editorRef })}
              </WidgetItem>
            );
          })}
        </Widgets>
      </StyledEditor>
    );
  }
}

export default Editor;
