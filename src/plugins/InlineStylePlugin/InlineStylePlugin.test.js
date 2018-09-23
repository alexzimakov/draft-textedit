import React from 'react';
import { shallow } from 'enzyme';
import { EditorState, RichUtils } from 'draft-js';
import { faBold } from '@fortawesome/free-solid-svg-icons/faBold';
import InlineStylePlugin from './InlineStylePlugin';

const preferences = {
  inlineStyle: 'BOLD',
  icon: faBold,
  title: 'Bold',
};
const dummyEditorState = EditorState.createEmpty();
const editorActionsMock = {
  getEditorState: jest.fn().mockReturnValue(dummyEditorState),
  setEditorState: jest.fn(),
};

describe('InlineStyle Plugin', () => {
  afterEach(() => {
    editorActionsMock.getEditorState.mockClear();
    editorActionsMock.setEditorState.mockClear();
  });

  it('should create plugin instance without errors', () => {
    const inlineStylePlugin = new InlineStylePlugin(preferences);

    expect(inlineStylePlugin.name).toBe('BOLD-style-plugin');
    expect(inlineStylePlugin.icon).toEqual(preferences.icon);
    expect(inlineStylePlugin.title).toBe(preferences.title);
  });

  it('should set editor actions', () => {
    const inlineStylePlugin = new InlineStylePlugin(preferences);
    inlineStylePlugin.setEditorActions(editorActionsMock);

    expect(inlineStylePlugin.editorActions).toEqual(editorActionsMock);
  });

  it('should render toolbar item without errors', () => {
    const inlineStylePlugin = new InlineStylePlugin(preferences);
    const ToolbarItem = inlineStylePlugin.renderToolbarItem;

    shallow(<ToolbarItem />);
  });

  it('should render active toolbar item', () => {
    const inlineStylePlugin = new InlineStylePlugin(preferences);
    const ToolbarItem = inlineStylePlugin.renderToolbarItem;
    jest.spyOn(dummyEditorState, 'getCurrentInlineStyle').mockReturnValue({
      has: jest.fn().mockReturnValue(true),
    });
    inlineStylePlugin.setEditorActions(editorActionsMock);

    const toolbarItem = shallow(<ToolbarItem />);

    expect(toolbarItem.props().isActive).toBeTruthy();
  });

  it('should not throw error if editorActions is falsy', () => {
    const inlineStylePlugin = new InlineStylePlugin(preferences);
    const ToolbarItem = inlineStylePlugin.renderToolbarItem;
    const toolbarItem = shallow(<ToolbarItem />);

    expect(() => {
      toolbarItem.props().onPress();
    }).not.toThrow();
  });

  it('should toggle block type', () => {
    const inlineStylePlugin = new InlineStylePlugin(preferences);
    const ToolbarItem = inlineStylePlugin.renderToolbarItem;
    const toolbarItem = shallow(<ToolbarItem />);
    const expectedEditorState = EditorState.createEmpty();
    jest.spyOn(RichUtils, 'toggleInlineStyle').mockReturnValue(expectedEditorState);
    inlineStylePlugin.setEditorActions(editorActionsMock);

    toolbarItem.props().onPress();

    expect(RichUtils.toggleInlineStyle).toHaveBeenCalledWith(dummyEditorState, 'BOLD');
    expect(editorActionsMock.setEditorState).toHaveBeenCalledWith(expectedEditorState);
  });
});
