import React from 'react';
import { shallow } from 'enzyme';
import { EditorState, RichUtils } from 'draft-js';
import BlockPickerPlugin from './BlockPickerPlugin';
import { BlockUtils } from '../../lib';

const dummyEditorState = EditorState.createEmpty();
const editorActionsMock = {
  getEditorState: jest.fn().mockReturnValue(dummyEditorState),
  setEditorState: jest.fn(),
};

describe('BlockPicker Plugin', () => {
  afterEach(() => {
    editorActionsMock.getEditorState.mockClear();
    editorActionsMock.setEditorState.mockClear();
  });

  it('should create plugin instance without errors', () => {
    const preferences = {
      options: ['unstyled', 'header-one'],
      labels: { unstyled: 'Plain Text', 'header-one': 'Title 1' },
    };
    const blockPickerPlugin = new BlockPickerPlugin(preferences);

    expect(blockPickerPlugin.name).toBe('block-picker-plugin');
    expect(blockPickerPlugin.options).toEqual(preferences.options);
    expect(blockPickerPlugin.labels).toEqual(preferences.labels);
  });

  it('should set editor actions', () => {
    const blockPickerPlugin = new BlockPickerPlugin();
    blockPickerPlugin.setEditorActions(editorActionsMock);

    expect(blockPickerPlugin.editorActions).toEqual(editorActionsMock);
  });

  it('should render toolbar item without errors', () => {
    const blockPickerPlugin = new BlockPickerPlugin();
    const ToolbarItem = blockPickerPlugin.renderToolbarItem;

    shallow(<ToolbarItem isToolbarFixed />);
  });

  it('should not throw error if editor actions is not set', () => {
    const blockPickerPlugin = new BlockPickerPlugin();
    const ToolbarItem = blockPickerPlugin.renderToolbarItem;

    const toolbarItem = shallow(<ToolbarItem isToolbarFixed />);

    expect(() => {
      toolbarItem.props().onChange('header-one');
    }).not.toThrow();
  });

  it('should get current block type when render toolbar item', () => {
    const blockPickerPlugin = new BlockPickerPlugin();
    const ToolbarItem = blockPickerPlugin.renderToolbarItem;
    jest.spyOn(RichUtils, 'getCurrentBlockType').mockReturnValue('test');
    blockPickerPlugin.setEditorActions(editorActionsMock);

    const toolbarItem = shallow(<ToolbarItem isToolbarFixed />);

    expect(toolbarItem.props().value).toBe('test');
    expect(editorActionsMock.getEditorState).toHaveBeenCalled();
    expect(RichUtils.getCurrentBlockType).toHaveBeenCalled();
  });

  it('should set new editor state when select new block type', () => {
    const blockPickerPlugin = new BlockPickerPlugin();
    const ToolbarItem = blockPickerPlugin.renderToolbarItem;
    const toolbarItem = shallow(<ToolbarItem isToolbarFixed={false} />);
    const expectedEditorState = EditorState.createEmpty();
    jest.spyOn(BlockUtils, 'setBlockType').mockReturnValue(expectedEditorState);
    blockPickerPlugin.setEditorActions(editorActionsMock);

    toolbarItem.props().onChange('header-one');

    expect(editorActionsMock.getEditorState).toHaveBeenCalled();
    expect(BlockUtils.setBlockType).toHaveBeenCalledWith(dummyEditorState, 'header-one');
    expect(editorActionsMock.setEditorState).toHaveBeenCalledWith(expectedEditorState);
  });
});
