// @flow

import React from 'react';
import type { Node } from 'react';
import { RichUtils } from 'draft-js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import type { InlineStyle, FaIcon } from '../../constants/types';
import AbstractPlugin from '../AbstractPlugin';
import ToolbarButton from '../../components/ToolbarButton';

type Preferences = {
  inlineStyle: InlineStyle,
  icon: FaIcon,
  title?: string,
};

export default class InlineStylePlugin extends AbstractPlugin {
  inlineStyle: InlineStyle;
  icon: FaIcon;
  title: ?string;

  constructor(preferences: Preferences) {
    super();
    this.name = `${preferences.inlineStyle}-style-plugin`;
    this.inlineStyle = preferences.inlineStyle;
    this.icon = preferences.icon;
    this.title = preferences.title;
  }

  shouldRenderActiveButton(): boolean {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();

      return editorState.getCurrentInlineStyle().has(this.inlineStyle);
    }

    return false;
  }

  handlePress = () => {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();
      const newEditorState = RichUtils.toggleInlineStyle(editorState, this.inlineStyle);

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
