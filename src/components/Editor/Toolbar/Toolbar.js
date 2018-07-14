import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo';
import faRedo from '@fortawesome/fontawesome-free-solid/faRedo';
import { detectOS } from '../../../lib/utils';
import ControlsGroup from '../../ControlsGroup';
import BlockTypeSelect from '../../BlockTypeSelect';
import StyleButton from '../../StyleButton';
import './Toolbar.css';

const InlineStyleControlPropType = PropTypes.shape({
  icon: PropTypes.shape({
    prefix: PropTypes.string,
    iconName: PropTypes.string,
    icon: PropTypes.arrayOf(PropTypes.any),
  }),
  label: PropTypes.string,
  style: PropTypes.string.isRequired,
});
const OS = detectOS();
const EDITOR_BORDER = 1;

class Toolbar extends Component {
  static propTypes = {
    blockTypeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    inlineStyleControls: PropTypes.arrayOf(InlineStyleControlPropType).isRequired,
    editorRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
    editorHasFocus: PropTypes.bool.isRequired,
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    setBlockType: PropTypes.func.isRequired,
    toggleInlineStyle: PropTypes.func.isRequired,
    undo: PropTypes.func.isRequired,
    redo: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.toolbarRef = React.createRef();
    this.animationFrame = null;
    this.state = { editorBoundaries: {} };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.updateEditorBoundaries);
    window.addEventListener('resize', this.updateEditorBoundaries);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateEditorBoundaries);
    window.removeEventListener('resize', this.updateEditorBoundaries);
  }

  updateEditorBoundaries = () => {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = window.requestAnimationFrame(() => {
      const { editorRef } = this.props;
      this.setState({ editorBoundaries: editorRef.current.getBoundingClientRect() });
    });
  };

  renderBlockTypeSelect = popoverIsFixed => {
    const { editorState, blockTypeOptions, setBlockType } = this.props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <ControlsGroup>
        <BlockTypeSelect
          value={blockType}
          options={blockTypeOptions}
          popoverIsFixed={popoverIsFixed}
          onChange={setBlockType}
        />
      </ControlsGroup>
    );
  };

  renderInlineStyleControls = () => {
    const { editorState, inlineStyleControls, toggleInlineStyle } = this.props;
    const currentStyle = editorState.getCurrentInlineStyle();

    return (
      <ControlsGroup>
        {inlineStyleControls.map(({ style, label, icon }) => (
          <StyleButton
            key={style}
            title={label}
            active={currentStyle.has(style)}
            onPress={() => toggleInlineStyle(style)}>
            {icon ? <FontAwesomeIcon icon={icon} /> : label}
          </StyleButton>
        ))}
      </ControlsGroup>
    );
  };

  renderCommandControls = () => {
    const { editorState, undo, redo } = this.props;

    return (
      <ControlsGroup>
        <StyleButton
          title={`Undo (${OS === 'mac' ? '\u2318Z' : 'Ctrl+Z'})`}
          onPress={undo}
          disabled={editorState.getUndoStack().size === 0}>
          <FontAwesomeIcon icon={faUndo} />
        </StyleButton>
        <StyleButton
          title={`Redo (${OS === 'mac' ? '\u2318\u21e7Z' : 'Ctrl+Shift+Z'})`}
          onPress={redo}
          disabled={editorState.getRedoStack().size === 0}>
          <FontAwesomeIcon icon={faRedo} />
        </StyleButton>
      </ControlsGroup>
    );
  };

  render() {
    const { editorHasFocus } = this.props;
    const { editorBoundaries } = this.state;
    const { height: toolbarHeight } = this.toolbarRef.current
      ? this.toolbarRef.current.getBoundingClientRect()
      : { height: 0 };
    const stickyOnBottom = editorHasFocus && editorBoundaries.bottom - toolbarHeight <= 0;
    const stickyOnTop = editorHasFocus && editorBoundaries.top <= 0;
    const toolbarClassName = classNames([
      'DraftTextEditToolbar',
      stickyOnTop && 'DraftTextEditToolbar_sticky_top',
      stickyOnBottom && 'DraftTextEditToolbar_sticky_bottom',
    ]);
    const sticky = stickyOnTop && !stickyOnBottom;
    const style = sticky
      ? {
          left: editorBoundaries.left + EDITOR_BORDER,
          width: editorBoundaries.width - EDITOR_BORDER * 2,
        }
      : {};

    return (
      <div ref={this.toolbarRef} style={style} className={toolbarClassName}>
        <div className="DraftTextEditToolbar-InnerWrapper">
          {this.renderBlockTypeSelect(sticky)}
          {this.renderInlineStyleControls()}
          {this.renderCommandControls()}
        </div>
      </div>
    );
  }
}

export { InlineStyleControlPropType };
export default Toolbar;
