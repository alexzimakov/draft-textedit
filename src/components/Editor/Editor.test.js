import React from 'react';
import { mount } from 'enzyme';
import { EditorState, RichUtils, CompositeDecorator, convertFromRaw } from 'draft-js';
import { plugins, maxListDepth } from '../../constants/preferences';
import { EventsManager } from '../../lib';
import Editor from './Editor';

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

window.scrollTo = jest.fn();

function renderComponent(props = {}, mountFn = mount) {
  return mountFn(<Editor plugins={plugins} defaultEditorState={initialEditorState} {...props} />);
}

describe('<Editor /> component', () => {
  beforeAll(() => {
    jest.spyOn(EventsManager, 'dispatchEvent');
  });

  afterEach(() => {
    EventsManager.dispatchEvent.mockClear();
  });

  it('should render with necessary elements', () => {
    const editor = renderComponent();

    expect(editor.find('styled__StyledEditor')).toHaveLength(1);
    expect(editor.find('styled__Toolbar')).toHaveLength(1);
    expect(editor.find('styled__ToolbarItems')).toHaveLength(1);
    expect(editor.find('styled__ToolbarItem')).toHaveLength(plugins.length);
    expect(editor.find('styled__EditorContent')).toHaveLength(1);
    expect(editor.find('DraftEditor')).toHaveLength(1);
    expect(editor.find('styled__Widgets')).toHaveLength(1);
    expect(editor.find('styled__WidgetItem')).toHaveLength(plugins.length);
  });

  it('should add necessary event listeners when component is mounted', () => {
    jest.spyOn(window, 'addEventListener');
    const editor = renderComponent();

    expect(window.addEventListener.mock.calls).toEqual(
      expect.arrayContaining([
        ['scroll', editor.instance().handleWindowScroll],
        ['resize', editor.instance().updateToolbarStyle],
      ])
    );
  });

  it('should remove event listeners when the component is unmounted', () => {
    const editor = renderComponent();
    const editorRef = editor.instance();
    jest.spyOn(window, 'removeEventListener');
    editor.unmount();

    expect(window.removeEventListener.mock.calls).toEqual(
      expect.arrayContaining([
        ['scroll', editorRef.handleWindowScroll],
        ['resize', editorRef.updateToolbarStyle],
      ])
    );
  });

  it('should register plugins', () => {
    const fakeDecorator = {
      strategy: jest.fn(),
      component: jest.fn().mockReturnValue(null),
    };
    const fakePlugins = [
      {
        setEditorActions: jest.fn(),
        renderToolbarItem: jest.fn().mockReturnValue(null),
        renderWidget: jest.fn().mockReturnValue(null),
      },
      {
        setEditorActions: jest.fn(),
        getDecorator: jest.fn().mockReturnValue(fakeDecorator),
        renderToolbarItem: jest.fn().mockReturnValue(null),
        renderWidget: jest.fn().mockReturnValue(null),
      },
    ];
    const editorStateWithDecorators = EditorState.createEmpty();
    const decorator = new CompositeDecorator([fakeDecorator]);
    jest.spyOn(EditorState, 'set').mockReturnValue(editorStateWithDecorators);

    const editor = renderComponent({ plugins: fakePlugins });
    const editorRef = editor.instance();

    fakePlugins.forEach(fakePlugin => {
      expect(fakePlugin.setEditorActions).toHaveBeenCalledWith({
        setEditorState: editorRef.setEditorState,
        getEditorState: editorRef.getEditorState,
        focus: editorRef.focus,
        blur: editorRef.blur,
        lock: editorRef.lock,
        unlock: editorRef.unlock,
      });
    });
    expect(fakePlugins[1].getDecorator).toHaveBeenCalled();
    expect(EditorState.set).toHaveBeenCalledWith(initialEditorState, { decorator });
    expect(editor.state().editorState).toBe(editorStateWithDecorators);
  });

  it('should update editor state from props', () => {
    const editor = renderComponent();
    const newEditorState = EditorState.createEmpty();

    editor.setProps({ editorState: newEditorState });

    expect(editor.state().editorState).toBe(newEditorState);
  });

  it('should does not set focus if draftEditorRef is empty', () => {
    const editor = renderComponent({}, mount);
    const editorRef = editor.instance();
    editorRef.draftEditorRef.current = null;

    expect(() => {
      editorRef.focus();
    }).not.toThrow();
  });

  it('should set focus', () => {
    const editor = renderComponent();
    const editorRef = editor.instance();
    jest.spyOn(editorRef.draftEditorRef.current, 'focus');

    editorRef.focus();

    expect(editorRef.draftEditorRef.current.focus).toHaveBeenCalled();
  });

  it('should does not set blur if draftEditorRef is empty', () => {
    const editor = renderComponent({}, mount);
    const editorRef = editor.instance();
    editorRef.draftEditorRef.current = null;

    expect(() => {
      editorRef.blur();
    }).not.toThrow();
  });

  it('should set blur', () => {
    const editor = renderComponent();
    const editorRef = editor.instance();
    jest.spyOn(editorRef.draftEditorRef.current, 'blur');

    editorRef.blur();

    expect(editorRef.draftEditorRef.current.blur).toHaveBeenCalled();
  });

  it('should lock editor', () => {
    const editor = renderComponent();

    editor.instance().lock();
    editor.update();

    expect(editor.find('DraftEditor').props().readOnly).toBeTruthy();
  });

  it('should unlock editor', () => {
    const editor = renderComponent();
    editor.setState({ isLocked: true });
    editor.update();

    editor.instance().unlock();
    editor.update();

    expect(editor.find('DraftEditor').props().readOnly).toBeFalsy();
  });

  it('should handle `EditorContent` mouse down', () => {
    const editor = renderComponent();
    const eventMock = {
      preventDefault: jest.fn(),
      target: editor.instance().editorContentRef.current,
    };
    editor.instance().focus = jest.fn();

    editor
      .find('styled__EditorContent')
      .props()
      .onMouseDown(eventMock);
    delete eventMock.target;
    editor
      .find('styled__EditorContent')
      .props()
      .onMouseDown(eventMock);

    expect(eventMock.preventDefault).toHaveBeenCalledTimes(1);
    expect(editor.instance().focus).toHaveBeenCalledTimes(2);
  });

  it('should handle editor focus', () => {
    const editor = renderComponent();

    editor
      .find('DraftEditor')
      .props()
      .onFocus();
    editor.update();

    expect(EventsManager.dispatchEvent).toHaveBeenCalledWith('editor-focus');
    expect(editor.find('styled__StyledEditor').props().hasFocus).toBeTruthy();
  });

  it('should handle editor blur', () => {
    const editor = renderComponent();

    editor
      .find('DraftEditor')
      .props()
      .onBlur();
    editor.update();

    expect(EventsManager.dispatchEvent).toHaveBeenCalledWith('editor-blur');
    expect(editor.find('styled__StyledEditor').props().hasFocus).toBeFalsy();
  });

  it('should handle editor state change', () => {
    const editor = renderComponent();
    const newEditorState = EditorState.createEmpty();

    editor
      .find('DraftEditor')
      .props()
      .onChange(newEditorState);
    editor.update();

    expect(EventsManager.dispatchEvent).toHaveBeenCalledWith('change-editor-state', newEditorState);
  });

  it('should call `onChange` callback when editor state is changed', () => {
    const onChangeMock = jest.fn();
    const editor = renderComponent({ onChange: onChangeMock });
    const newEditorState = EditorState.createEmpty();

    editor
      .find('DraftEditor')
      .props()
      .onChange(newEditorState);
    editor.update();

    expect(onChangeMock).toHaveBeenCalledWith(newEditorState);
  });

  it('should handle known key command', () => {
    const editor = renderComponent();
    const newEditorState = EditorState.createEmpty();
    jest.spyOn(RichUtils, 'handleKeyCommand').mockReturnValueOnce(newEditorState);

    const result = editor
      .find('DraftEditor')
      .props()
      .handleKeyCommand('bold', initialEditorState);
    editor.update();

    expect(result).toBe('handled');
    expect(RichUtils.handleKeyCommand).toHaveBeenCalledWith(initialEditorState, 'bold');
    expect(editor.find('DraftEditor').props().editorState).toBe(newEditorState);
  });

  it('should handle unknown key command', () => {
    const editor = renderComponent();
    const currentEditorState = editor.state().editorState;
    jest.spyOn(RichUtils, 'handleKeyCommand').mockReturnValueOnce(null);

    const result = editor
      .find('DraftEditor')
      .props()
      .handleKeyCommand('unknown', initialEditorState);
    editor.update();

    expect(result).toBe('not-handled');
    expect(RichUtils.handleKeyCommand).toHaveBeenCalledWith(initialEditorState, 'unknown');
    expect(editor.find('DraftEditor').props().editorState).toBe(currentEditorState);
  });

  it('should handle tab press', () => {
    const editor = renderComponent();
    const keyboardEvent = new KeyboardEvent('keydown');
    const currentEditorState = editor.state().editorState;
    const newEditorState = EditorState.createEmpty();
    jest.spyOn(RichUtils, 'onTab').mockReturnValueOnce(newEditorState);

    editor
      .find('DraftEditor')
      .props()
      .onTab(keyboardEvent);
    editor.update();

    expect(RichUtils.onTab).toHaveBeenCalledWith(keyboardEvent, currentEditorState, maxListDepth);
    expect(editor.find('DraftEditor').props().editorState).toBe(newEditorState);
  });

  it('should fix toolbar on top', () => {
    const editor = renderComponent();
    const editorInstance = editor.instance();
    const editorRefStub = {
      getBoundingClientRect: jest.fn().mockReturnValue({ top: -30, bottom: 800 }),
      offsetLeft: 200,
      clientLeft: 1,
      clientWidth: 600,
    };
    editorInstance.editorRef.current = editorRefStub;
    editorInstance.toolbarRef.current = { offsetHeight: 48 };

    editor.instance().updateToolbarStyle();
    editor.update();

    expect(editor.find('styled__Toolbar').props().style).toEqual({
      position: 'fixed',
      top: 0,
      bottom: 'auto',
      left: editorRefStub.offsetLeft + editorRefStub.clientLeft,
      maxWidth: editorRefStub.clientWidth,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
    });
  });

  it('should fix toolbar on bottom', () => {
    const editor = renderComponent();
    const editorInstance = editor.instance();
    const editorRefStub = {
      getBoundingClientRect: jest.fn().mockReturnValue({ top: -710, bottom: 20 }),
      offsetLeft: 200,
      clientLeft: 1,
      clientWidth: 600,
    };
    editorInstance.editorRef.current = editorRefStub;
    editorInstance.toolbarRef.current = { offsetHeight: 48 };

    editor.instance().updateToolbarStyle();
    editor.update();

    expect(editor.find('styled__Toolbar').props().style).toEqual({
      position: 'absolute',
      top: 'auto',
      bottom: 0,
      left: 0,
      maxWidth: 'none',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
      boxShadow: 'none',
    });
  });

  it('should display toolbar with default style', () => {
    const editor = renderComponent();
    const editorInstance = editor.instance();
    editorInstance.editorRef.current = {
      getBoundingClientRect: jest.fn().mockReturnValue({ top: 30, bottom: 860 }),
      offsetLeft: 200,
      clientLeft: 1,
      clientWidth: 600,
    };
    editorInstance.toolbarRef.current = { offsetHeight: 48 };

    editor.instance().updateToolbarStyle();
    editor.update();

    expect(editor.find('styled__Toolbar').props().style).toEqual({
      position: 'absolute',
      top: 0,
      bottom: 'auto',
      left: 0,
      maxWidth: 'none',
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      boxShadow: 'none',
    });
  });

  it('should not update toolbar style if editor or toolbar ref is empty', () => {
    const editor = renderComponent();
    const editorInstance = editor.instance();
    editorInstance.toolbarRef.current = null;

    editor.instance().updateToolbarStyle();
    editor.update();

    expect(editor.find('styled__Toolbar').props().style).toEqual({
      position: 'absolute',
      top: 0,
      bottom: 'auto',
      left: 0,
      maxWidth: 'none',
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      boxShadow: 'none',
    });
  });

  it('should handle window scrolling', () => {
    const editor = renderComponent();
    const editorInstance = editor.instance();
    jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    editorInstance.updateToolbarStyle = jest.fn();

    editorInstance.handleWindowScroll();

    expect(editorInstance.updateToolbarStyle).not.toHaveBeenCalled();
    expect(editorInstance.ticking).toBeTruthy();
    expect(window.requestAnimationFrame).toHaveBeenCalledWith(expect.any(Function));

    const [[callback]] = window.requestAnimationFrame.mock.calls;
    editorInstance.handleWindowScroll();
    editorInstance.handleWindowScroll();
    callback();

    expect(editorInstance.updateToolbarStyle).toHaveBeenCalled();
    expect(editorInstance.updateToolbarStyle).toHaveBeenCalledTimes(1);
    expect(editorInstance.ticking).toBeFalsy();
  });
});
