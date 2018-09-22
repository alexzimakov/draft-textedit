import React from 'react';
import { shallow } from 'enzyme';
import { EditorState, convertFromRaw } from 'draft-js';
import { EventsManager, EntityUtils } from '../../lib';
import LinkWidget from './LinkWidget';

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
  lock: jest.fn(),
  unlock: jest.fn(),
};

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(<LinkWidget editorActions={editorActionsMock} {...props} />);
}

describe('<LinkWidget /> component', () => {
  beforeAll(() => {
    jest.spyOn(EntityUtils, 'getEntityData');
    jest.spyOn(EntityUtils, 'updateEntityData');
  });
  afterEach(() => {
    editorActionsMock.getEditorState.mockClear();
    editorActionsMock.setEditorState.mockClear();
    editorActionsMock.lock.mockClear();
    editorActionsMock.unlock.mockClear();
    EntityUtils.getEntityData.mockClear();
    EntityUtils.updateEntityData.mockClear();
  });

  it('should render with necessary elements', () => {
    const linkWidget = renderComponent();

    expect(linkWidget.find('Dialog')).toHaveLength(1);
    expect(linkWidget.find('input[type="radio"]')).toHaveLength(2);
    expect(linkWidget.find('TextField')).toHaveLength(1);
    expect(linkWidget.find('Select')).toHaveLength(1);
  });

  it('should render with necessary fields when lintTo is `mailto:`', () => {
    const linkWidget = renderComponent();
    linkWidget.setState({
      formData: { ...linkWidget.state().formData, linkTo: 'mailto:' },
    });
    linkWidget.update();

    expect(linkWidget.find('TextField')).toHaveLength(2);
    expect(linkWidget.find('Select')).toHaveLength(0);
  });

  it('should add necessary event listeners when component is mounted', () => {
    jest.spyOn(EventsManager, 'addListener');
    jest.spyOn(window, 'addEventListener');
    const linkWidget = renderComponent();

    expect(window.addEventListener.mock.calls).toEqual([
      ['keydown', linkWidget.instance().handleEscapeKeydown],
    ]);
    expect(EventsManager.addListener.mock.calls).toEqual([
      ['create-link-entity', linkWidget.instance().handleCreateLinkEntity],
      ['edit-link-entity', linkWidget.instance().handleEditLinkEntity],
    ]);
  });

  it('should remove event listeners when component is unmounted', () => {
    jest.spyOn(window, 'removeEventListener');
    jest.spyOn(EventsManager, 'removeListener');
    const linkWidget = renderComponent();
    const linkWidgetRef = linkWidget.instance();

    linkWidget.unmount();

    expect(window.removeEventListener.mock.calls).toEqual([
      ['keydown', linkWidgetRef.handleEscapeKeydown],
    ]);
    expect(EventsManager.removeListener.mock.calls).toEqual([
      ['create-link-entity', linkWidgetRef.handleCreateLinkEntity],
      ['edit-link-entity', linkWidgetRef.handleEditLinkEntity],
    ]);
  });

  it('should open dialog', () => {
    const linkWidget = renderComponent();
    editorActionsMock.lock.mockImplementationOnce(callback => {
      expect(callback).toEqual(expect.any(Function));
      callback();
    });

    linkWidget.instance().openDialog('1');
    linkWidget.update();

    expect(EntityUtils.getEntityData).toHaveBeenCalledWith(
      '1',
      initialEditorState.getCurrentContent(),
      ['linkTo', 'url', 'target', 'subject']
    );
    expect(linkWidget.state().formData).toEqual({
      linkTo: '',
      url: 'http://example.com',
      target: '_top',
      subject: '',
    });
    expect(editorActionsMock.lock).toHaveBeenCalled();
    expect(linkWidget.find('Dialog').props().isOpen).toBeTruthy();
  });

  it('should close dialog', () => {
    const linkWidget = renderComponent();
    editorActionsMock.unlock.mockImplementationOnce(callback => {
      expect(callback).toEqual(expect.any(Function));
      callback();
    });
    linkWidget.instance().initialSelectionState = initialEditorState.getSelection();
    linkWidget.setState({
      isDialogOpen: true,
      formData: { linkTo: '', url: 'http://example.com', target: '_top', subject: '' },
    });
    linkWidget.update();

    linkWidget.instance().closeDialog();

    expect(linkWidget.state().formData).toEqual({ linkTo: '', url: '', target: '', subject: '' });
    expect(editorActionsMock.unlock).toHaveBeenCalled();
    expect(editorActionsMock.setEditorState).toHaveBeenCalledWith(
      EditorState.forceSelection(initialEditorState, linkWidget.instance().initialSelectionState)
    );
    expect(linkWidget.find('Dialog').props().isOpen).toBeFalsy();
  });

  it('should handle `create-link-entity` event', () => {
    const linkWidget = renderComponent();
    jest.spyOn(linkWidget.instance(), 'openDialog');

    EventsManager.dispatchEvent('create-link-entity', '3');

    expect(linkWidget.instance().openDialog).toHaveBeenCalledWith('3');
    expect(linkWidget.instance().initialSelectionState).toBe(initialEditorState.getSelection());
  });

  it('should handle `edit-link-entity` event', () => {
    const linkWidget = renderComponent();
    jest.spyOn(linkWidget.instance(), 'openDialog');

    EventsManager.dispatchEvent('edit-link-entity', '1');

    expect(linkWidget.instance().openDialog).toHaveBeenCalledWith('1');
  });

  it('should handle `Esc` key press', () => {
    const linkWidget = renderComponent();
    const keyboardEvent = new KeyboardEvent('keydown');
    jest.spyOn(linkWidget.instance(), 'closeDialog');
    linkWidget.setState({ isDialogOpen: true });

    Object.defineProperty(keyboardEvent, 'key', { value: 'Tab', configurable: true });
    window.dispatchEvent(keyboardEvent);
    Object.defineProperty(keyboardEvent, 'key', { value: 'Escape', configurable: true });
    window.dispatchEvent(keyboardEvent);

    expect(linkWidget.instance().closeDialog).toHaveBeenCalledTimes(1);
  });

  it("should close dialog when press on dialog's cancel button", () => {
    const linkWidget = renderComponent();
    jest.spyOn(linkWidget.instance(), 'closeDialog');

    linkWidget
      .find('Dialog')
      .props()
      .onCancelPress();

    expect(linkWidget.instance().closeDialog).toHaveBeenCalled();
  });

  it("should close dialog when press on dialog's backdrop", () => {
    const linkWidget = renderComponent();
    jest.spyOn(linkWidget.instance(), 'closeDialog');

    linkWidget
      .find('Dialog')
      .props()
      .onBackdropPress();

    expect(linkWidget.instance().closeDialog).toHaveBeenCalled();
  });

  it('should handle input change', () => {
    const linkWidget = renderComponent();
    const inputEvent = new Event('input');
    Object.defineProperty(inputEvent, 'target', {
      value: { name: 'url', value: 'http://test.local' },
    });

    linkWidget
      .find('TextField')
      .props()
      .onChange(inputEvent);

    expect(linkWidget.state().formData).toEqual({
      linkTo: '',
      url: 'http://test.local',
      target: '',
      subject: '',
    });
  });

  it('should handle form submit', () => {
    const linkWidget = renderComponent();
    const eventMock = { preventDefault: jest.fn() };
    const formData = { linkTo: '', url: 'http://test.local', target: '_self', subject: '' };
    const newEditorState = EditorState.createEmpty();
    jest.spyOn(linkWidget.instance(), 'closeDialog');
    EntityUtils.updateEntityData.mockReturnValueOnce(newEditorState);
    editorActionsMock.setEditorState.mockImplementationOnce((editorState, callback) => {
      expect(editorState).toEqual(newEditorState);
      expect(callback).toEqual(expect.any(Function));
      callback();
    });
    linkWidget.setState({ entityKey: '13', formData: formData });

    linkWidget
      .find('styled__Form')
      .props()
      .onSubmit(eventMock);

    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(EntityUtils.updateEntityData).toHaveBeenCalledWith('13', initialEditorState, formData);
    expect(editorActionsMock.setEditorState).toHaveBeenCalled();
    expect(linkWidget.instance().closeDialog).toHaveBeenCalled();
  });

  it('should not handle form submit if entity key is empty', () => {
    const linkWidget = renderComponent();
    jest.spyOn(linkWidget.instance(), 'closeDialog');
    jest.spyOn(EntityUtils, 'updateEntityData');

    linkWidget
      .find('styled__Form')
      .props()
      .onSubmit();

    expect(EntityUtils.updateEntityData).not.toHaveBeenCalled();
    expect(editorActionsMock.setEditorState).not.toHaveBeenCalled();
    expect(linkWidget.instance().closeDialog).not.toHaveBeenCalled();
  });
});
