import { EditorState, convertFromRaw } from 'draft-js';
import BlockUtils from './BlockUtils';

const rawEditorState = {
  blocks: [
    {
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      type: 'unstyled',
    },
    {
      text: 'Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et.',
      type: 'unstyled',
    },
  ],
  entityMap: {},
};
const editorState = EditorState.createWithContent(convertFromRaw(rawEditorState));

describe('BlockUtils', () => {
  describe('setBlockType()', () => {
    it('should return editorState with new block type', () => {
      const newEditorState = BlockUtils.setBlockType(editorState, 'header-one');

      expect(
        newEditorState
          .getCurrentContent()
          .getFirstBlock()
          .getType()
      ).toBe('header-one');
    });
  });
});
