// @flow

import React from 'react';
import type { Node } from 'react';
import { EditorState } from 'draft-js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { Utils } from '../../lib/index';
import AbstractPlugin from '../AbstractPlugin';
import ToolbarButton from '../../components/ToolbarButton';

type Preferences = {
  title?: string,
};

export default class RedoPlugin extends AbstractPlugin {
  title: ?string;

  constructor(preferences: Preferences = {}) {
    super();
    this.name = 'redo-plugin';
    this.title =
      preferences.title ||
      `Redo (${Utils.detectOS() === 'macOS' ? '\u2318\u21e7' : 'Ctrl+Shift'}Z)`;
  }

  shouldDisableButton(): boolean {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();

      return editorState.getRedoStack().size === 0;
    }

    return true;
  }

  handlePress = () => {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();
      const newEditorState = EditorState.redo(editorState);

      editorActions.setEditorState(newEditorState);
    }
  };

  renderToolbarItem = (): Node => {
    return (
      <ToolbarButton
        title={this.title}
        isDisabled={this.shouldDisableButton()}
        onPress={this.handlePress}>
        <FontAwesomeIcon icon={faRedo} />
      </ToolbarButton>
    );
  };
}
