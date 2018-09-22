import React from 'react';
import { shallow } from 'enzyme';
import AbstractPlugin from './AbstractPlugin';

class TestPlugin extends AbstractPlugin {
  constructor(props) {
    super(props);
    this.name = 'test-plugin';
  }
}

describe('Abstract Plugin', () => {
  it('should set editorActions', () => {
    const testPlugin = new TestPlugin();
    const editorActionsMock = {
      setEditorState: jest.fn(),
      getEditorState: jest.fn(),
    };

    testPlugin.setEditorActions(editorActionsMock);

    expect(testPlugin.editorActions).toBe(editorActionsMock);
  });

  it('should render empty toolbar item element', () => {
    const testPlugin = new TestPlugin();
    const ToolbarItem = testPlugin.renderToolbarItem;

    const toolbarItem = shallow(<ToolbarItem />);

    expect(toolbarItem.type()).toBeNull();
  });

  it('should render empty widget element', () => {
    const testPlugin = new TestPlugin();
    const Widget = testPlugin.renderWidget;

    const widget = shallow(<Widget />);

    expect(widget.type()).toBeNull();
  });
});
