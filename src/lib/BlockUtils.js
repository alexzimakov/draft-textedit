// @flow

import { EditorState, Modifier } from 'draft-js';
import type { BlockType } from '../constants/types';

export default {
  setBlockType(editorState: EditorState, blockType: BlockType): EditorState {
    const contentState = Modifier.setBlockType(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      blockType
    );

    return EditorState.push(editorState, contentState, 'change-block-type');
  },
};
