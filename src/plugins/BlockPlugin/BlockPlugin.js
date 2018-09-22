// @flow

import React from 'react';
import type { Node } from 'react';
import { RichUtils } from 'draft-js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import type { BlockType, FaIcon } from '../../constants/types';
import AbstractPlugin from '../AbstractPlugin';
import ToolbarButton from '../../components/ToolbarButton';

type Preferences = {
  blockType: BlockType,
  icon: FaIcon,
  title?: string,
};

export default class BlockPlugin extends AbstractPlugin {
  blockType: BlockType;
  icon: FaIcon;
  title: ?string;

  constructor(preferences: Preferences) {
    super();
    this.name = `${preferences.blockType}-block-plugin`;
    this.blockType = preferences.blockType;
    this.icon = preferences.icon;
    this.title = preferences.title;
  }

  shouldRenderActiveButton(): boolean {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();

      return this.blockType === RichUtils.getCurrentBlockType(editorState);
    }

    return false;
  }

  handlePress = () => {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();
      const newEditorState = RichUtils.toggleBlockType(editorState, this.blockType);

      editorActions.setEditorState(newEditorState);
    }
  };

  renderToolbarItem = (): Node => {
    return (
      <ToolbarButton
        title={this.title}
        isActive={this.shouldRenderActiveButton()}
        onPress={this.handlePress}>
        <FontAwesomeIcon icon={this.icon} />
      </ToolbarButton>
    );
  };
}
