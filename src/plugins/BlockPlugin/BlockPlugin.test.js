import React from 'react';
import { shallow, mount } from 'enzyme';
import { EditorState, RichUtils } from 'draft-js';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import BlockPlugin from './BlockPlugin';

const preferences = {
  blockType: 'code-block',
  icon: faCode,
  title: 'Code',
};
const dummyEditorState = EditorState.createEmpty();
const editorActionsMock = {
  getEditorState: jest.fn().mockReturnValue(dummyEditorState),
  setEditorState: jest.fn(),
};

describe('Block Plugin', () => {
  afterEach(() => {
    editorActionsMock.getEditorState.mockClear();
    editorActionsMock.setEditorState.mockClear();
  });

  it('should create plugin instance without errors', () => {
    const blockPlugin = new BlockPlugin(preferences);

    expect(blockPlugin.name).toBe('code-block-block-plugin');
    expect(blockPlugin.icon).toEqual(preferences.icon);
    expect(blockPlugin.title).toBe(preferences.title);
  });

  it('should set editor actions', () => {
    const blockPlugin = new BlockPlugin(preferences);
    blockPlugin.setEditorActions(editorActionsMock);

    expect(blockPlugin.editorActions).toEqual(editorActionsMock);
  });

  it('should render toolbar item without errors', () => {
    const blockPlugin = new BlockPlugin(preferences);
    const ToolbarItem = blockPlugin.renderToolbarItem;

    shallow(<ToolbarItem />);
  });

  it('should render active toolbar item', () => {
    const blockPlugin = new BlockPlugin(preferences);
    const ToolbarItem = blockPlugin.renderToolbarItem;
    jest.spyOn(RichUtils, 'getCurrentBlockType').mockReturnValue('code-block');
    blockPlugin.setEditorActions(editorActionsMock);

    const toolbarItem = shallow(<ToolbarItem />);

    expect(toolbarItem.props().isActive).toBeTruthy();
  });

  it('should not throw error if editorActions is falsy', () => {
    const blockPlugin = new BlockPlugin(preferences);
    const ToolbarItem = blockPlugin.renderToolbarItem;
    const toolbarItem = shallow(<ToolbarItem />);

    expect(() => {
      toolbarItem.props().onPress();
    }).not.toThrow();
  });

  it('should toggle block type', () => {
    const blockPlugin = new BlockPlugin(preferences);
    const ToolbarItem = blockPlugin.renderToolbarItem;
    const toolbarItem = shallow(<ToolbarItem />);
    const expectedEditorState = EditorState.createEmpty();
    jest.spyOn(RichUtils, 'toggleBlockType').mockReturnValue(expectedEditorState);
    blockPlugin.setEditorActions(editorActionsMock);

    toolbarItem.props().onPress();

    expect(RichUtils.toggleBlockType).toHaveBeenCalledWith(dummyEditorState, 'code-block');
    expect(editorActionsMock.setEditorState).toHaveBeenCalledWith(expectedEditorState);
  });
});
