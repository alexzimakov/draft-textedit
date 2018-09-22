// @flow

import React from 'react';
import type { Node } from 'react';
import { RichUtils } from 'draft-js';
import type { BlockType } from '../../constants/types';
import { BlockUtils } from '../../lib';
import AbstractPlugin from '../AbstractPlugin';
import BlockTypeSelect from '../../components/BlockTypeSelect';

type Preferences = {
  options?: Array<BlockType>,
  labels?: { [BlockType]: string },
};

const defaultPreferences = {
  options: ['unstyled', 'header-one', 'header-two', 'header-three', 'header-four'],
  labels: {
    unstyled: 'Plain Text',
    'header-one': 'Heading 1',
    'header-two': 'Heading 2',
    'header-three': 'Heading 3',
    'header-four': 'Heading 4',
  },
};

export default class BlockPickerPlugin extends AbstractPlugin {
  options: ?Array<BlockType>;
  labels: ?{ [BlockType]: string };

  constructor(preferences: Preferences = defaultPreferences) {
    super();
    this.name = 'block-picker-plugin';
    this.options = preferences.options;
    this.labels = preferences.labels;
  }

  getValue() {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();
      return RichUtils.getCurrentBlockType(editorState);
    }
  }

  handleChange = (blockType: BlockType) => {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();
      editorActions.setEditorState(BlockUtils.setBlockType(editorState, blockType));
    }
  };

  renderToolbarItem = (props: { isToolbarFixed: boolean }): Node => {
    return (
      <BlockTypeSelect
        options={this.options}
        labels={this.labels}
        shouldUseFixedDropdownPosition={props.isToolbarFixed}
        value={this.getValue()}
        onChange={this.handleChange}
      />
    );
  };
}
