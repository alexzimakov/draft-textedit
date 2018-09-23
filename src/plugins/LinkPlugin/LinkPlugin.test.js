import React from 'react';
import { shallow } from 'enzyme';
import LinkPlugin from './LinkPlugin';
import { convertFromRaw, EditorState } from 'draft-js';

const initialEditorState = EditorState.createWithContent(
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
        data: { url: 'http://example.com', target: '_top' },
      },
      '1': {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { url: 'http://localhost:8080', target: '_top' },
      },
    },
  })
);
const editorActionsMock = {
  getEditorState: jest.fn(),
  setEditorState: jest.fn(),
};

describe('Link Plugin', () => {
  it('should create plugin instance without errors', () => {
    const linkPlugin = new LinkPlugin({ title: 'Link' });

    expect(linkPlugin.title).toBe('Link');
  });

  it('should return `draft-js` decorator object', () => {
    const linkPlugin = new LinkPlugin();
    const decorator = linkPlugin.getDecorator();

    expect(decorator.strategy).toEqual(expect.any(Function));
    expect(decorator.component).toEqual(expect.any(Function));
  });

  it('should call callback for `LINK` entities', () => {
    const linkPlugin = new LinkPlugin();
    const decorator = linkPlugin.getDecorator();
    const callbackMock = jest.fn();
    const contentState = initialEditorState.getCurrentContent();

    decorator.strategy(contentState.getFirstBlock(), callbackMock, contentState);

    expect(callbackMock).toHaveBeenCalledTimes(2);
    expect(callbackMock.mock.calls).toEqual([[6, 11], [22, 26]]);
  });

  it('should render empty decorator component if editorActions was not set', () => {
    const linkPlugin = new LinkPlugin();
    const decorator = linkPlugin.getDecorator();
    const Component = decorator.component;

    const component = shallow(<Component />);

    expect(component.type()).toBeNull();
  });

  it('should render decorator component', () => {
    const linkPlugin = new LinkPlugin();
    const decorator = linkPlugin.getDecorator();
    const Component = decorator.component;
    linkPlugin.setEditorActions(editorActionsMock);

    const component = shallow(<Component />);

    expect(component.find('Link')).toHaveLength(1);
    expect(component.find('Link').props().editorActions).toBe(editorActionsMock);
  });

  it('should render empty toolbar item if editorActions was not set', () => {
    const linkPlugin = new LinkPlugin();
    const ToolbarItem = linkPlugin.renderToolbarItem;

    const toolbarItem = shallow(<ToolbarItem />);

    expect(toolbarItem.type()).toBeNull();
  });

  it('should render toolbar item', () => {
    const linkPlugin = new LinkPlugin({ title: 'Link' });
    const ToolbarItem = linkPlugin.renderToolbarItem;
    linkPlugin.setEditorActions(editorActionsMock);

    const toolbarItem = shallow(<ToolbarItem />);

    expect(toolbarItem.find('LinkToolbarItem')).toHaveLength(1);
    expect(toolbarItem.find('LinkToolbarItem').props()).toEqual({
      title: 'Link',
      editorActions: editorActionsMock,
    });
  });

  it('should render empty widget if editorActions was not set', () => {
    const linkPlugin = new LinkPlugin();
    const Widget = linkPlugin.renderWidget;

    const widget = shallow(<Widget />);

    expect(widget.type()).toBeNull();
  });

  it('should render widget', () => {
    const linkPlugin = new LinkPlugin();
    const Widget = linkPlugin.renderWidget;
    linkPlugin.setEditorActions(editorActionsMock);

    const widget = shallow(<Widget />);

    expect(widget.find('LinkWidget')).toHaveLength(1);
    expect(widget.find('LinkWidget').props()).toEqual({ editorActions: editorActionsMock });
  });
});
