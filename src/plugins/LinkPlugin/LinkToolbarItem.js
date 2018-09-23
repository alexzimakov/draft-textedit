// @flow

import React from 'react';
import { EditorState } from 'draft-js';
import inRange from 'lodash/inRange';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import type { EditorActions } from '../../constants/types';
import { EventsManager, EntityUtils } from '../../lib';
import ToolbarButton from '../../components/ToolbarButton';

type Props = {
  title: ?string,
  editorActions: EditorActions,
};
type State = {
  isDisabled: boolean,
};

export default class LinkToolbarItem extends React.Component<Props, State> {
  isLocked: boolean;

  constructor(props: Props) {
    super(props);
    this.isLocked = false;
    this.state = { isDisabled: true };
  }

  componentDidMount() {
    EventsManager.addListener('change-editor-state', this.handleChangeEditorState);
    EventsManager.addListener('editor-focus', this.handleEditorFocus);
    EventsManager.addListener('editor-blur', this.handleEditorBlur);
  }

  componentWillUnmount() {
    EventsManager.removeListener('change-editor-state', this.handleChangeEditorState);
    EventsManager.removeListener('editor-focus', this.handleEditorFocus);
    EventsManager.removeListener('editor-blur', this.handleEditorBlur);
  }

  handleChangeEditorState = (editorState: EditorState) => {
    const selectionState = editorState.getSelection();
    const isSelectionCollapsed = selectionState.isCollapsed();
    const entityKey = EntityUtils.getCurrentEntityKey(editorState);
    let isDisabled =
      this.isLocked ||
      isSelectionCollapsed ||
      selectionState.getStartKey() !== selectionState.getEndKey();

    if (!isDisabled && entityKey) {
      const selectionState = editorState.getSelection();
      const entitySelectionState = EntityUtils.getEntitySelectionState(entityKey, editorState);
      const start = entitySelectionState.getStartOffset() + 1;
      const end = entitySelectionState.getEndOffset();

      isDisabled =
        inRange(selectionState.getStartOffset(), start, end) &&
        inRange(selectionState.getEndOffset(), start, end);
    }

    this.setState({ isDisabled });
  };

  handleEditorFocus = () => {
    setTimeout(() => (this.isLocked = false), 0);
  };

  handleEditorBlur = () => {
    this.isLocked = true;
  };

  handlePress = () => {
    const editorState = this.props.editorActions.getEditorState();
    const { newEditorState, entityKey } = EntityUtils.createEntity(editorState, {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: { linkTo: '', url: '', target: '', subject: '' },
    });

    this.props.editorActions.setEditorState(newEditorState);
    setTimeout(() => EventsManager.dispatchEvent('create-link-entity', entityKey), 0);
  };

  render() {
    return (
      <ToolbarButton
        title={this.props.title}
        isDisabled={this.state.isDisabled}
        onPress={this.handlePress}>
        <FontAwesomeIcon icon={faLink} />
      </ToolbarButton>
    );
  }
}
