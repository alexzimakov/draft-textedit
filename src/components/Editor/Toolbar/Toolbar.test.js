import React from 'react';
import { shallow, mount } from 'enzyme';
import { EditorState } from 'draft-js';
import * as preferences from '../preferences';
import Toolbar from './Toolbar';

const editorRefDummy = { current: window.document.createElement('div') };
const setBlockTypeStub = jest.fn();
const toggleInlineStyleStub = jest.fn();
const undoStub = jest.fn();
const redoStub = jest.fn();
function renderComponent(
  {
    blockTypeOptions = preferences.blockTypeOptions,
    inlineStyleControls = preferences.inlineStyleControls,
    editorRef = editorRefDummy,
    editorHasFocus = false,
    editorState = EditorState.createEmpty(),
    setBlockType = setBlockTypeStub,
    toggleInlineStyle = toggleInlineStyleStub,
    undo = undoStub,
    redo = redoStub,
    ...otherProps
  } = {},
  mountFn = shallow
) {
  return mountFn(
    <Toolbar
      blockTypeOptions={blockTypeOptions}
      inlineStyleControls={inlineStyleControls}
      editorRef={editorRef}
      editorHasFocus={editorHasFocus}
      editorState={editorState}
      setBlockType={setBlockType}
      toggleInlineStyle={toggleInlineStyle}
      undo={undo}
      redo={redo}
      {...otherProps}
    />
  );
}

describe('<Toolbar /> component', () => {
  afterEach(() => {
    setBlockTypeStub.mockClear();
    toggleInlineStyleStub.mockClear();
    undoStub.mockClear();
    redoStub.mockClear();
  });

  it('should renders with necessary components', () => {
    const toolbar = renderComponent();

    expect(toolbar.find('ControlsGroup')).toHaveLength(3);
    expect(toolbar.find('BlockTypeSelect')).toHaveLength(1);
    expect(toolbar.find('StyleButton')).toHaveLength(7);
  });

  it('should adds resize and scroll event listeners on `componentDidMount` call', () => {
    jest.spyOn(window, 'addEventListener');
    const toolbar = renderComponent();
    const { updateEditorBoundaries } = toolbar.instance();

    expect(window.addEventListener).toHaveBeenCalledTimes(2);
    expect(window.addEventListener.mock.calls).toEqual([
      ['scroll', updateEditorBoundaries],
      ['resize', updateEditorBoundaries],
    ]);
  });

  it('should removes resize and scroll event listeners on `componentDidMount` call', () => {
    jest.spyOn(window, 'removeEventListener');
    const toolbar = renderComponent();
    const { updateEditorBoundaries } = toolbar.instance();

    toolbar.unmount();
    expect(window.removeEventListener).toHaveBeenCalledTimes(2);
    expect(window.removeEventListener.mock.calls).toEqual([
      ['scroll', updateEditorBoundaries],
      ['resize', updateEditorBoundaries],
    ]);
  });

  it("should updates state's `editorBoundaries` property when user scrolling page", () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
    const toolbar = renderComponent({ editorHasFocus: true }, mount);

    window.dispatchEvent(new Event('scroll'));
    expect(toolbar.state().editorBoundaries).toEqual({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    });
  });

  it("should updates state's `editorBoundaries` property when user resize page", () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
    const toolbar = renderComponent({ editorHasFocus: true }, mount);

    window.dispatchEvent(new Event('resize'));
    expect(toolbar.state().editorBoundaries).toEqual({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    });
  });

  it('should cancel current animation frame', () => {
    jest.spyOn(window, 'requestAnimationFrame').mockReturnValue('animationFrameId');
    jest.spyOn(window, 'cancelAnimationFrame');
    renderComponent({}, mount);

    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith('animationFrameId');
  });

  it('should renders toolbar with correct position when state updating', () => {
    const toolbar = renderComponent({ editorHasFocus: true }, mount);
    jest
      .spyOn(toolbar.instance().toolbarRef.current, 'getBoundingClientRect')
      .mockReturnValue({ height: 40 });

    toolbar.setState({ editorBoundaries: { top: -30, bottom: 100, left: 100, width: 600 } });
    toolbar.update();
    expect(
      toolbar.find('.DraftTextEditToolbar').hasClass('DraftTextEditToolbar_sticky_top')
    ).toBeTruthy();
    expect(toolbar.find('.DraftTextEditToolbar').props().style).toEqual({
      left: 101,
      width: 598,
    });

    toolbar.setState({ editorBoundaries: { top: -40, bottom: -100, left: 100, width: 600 } });
    toolbar.update();
    expect(
      toolbar.find('.DraftTextEditToolbar').hasClass('DraftTextEditToolbar_sticky_bottom')
    ).toBeTruthy();
    expect(toolbar.find('.DraftTextEditToolbar').props().style).toEqual({});
  });

  it('should calls `setBlockType` callback', () => {
    const toolbar = renderComponent();

    toolbar
      .find('BlockTypeSelect')
      .at(0)
      .props()
      .onChange('code');
    expect(setBlockTypeStub).toHaveBeenCalledWith('code');
  });

  it('should calls `toggleInlineStyle` callback', () => {
    const toolbar = renderComponent();

    toolbar
      .find('StyleButton')
      .at(0)
      .props()
      .onPress();
    expect(toggleInlineStyleStub).toHaveBeenCalledWith('BOLD');
  });

  it('should calls `undo` callback', () => {
    const toolbar = renderComponent();

    toolbar
      .find('StyleButton')
      .at(5)
      .props()
      .onPress();
    expect(undoStub).toHaveBeenCalled();
  });

  it('should calls `redo` callback', () => {
    const toolbar = renderComponent();

    toolbar
      .find('StyleButton')
      .at(6)
      .props()
      .onPress();
    expect(redoStub).toHaveBeenCalled();
  });
});
