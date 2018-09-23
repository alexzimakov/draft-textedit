import React from 'react';
import { shallow } from 'enzyme';
import { EditorState, SelectionState, convertFromRaw } from 'draft-js';
import { EventsManager, EntityUtils } from '../../lib';
import LinkToolbarItem from './LinkToolbarItem';

jest.useFakeTimers();

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
  getEditorState: jest.fn().mockReturnValue(initialEditorState),
  setEditorState: jest.fn(),
};

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(<LinkToolbarItem title="Add link" editorActions={editorActionsMock} />);
}

describe('<LinkToolbarItem /> component', () => {
  afterEach(() => {
    editorActionsMock.getEditorState.mockClear();
    editorActionsMock.setEditorState.mockClear();
  });

  it('should render with necessary elements', () => {
    const linkToolbarItem = renderComponent();

    expect(linkToolbarItem.find('ToolbarButton')).toHaveLength(1);
    expect(linkToolbarItem.find('FontAwesomeIcon')).toHaveLength(1);
  });

  it('should add necessary event listeners when component is mounted', () => {
    jest.spyOn(EventsManager, 'addListener');
    const linkToolbarItem = renderComponent();

    expect(EventsManager.addListener.mock.calls).toEqual([
      ['change-editor-state', linkToolbarItem.instance().handleChangeEditorState],
      ['editor-focus', linkToolbarItem.instance().handleEditorFocus],
      ['editor-blur', linkToolbarItem.instance().handleEditorBlur],
    ]);
  });

  it('should remove event listeners when component is unmounted', () => {
    jest.spyOn(EventsManager, 'removeListener');
    const linkToolbarItem = renderComponent();
    const linkToolbarItemRef = linkToolbarItem.instance();

    linkToolbarItem.unmount();

    expect(EventsManager.removeListener.mock.calls).toEqual([
      ['change-editor-state', linkToolbarItemRef.handleChangeEditorState],
      ['editor-focus', linkToolbarItemRef.handleEditorFocus],
      ['editor-blur', linkToolbarItemRef.handleEditorBlur],
    ]);
  });

  it('should handle `change-editor-state` event', () => {
    const linkToolbarItem = renderComponent();
    EventsManager.dispatchEvent('change-editor-state', initialEditorState);
    linkToolbarItem.update();

    expect(linkToolbarItem.find('ToolbarButton').props().isDisabled).toBeTruthy();

    const selectionState = SelectionState.createEmpty('r8v1').merge({
      anchorOffset: 8,
      focusOffset: 13,
    });
    const editorStateWithSelection = EditorState.acceptSelection(
      initialEditorState,
      selectionState
    );

    EventsManager.dispatchEvent('change-editor-state', editorStateWithSelection);

    expect(linkToolbarItem.find('ToolbarButton').props().isDisabled).toBeFalsy();
  });

  it('should handle `editor-focus` event', () => {
    const linkToolbarItem = renderComponent();
    linkToolbarItem.instance().isLocked = true;

    EventsManager.dispatchEvent('editor-focus');
    jest.runAllTimers();

    expect(linkToolbarItem.instance().isLocked).toBeFalsy();
  });

  it('should handle `editor-blur` event', () => {
    const linkToolbarItem = renderComponent();
    linkToolbarItem.instance().isLocked = false;

    EventsManager.dispatchEvent('editor-blur');

    expect(linkToolbarItem.instance().isLocked).toBeTruthy();
  });

  it('should handle ToolbarButton press', () => {
    const linkToolbarItem = renderComponent();
    const newEditorStateStub = EditorState.createEmpty();
    jest
      .spyOn(EntityUtils, 'createEntity')
      .mockReturnValue({ newEditorState: newEditorStateStub, entityKey: '3' });
    jest.spyOn(EventsManager, 'dispatchEvent');

    linkToolbarItem
      .find('ToolbarButton')
      .props()
      .onPress();
    jest.runAllTimers();

    expect(EntityUtils.createEntity).toHaveBeenCalledWith(initialEditorState, {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: { linkTo: '', url: '', target: '', subject: '' },
    });
    expect(editorActionsMock.setEditorState).toHaveBeenCalledWith(newEditorStateStub);
    expect(EventsManager.dispatchEvent).toHaveBeenCalledWith('create-link-entity', '3');
  });
});
