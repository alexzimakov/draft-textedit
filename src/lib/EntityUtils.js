// @flow

import { EditorState, ContentState, SelectionState, Modifier } from 'draft-js';
import pick from 'lodash/pick';
import type { EntityType, Mutability } from '../constants/types';

export default {
  getCurrentEntityKey(editorState: EditorState): ?string {
    const selectionState = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(selectionState.getAnchorKey());

    return currentContentBlock.getEntityAt(selectionState.getAnchorOffset());
  },
  getEntitySelectionState(entityKey: string, editorState: EditorState): SelectionState {
    const selectionState = editorState.getSelection();
    const blockKey = selectionState.getStartKey();
    const contentState = editorState.getCurrentContent();
    const contentBlock = contentState.getBlockForKey(blockKey);
    let anchorOffset = selectionState.getStartOffset();
    let focusOffset = selectionState.getEndOffset();

    contentBlock.findEntityRanges(
      characterMetadata => characterMetadata.getEntity() === entityKey,
      (start, end) => {
        anchorOffset = start;
        focusOffset = end;
      }
    );

    return SelectionState.createEmpty(blockKey).merge({
      hasFocus: selectionState.getHasFocus(),
      anchorOffset,
      focusOffset,
    });
  },
  createEntity(
    editorState: EditorState,
    preferences: { type: EntityType, mutability: Mutability, data: { [string]: any } }
  ): { newEditorState: EditorState, entityKey: string } {
    const selectionState = editorState.getSelection();
    const currentContentState = editorState.getCurrentContent();
    const contentStateWithEntity = currentContentState.createEntity(
      preferences.type,
      preferences.mutability,
      preferences.data
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newContentState = Modifier.applyEntity(contentStateWithEntity, selectionState, entityKey);
    const newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');

    return { newEditorState, entityKey };
  },
  removeEntity(entityKey: string, editorState: EditorState): EditorState {
    const currentContentState = editorState.getCurrentContent();
    const selectionState = this.getEntitySelectionState(entityKey, editorState);
    const newContentState = Modifier.applyEntity(currentContentState, selectionState, null);

    return EditorState.push(editorState, newContentState, 'apply-entity');
  },
  getEntityData(
    entityKey: string,
    contentState: ContentState,
    paths?: string | Array<string>
  ): { [string]: any } {
    try {
      const entity = contentState.getEntity(entityKey);
      const entityData = entity.get('data');

      return paths ? pick(entityData, paths) : entityData;
    } catch (error) {
      return {};
    }
  },
  updateEntityData(
    entityKey: string,
    editorState: EditorState,
    data: { [string]: any }
  ): EditorState {
    const contentState = editorState.getCurrentContent();
    const entity = contentState.getEntity(entityKey);
    const entitySelectionState = this.getEntitySelectionState(entityKey, editorState);
    const contentStateWithEntity = contentState.createEntity(
      entity.getType(),
      entity.getMutability(),
      { ...entity.getData(), ...data }
    );
    const newEntityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newContentState = Modifier.applyEntity(
      contentStateWithEntity,
      entitySelectionState,
      newEntityKey
    );

    return EditorState.push(editorState, newContentState, 'apply-entity');
  },
  replaceEntityData(
    entityKey: string,
    editorState: EditorState,
    data: { [string]: any }
  ): EditorState {
    const contentState = editorState.getCurrentContent();
    const entity = contentState.getEntity(entityKey);
    const entitySelectionState = this.getEntitySelectionState(entityKey, editorState);
    const contentStateWithEntity = contentState.createEntity(
      entity.getType(),
      entity.getMutability(),
      data
    );
    const newEntityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newContentState = Modifier.applyEntity(
      contentStateWithEntity,
      entitySelectionState,
      newEntityKey
    );

    return EditorState.push(editorState, newContentState, 'apply-entity');
  },
};
