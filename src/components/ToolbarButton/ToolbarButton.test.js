import React from 'react';
import { mount } from 'enzyme';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faBold from '@fortawesome/fontawesome-free-solid/faBold';
import ToolbarButton from './ToolbarButton';

function renderComponent({ title = 'test', ...otherProps } = {}, mountFn = mount) {
  return mountFn(
    <ToolbarButton title={title} {...otherProps}>
      <FontAwesomeIcon icon={faBold} />
    </ToolbarButton>
  );
}

describe('<ToolbarButton /> component', () => {
  it('should render with necessary components and children', () => {
    const toolbarButton = renderComponent();

    expect(toolbarButton.find('styled__StyledButton')).toHaveLength(1);
    expect(toolbarButton.find('styled__Title')).toHaveLength(1);
    expect(toolbarButton.contains(<FontAwesomeIcon icon={faBold} />)).toBeTruthy();
  });

  it("should add title's root element to HTML body when the component is mounted", () => {
    const toolbarButton = renderComponent();

    expect(window.document.body.contains(toolbarButton.instance().titleRoot)).toBeTruthy();
  });

  it("should remove title's root element from HTML body when the component is unmounted", () => {
    const toolbarButton = renderComponent();
    const titleRoot = toolbarButton.instance().titleRoot;

    toolbarButton.unmount();

    expect(window.document.body.contains(titleRoot)).toBeFalsy();
  });

  it('should add root element to HTML body', () => {
    const toolbarButton = renderComponent();

    expect(window.document.body.contains(toolbarButton.instance().titleRoot)).toBeTruthy();
  });

  it('should render without title if `title` property is falsy or button is disabled', () => {
    const toolbarButton = renderComponent({ title: '' });

    expect(toolbarButton.find('styled__Title')).toHaveLength(0);

    toolbarButton.setProps({ title: 'test', isDisabled: true });
    toolbarButton.update();

    expect(toolbarButton.find('styled__Title')).toHaveLength(0);
  });

  it('should not throw an error if `onPress` is not given', () => {
    const toolbarButton = renderComponent();

    expect(() => {
      toolbarButton
        .find('styled__StyledButton')
        .props()
        .onMouseDown(new MouseEvent('mousedown'));
    }).not.toThrow();
  });

  it('should call `onPress` callback', () => {
    const onPress = jest.fn();
    const event = new MouseEvent('mousedown');
    const toolbarButton = renderComponent({ onPress });

    jest.spyOn(event, 'preventDefault');
    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onMouseDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onPress).toHaveBeenCalledWith(event);
  });

  it('should call `onFocus` callback', () => {
    const onFocus = jest.fn();
    const event = new FocusEvent('focus');
    const toolbarButton = renderComponent({ onFocus });

    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onFocus(event);

    expect(onFocus).toHaveBeenCalledWith(event);
  });

  it('should call `onBlur` callback', () => {
    const onBlur = jest.fn();
    const event = new FocusEvent('blur');
    const toolbarButton = renderComponent({ onBlur });

    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onBlur(event);

    expect(onBlur).toHaveBeenCalledWith(event);
  });

  it('should get title style', () => {
    Object.defineProperty(window.document.documentElement, 'clientWidth', { value: 200 });
    Object.defineProperty(window.document.documentElement, 'clientHeight', { value: 200 });
    const toolbarButton = renderComponent();
    const toolbarButtonRef = toolbarButton.instance();

    jest
      .spyOn(toolbarButtonRef.titleRef.current, 'getBoundingClientRect')
      .mockReturnValue({ width: 60, height: 20 });

    jest
      .spyOn(toolbarButtonRef.buttonRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 100, right: 60, bottom: 120, left: 40 });
    expect(toolbarButtonRef.getTitleStyle()).toEqual({
      maxWidth: 'none',
      transform: `translate(20px, 124px)`,
      pointerEvents: 'all',
      opacity: 1,
    });

    jest
      .spyOn(toolbarButtonRef.buttonRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 100, right: 30, bottom: 120, left: 10 });
    expect(toolbarButtonRef.getTitleStyle()).toEqual({
      maxWidth: 'none',
      transform: `translate(10px, 124px)`,
      pointerEvents: 'all',
      opacity: 1,
    });

    jest
      .spyOn(toolbarButtonRef.buttonRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 100, right: 190, bottom: 120, left: 170 });
    expect(toolbarButtonRef.getTitleStyle()).toEqual({
      maxWidth: 'none',
      transform: `translate(130px, 124px)`,
      pointerEvents: 'all',
      opacity: 1,
    });

    jest
      .spyOn(toolbarButtonRef.buttonRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 160, right: 60, bottom: 180, left: 40 });
    expect(toolbarButtonRef.getTitleStyle()).toEqual({
      maxWidth: 'none',
      transform: `translate(20px, 136px)`,
      pointerEvents: 'all',
      opacity: 1,
    });

    jest
      .spyOn(toolbarButtonRef.titleRef.current, 'getBoundingClientRect')
      .mockReturnValue({ width: 240, height: 20 });
    jest
      .spyOn(toolbarButtonRef.buttonRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 100, right: 60, bottom: 120, left: 40 });
    expect(toolbarButtonRef.getTitleStyle()).toEqual({
      maxWidth: 184,
      transform: `translate(8px, 124px)`,
      pointerEvents: 'all',
      opacity: 1,
    });

    toolbarButtonRef.titleRef.current = null;
    expect(toolbarButtonRef.getTitleStyle()).toEqual({});
  });

  it('should update `Title` style and aria attrs', () => {
    Object.defineProperty(window.document.documentElement, 'clientWidth', { value: 200 });
    Object.defineProperty(window.document.documentElement, 'clientHeight', { value: 200 });
    const toolbarButton = renderComponent();
    const toolbarButtonRef = toolbarButton.instance();
    const expectedActiveStyle = {
      maxWidth: 'none',
      transform: `translate(20px, 124px)`,
      pointerEvents: 'all',
      opacity: 1,
    };
    const expectedUnactiveStyle = {
      maxWidth: 'none',
      transform: `translate(20px, 124px)`,
      pointerEvents: 'none',
      opacity: 0,
    };

    jest
      .spyOn(toolbarButtonRef.titleRef.current, 'getBoundingClientRect')
      .mockReturnValue({ width: 60, height: 20 });
    jest
      .spyOn(toolbarButtonRef.buttonRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 100, right: 60, bottom: 120, left: 40 });

    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onMouseOver();
    toolbarButton.update();
    expect(toolbarButton.find('styled__Title').props().style).toEqual(expectedActiveStyle);
    expect(toolbarButton.find('styled__Title').props()['aria-hidden']).toBeFalsy();

    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onMouseOut();
    toolbarButton.update();
    expect(toolbarButton.find('styled__Title').props().style).toEqual(expectedUnactiveStyle);
    expect(toolbarButton.find('styled__Title').props()['aria-hidden']).toBeTruthy();

    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onFocus();
    toolbarButton.update();
    expect(toolbarButton.find('styled__Title').props().style).toEqual(expectedActiveStyle);
    expect(toolbarButton.find('styled__Title').props()['aria-hidden']).toBeFalsy();

    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onBlur();
    toolbarButton.update();
    expect(toolbarButton.find('styled__Title').props().style).toEqual(expectedUnactiveStyle);
    expect(toolbarButton.find('styled__Title').props()['aria-hidden']).toBeTruthy();

    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onFocus();
    toolbarButton.update();
    expect(toolbarButton.find('styled__Title').props().style).toEqual(expectedActiveStyle);
    expect(toolbarButton.find('styled__Title').props()['aria-hidden']).toBeFalsy();

    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onKeyDown({ key: 'w' });
    expect(toolbarButton.find('styled__Title').props().style).toEqual(expectedActiveStyle);
    expect(toolbarButton.find('styled__Title').props()['aria-hidden']).toBeFalsy();
    toolbarButton
      .find('styled__StyledButton')
      .props()
      .onKeyDown({ key: 'Escape' });
    toolbarButton.update();
    expect(toolbarButton.find('styled__Title').props().style).toEqual(expectedUnactiveStyle);
    expect(toolbarButton.find('styled__Title').props()['aria-hidden']).toBeTruthy();
  });
});
