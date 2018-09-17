import { EditorState, SelectionState, convertFromRaw } from 'draft-js';
import EntityUtils from '../EntityUtils';

const editorState = EditorState.createWithContent(
  convertFromRaw({
    blocks: [
      {
        key: 'r8v1',
        text:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [{ offset: 6, length: 5, key: 0 }, { offset: 22, length: 4, key: 1 }],
        data: {},
      },
      {
        key: '5ue7g',
        text: 'Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {
      '0': {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { href: 'http://example.com', target: '_top' },
      },
      '1': {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { href: 'http://localhost:8080', target: '_top' },
      },
    },
  })
);

describe('EntityUtils', () => {
  describe('getCurrentEntityKey()', () => {
    it('should return entity key', () => {
      const selectionState = SelectionState.createEmpty('r8v1').merge({
        anchorOffset: 23,
        focusOffset: 23,
      });
      const editorStateWithSelection = EditorState.acceptSelection(editorState, selectionState);

      expect(EntityUtils.getCurrentEntityKey(editorStateWithSelection)).toBe('2');
    });

    it('should return null', () => {
      expect(EntityUtils.getCurrentEntityKey(editorState)).toBeNull();
    });
  });

  describe('getEntitySelectionState()', () => {
    it('should return entity SelectionState', () => {
      const entitySelectionState = EntityUtils.getEntitySelectionState('1', editorState);

      expect(entitySelectionState.getAnchorOffset()).toBe(6);
      expect(entitySelectionState.getEndOffset()).toBe(11);
    });

    it('should return empty SelectionState if entity does not exist', () => {
      const entitySelectionState = EntityUtils.getEntitySelectionState('13', editorState);

      expect(entitySelectionState.getAnchorOffset()).toBe(0);
      expect(entitySelectionState.getEndOffset()).toBe(0);
    });
  });

  describe('createEntity()', () => {
    it('should create entity', () => {
      const selectionState = SelectionState.createEmpty('5ue7g').merge({
        anchorOffset: 0,
        focusOffset: 5,
      });
      const { newEditorState, entityKey } = EntityUtils.createEntity(
        EditorState.acceptSelection(editorState, selectionState),
        { type: 'TEST', mutability: 'IMMUTABLE', data: { foo: 'bar' } }
      );

      expect(
        newEditorState
          .getCurrentContent()
          .getBlockForKey('5ue7g')
          .getEntityAt(0)
      ).toBe(entityKey);
      expect(
        newEditorState
          .getCurrentContent()
          .getEntity(entityKey)
          .toJS()
      ).toEqual({
        type: 'TEST',
        mutability: 'IMMUTABLE',
        data: { foo: 'bar' },
      });
    });
  });

  describe('removeEntity()', () => {
    it('should remove entity', () => {
      const newEditorState = EntityUtils.removeEntity('1', editorState, 'apply-entity');

      expect(
        newEditorState
          .getCurrentContent()
          .getBlockForKey('r8v1')
          .getEntityAt(6)
      ).toBeNull();
    });
  });

  describe('getEntityData()', () => {
    it('should return entity data', () => {
      const entityData = EntityUtils.getEntityData('1', editorState.getCurrentContent());

      expect(entityData).toEqual({ href: 'http://example.com', target: '_top' });
    });

    it('should return chunk of entity data', () => {
      const entityData = EntityUtils.getEntityData('1', editorState.getCurrentContent(), 'target');

      expect(entityData).toEqual({ target: '_top' });
    });

    it('should return empty object if entity does not exist', () => {
      const entityData = EntityUtils.getEntityData('13', editorState.getCurrentContent());

      expect(entityData).toEqual({});
    });
  });

  describe('updateEntityData()', () => {
    it('should update entity data', () => {
      const newEditorState = EntityUtils.updateEntityData('1', editorState, {
        target: '_self',
        foo: 'bar',
      });
      const lastCreatedEntityKey = newEditorState.getCurrentContent().getLastCreatedEntityKey();

      expect(
        newEditorState
          .getCurrentContent()
          .getBlockForKey('r8v1')
          .getEntityAt(6)
      ).toBe(lastCreatedEntityKey);
      expect(
        newEditorState
          .getCurrentContent()
          .getEntity(lastCreatedEntityKey)
          .getData()
      ).toEqual({ href: 'http://example.com', target: '_self', foo: 'bar' });
    });
  });

  describe('replaceEntityData()', () => {
    it('should replace entity data', () => {
      const newEditorState = EntityUtils.replaceEntityData('1', editorState, { foo: 'bar' });
      const lastCreatedEntityKey = newEditorState.getCurrentContent().getLastCreatedEntityKey();

      expect(
        newEditorState
          .getCurrentContent()
          .getBlockForKey('r8v1')
          .getEntityAt(6)
      ).toBe(lastCreatedEntityKey);
      expect(
        newEditorState
          .getCurrentContent()
          .getEntity(lastCreatedEntityKey)
          .getData()
      ).toEqual({ foo: 'bar' });
    });
  });
});
