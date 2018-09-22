import React from 'react';
import { mount } from 'enzyme';
import { EditorState, convertFromRaw } from 'draft-js';
import { EventsManager, Utils, EntityUtils } from '../../lib';
import Link from './Link';

jest.useFakeTimers();

const dummyEditorState = EditorState.createWithContent(
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
const dummyDecoratedText = 'ipsum dolor';
const editorActionsMock = {
  getEditorState: jest.fn().mockReturnValue(dummyEditorState),
  setEditorState: jest.fn(),
};

function renderComponent(props = {}, mountFn = mount) {
  return mountFn(
    <Link
      editorActions={editorActionsMock}
      contentState={dummyEditorState.getCurrentContent()}
      decoratedText={dummyDecoratedText}
      entityKey="1"
      offsetKey="abc"
      {...props}>
      {dummyDecoratedText}
    </Link>
  );
}

describe('<Link /> component', () => {
  afterEach(() => {
    editorActionsMock.getEditorState.mockClear();
    editorActionsMock.setEditorState.mockClear();
  });

  it('should render with necessary elements and children', () => {
    const link = renderComponent();

    expect(link.find('styled__Anchor')).toHaveLength(1);
    expect(link.find('Dropdown')).toHaveLength(1);
    expect(link.find('styled__Actions')).toHaveLength(1);
    expect(link.find('styled__ActionButton')).toHaveLength(3);
  });

  it('should add necessary event listeners when component is mounted', () => {
    jest.spyOn(EventsManager, 'addListener');
    const link = renderComponent();

    expect(EventsManager.addListener.mock.calls).toEqual([
      ['create-link-entity', link.instance().handleCreateLinkEntity],
      ['change-editor-state', link.instance().handleChangeEditorState],
      ['editor-focus', link.instance().handleEditorFocus],
      ['editor-blur', link.instance().handleEditorBlur],
    ]);
  });

  it('should remove event listeners and clear current timeoutId when component is unmounted', () => {
    jest.spyOn(window, 'clearTimeout');
    jest.spyOn(EventsManager, 'removeListener');
    const link = renderComponent();
    const linkRef = link.instance();
    linkRef.timeoutId = 13;
    link.unmount();

    expect(window.clearTimeout).toHaveBeenCalledWith(13);
    expect(EventsManager.removeListener.mock.calls).toEqual([
      ['create-link-entity', linkRef.handleCreateLinkEntity],
      ['change-editor-state', linkRef.handleChangeEditorState],
      ['editor-focus', linkRef.handleEditorFocus],
      ['editor-blur', linkRef.handleEditorBlur],
    ]);
  });

  it('should handle `create-link-entity` event', () => {
    const link = renderComponent();
    EventsManager.dispatchEvent('create-link-entity', '1');
    jest.runAllTimers();
    link.update();

    expect(link.find('Dropdown').props().isOpen).toBeTruthy();

    link.setState({ isDropdownOpen: false });
    link.update();
    EventsManager.dispatchEvent('create-link-entity', '2');
    jest.runAllTimers();
    link.update();

    expect(link.find('Dropdown').props().isOpen).toBeFalsy();
  });

  it('should handle `change-editor-state` event', () => {
    const link = renderComponent();
    const passedEditorState = EditorState.createEmpty();
    jest.spyOn(EntityUtils, 'getCurrentEntityKey').mockReturnValue('1');
    EventsManager.dispatchEvent('change-editor-state', passedEditorState);
    jest.runAllTimers();
    link.update();

    expect(EntityUtils.getCurrentEntityKey).toHaveBeenCalledWith(passedEditorState);
    expect(link.find('Dropdown').props().isOpen).toBeTruthy();

    jest.spyOn(EntityUtils, 'getCurrentEntityKey').mockReturnValue('2');
    EventsManager.dispatchEvent('change-editor-state', passedEditorState);
    jest.runAllTimers();
    link.update();

    expect(EntityUtils.getCurrentEntityKey).toHaveBeenCalledWith(passedEditorState);
    expect(link.find('Dropdown').props().isOpen).toBeFalsy();
  });

  it('should handle `editor-focus` event', () => {
    const link = renderComponent();
    link.instance().isLocked = true;
    EventsManager.dispatchEvent('editor-focus');

    expect(link.instance().isLocked).toBeFalsy();
  });

  it('should handle `editor-blur` event', () => {
    const link = renderComponent();
    EventsManager.dispatchEvent('editor-blur');

    expect(link.instance().isLocked).toBeTruthy();
  });

  it('should open URL in new tab when open button press', () => {
    const link = renderComponent();
    const event = { preventDefault: jest.fn() };
    jest.spyOn(Utils, 'openUrl').mockImplementation(url => {
      expect(url).toBe('http://example.com');
    });
    link
      .find('styled__ActionButton')
      .at(0)
      .props()
      .onMouseDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(Utils.openUrl).toHaveBeenCalled();
  });

  it('should open edit dialog when edit button press', () => {
    const link = renderComponent();
    const event = { preventDefault: jest.fn() };
    jest.spyOn(EventsManager, 'dispatchEvent').mockImplementation(eventName => {
      expect(eventName).toBe('edit-link-entity');
    });
    link
      .find('styled__ActionButton')
      .at(1)
      .props()
      .onMouseDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(EventsManager.dispatchEvent).toHaveBeenCalled();
  });

  it('should remove entity when remove button press', () => {
    const link = renderComponent();
    const event = { preventDefault: jest.fn() };
    const expectedState = EditorState.createEmpty();
    jest.spyOn(EntityUtils, 'removeEntity').mockImplementation((entityKey, editorState) => {
      expect(entityKey).toBe('1');
      expect(editorState).toEqual(dummyEditorState);

      return expectedState;
    });
    link.setState({ isDropdownOpen: true });
    link.update();
    link
      .find('styled__ActionButton')
      .at(2)
      .props()
      .onMouseDown(event);
    jest.runAllTimers();
    link.update();

    expect(editorActionsMock.setEditorState).toHaveBeenCalledWith(expectedState);
    expect(link.find('Dropdown').props().isOpen).toBeFalsy();
  });
});
