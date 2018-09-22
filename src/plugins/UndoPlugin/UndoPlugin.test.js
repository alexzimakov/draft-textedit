import React from 'react';
import { shallow } from 'enzyme';
import { EditorState } from 'draft-js';
import UndoPlugin from './UndoPlugin';

const dummyEditorState = EditorState.createEmpty();
const editorActionsMock = {
  getEditorState: jest.fn().mockReturnValue(dummyEditorState),
  setEditorState: jest.fn(),
};

describe('Undo Plugin', () => {
  afterEach(() => {
    editorActionsMock.getEditorState.mockClear();
    editorActionsMock.setEditorState.mockClear();
  });

  it('should create plugin instance without errors', () => {
    const undoPlugin = new UndoPlugin({ title: 'Undo' });

    expect(undoPlugin.name).toBe('undo-plugin');
    expect(undoPlugin.title).toBe('Undo');
  });

  it('should set editor actions', () => {
    const undoPlugin = new UndoPlugin();
    undoPlugin.setEditorActions(editorActionsMock);

    expect(undoPlugin.editorActions).toEqual(editorActionsMock);
  });

  it('should render toolbar item without errors', () => {
    const undoPlugin = new UndoPlugin();
    const ToolbarItem = undoPlugin.renderToolbarItem;

    shallow(<ToolbarItem />);
  });

  it('should render disabled toolbar item', () => {
    const undoPlugin = new UndoPlugin();
    const ToolbarItem = undoPlugin.renderToolbarItem;
    undoPlugin.setEditorActions(editorActionsMock);

    const toolbarItem = shallow(<ToolbarItem />);

    expect(toolbarItem.props().isDisabled).toBeTruthy();
  });

  it('should not throw error if editorActions is falsy', () => {
    const undoPlugin = new UndoPlugin();
    const ToolbarItem = undoPlugin.renderToolbarItem;
    const toolbarItem = shallow(<ToolbarItem />);

    expect(() => {
      toolbarItem.props().onPress();
    }).not.toThrow();
  });

  it('should apply undo stack', () => {
    const undoPlugin = new UndoPlugin();
    const ToolbarItem = undoPlugin.renderToolbarItem;
    const toolbarItem = shallow(<ToolbarItem />);
    const expectedEditorState = EditorState.createEmpty();
    jest.spyOn(EditorState, 'undo').mockReturnValue(expectedEditorState);
    undoPlugin.setEditorActions(editorActionsMock);

    toolbarItem.props().onPress();

    expect(EditorState.undo).toHaveBeenCalledWith(dummyEditorState);
    expect(editorActionsMock.setEditorState).toHaveBeenCalledWith(expectedEditorState);
  });
});
