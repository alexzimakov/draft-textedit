import React from 'react';
import { shallow } from 'enzyme';
import { EditorState, Modifier, RichUtils, convertFromRaw } from 'draft-js';
import { maxListDepth } from './preferences';
import Editor from './Editor';

const editorState = EditorState.createWithContent(
  convertFromRaw({
    blocks: [
      {
        key: '255q8',
        text: 'Lorem ipsum.',
        type: 'header-one',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: '112b9',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  })
);

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(<Editor {...props} />);
}

describe('<Editor /> component', () => {
  it('should renders with necessary components', () => {
    const editor = renderComponent();

    expect(editor.find('Toolbar')).toHaveLength(1);
    expect(editor.find('DraftEditor')).toHaveLength(1);
  });

  it('should adds class when editor has focus', () => {
    const editor = renderComponent();

    editor
      .find('DraftEditor')
      .props()
      .onFocus();
    editor.update();
    expect(
      editor.find('.DraftTextEditEditor').hasClass('DraftTextEditEditor_hasFocus')
    ).toBeTruthy();
  });

  it('should remove class when editor has no focus', () => {
    const editor = renderComponent();

    editor
      .find('DraftEditor')
      .props()
      .onBlur();
    editor.update();
    expect(
      editor.find('.DraftTextEditEditor').hasClass('DraftTextEditEditor_hasFocus')
    ).toBeFalsy();
  });

  it('should hides placeholder when user change block type', () => {
    const editor = renderComponent();

    editor
      .find('Toolbar')
      .props()
      .setBlockType('header-one');
    editor.update();
    expect(
      editor.find('.DraftTextEditEditor').hasClass('DraftTextEditEditor_hidePlaceholder')
    ).toBeTruthy();
  });

  it('should cancels last command', () => {
    jest.spyOn(EditorState, 'undo');
    const editor = renderComponent();

    editor
      .find('DraftEditor')
      .props()
      .onChange(editorState);
    editor.update();
    editor
      .find('Toolbar')
      .props()
      .undo();
    expect(EditorState.undo).toHaveBeenCalledWith(editorState);
  });

  it('should redo last canceled command', () => {
    jest.spyOn(EditorState, 'redo');
    const editor = renderComponent();
    const canceledEditorState = EditorState.undo(editorState);

    editor
      .find('DraftEditor')
      .props()
      .onChange(canceledEditorState);
    editor.update();
    editor
      .find('Toolbar')
      .props()
      .redo();
    expect(EditorState.undo).toHaveBeenCalledWith(canceledEditorState);
  });

  it('should sets new block type', () => {
    jest.spyOn(EditorState, 'push');
    jest.spyOn(Modifier, 'setBlockType');
    const editor = renderComponent();
    const contentState = Modifier.setBlockType(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      'code'
    );

    editor.setState({ editorState });
    editor.update();
    editor
      .find('Toolbar')
      .props()
      .setBlockType('code');
    expect(Modifier.setBlockType).toHaveBeenCalledWith(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      'code'
    );
    expect(EditorState.push).toHaveBeenCalledWith(editorState, contentState, 'change-block-type');
  });

  it('should toggles inline style', () => {
    jest.spyOn(RichUtils, 'toggleInlineStyle');
    const editor = renderComponent();

    editor.setState({ editorState });
    editor.update();
    editor
      .find('Toolbar')
      .props()
      .toggleInlineStyle('BOLD');
    expect(RichUtils.toggleInlineStyle).toHaveBeenCalledWith(editorState, 'BOLD');
  });

  it('should handles key shortcut press', () => {
    const editor = renderComponent();

    jest.spyOn(RichUtils, 'handleKeyCommand').mockImplementation((state, command) => {
      expect(state).toBeInstanceOf(EditorState);
      expect(command).toBe('bold');

      return RichUtils.toggleInlineStyle(editorState, 'BOLD');
    });
    expect(
      editor
        .find('DraftEditor')
        .props()
        .handleKeyCommand('bold', editorState)
    ).toBe('handled');

    jest.spyOn(RichUtils, 'handleKeyCommand').mockImplementation((state, command) => {
      expect(state).toBeInstanceOf(EditorState);
      expect(command).toBe('italic');

      return null;
    });
    expect(
      editor
        .find('DraftEditor')
        .props()
        .handleKeyCommand('italic', editorState)
    ).toBe('not-handled');
  });

  it('should handles tab key press', () => {
    jest.spyOn(RichUtils, 'onTab');
    const event = new Event('keydown');
    const editor = renderComponent();

    editor.setState({ editorState });
    editor.update();
    editor
      .find('DraftEditor')
      .props()
      .onTab(event);
    expect(RichUtils.onTab).toHaveBeenCalledWith(event, editorState, maxListDepth);
  });
});
