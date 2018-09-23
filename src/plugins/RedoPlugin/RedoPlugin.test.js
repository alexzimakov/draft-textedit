import React from 'react';
import { shallow } from 'enzyme';
import { EditorState } from 'draft-js';
import RedoPlugin from './RedoPlugin';

const dummyEditorState = EditorState.createEmpty();
const editorActionsMock = {
  getEditorState: jest.fn().mockReturnValue(dummyEditorState),
  setEditorState: jest.fn(),
};

describe('Redo Plugin', () => {
  afterEach(() => {
    editorActionsMock.getEditorState.mockClear();
    editorActionsMock.setEditorState.mockClear();
  });

  it('should create plugin instance without errors', () => {
    const undoPlugin = new RedoPlugin({ title: 'Redo' });

    expect(undoPlugin.name).toBe('redo-plugin');
    expect(undoPlugin.title).toBe('Redo');
  });

  it('should set editor actions', () => {
    const redoPlugin = new RedoPlugin();
    redoPlugin.setEditorActions(editorActionsMock);

    expect(redoPlugin.editorActions).toEqual(editorActionsMock);
  });

  it('should render toolbar item without errors', () => {
    const redoPlugin = new RedoPlugin();
    const ToolbarItem = redoPlugin.renderToolbarItem;

    shallow(<ToolbarItem />);
  });

  it('should render disabled toolbar item', () => {
    const redoPlugin = new RedoPlugin();
    const ToolbarItem = redoPlugin.renderToolbarItem;
    redoPlugin.setEditorActions(editorActionsMock);

    const toolbarItem = shallow(<ToolbarItem />);

    expect(toolbarItem.props().isDisabled).toBeTruthy();
  });

  it('should not throw error if editorActions is falsy', () => {
    const redoPlugin = new RedoPlugin();
    const ToolbarItem = redoPlugin.renderToolbarItem;
    const toolbarItem = shallow(<ToolbarItem />);

    expect(() => {
      toolbarItem.props().onPress();
    }).not.toThrow();
  });

  it('should apply redo stack', () => {
    const redoPlugin = new RedoPlugin();
    const ToolbarItem = redoPlugin.renderToolbarItem;
    const toolbarItem = shallow(<ToolbarItem />);
    const expectedEditorState = EditorState.createEmpty();
    jest.spyOn(EditorState, 'redo').mockReturnValue(expectedEditorState);
    redoPlugin.setEditorActions(editorActionsMock);

    toolbarItem.props().onPress();

    expect(EditorState.redo).toHaveBeenCalledWith(dummyEditorState);
    expect(editorActionsMock.setEditorState).toHaveBeenCalledWith(expectedEditorState);
  });
});
