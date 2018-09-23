import React from 'react';
import { mount } from 'enzyme';
import Dropdown from './Dropdown';

const children = <div id="dropdown-content">Dropdown content</div>;
const elementRef = { current: window.document.createElement('button') };
elementRef.current.innerText = 'Menu';

function renderComponent(props = {}, mountFn = mount) {
  return mountFn(<Dropdown children={children} elementRef={elementRef} {...props} />);
}

describe('<Dropdown /> component', () => {
  it('should render with necessary elements and children', () => {
    const dropdown = renderComponent();

    expect(dropdown.find('styled__Container')).toHaveLength(1);
    expect(dropdown.contains(children)).toBeTruthy();
  });

  it('should add DOM element to render dropdown', () => {
    const dropdown = renderComponent();

    expect(window.document.body.contains(dropdown.instance().dropdownRoot)).toBeTruthy();
  });

  it('should remove DOM element to render dropdown', () => {
    const dropdown = renderComponent();
    const dropdownRoot = dropdown.instance().dropdownRoot;

    dropdown.unmount();

    expect(window.document.body.contains(dropdownRoot)).toBeFalsy();
  });

  it('should not throw an error if `onOutsideClick` is not given', () => {
    const onOutsideClick = undefined;
    const event = new MouseEvent('click');

    renderComponent({ isOpen: true, onOutsideClick });
    Object.defineProperty(event, 'target', {
      value: window.document.body.querySelector('#dropdown-content'),
    });

    expect(() => {
      window.document.body.dispatchEvent(event);
    }).not.toThrow();
  });

  it('should call `onOutsideClick` callback', () => {
    const onOutsideClick = jest.fn();
    const event = new MouseEvent('click');

    renderComponent({ isOpen: true, onOutsideClick });
    window.document.body.dispatchEvent(event);

    expect(onOutsideClick).toHaveBeenCalledWith(event);
  });

  it('should set dropdown style for open state', () => {
    const dropdown = renderComponent();

    Object.defineProperty(window, 'pageYOffset', { value: 200 });
    Object.defineProperties(window.document.documentElement, {
      clientWidth: { value: 960, configurable: true },
      clientHeight: { value: 800 },
    });

    jest.spyOn(elementRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      right: 120,
      bottom: 120,
      left: 100,
    });
    jest.spyOn(dropdown.instance().dropdownRef.current, 'getBoundingClientRect').mockReturnValue({
      width: 240,
      height: 200,
    });
    dropdown.setProps({ isOpen: true });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        maxWidth: 320,
        transform: 'translate(100px, 324px)',
        pointerEvents: 'all',
        opacity: 1,
      })
    );

    dropdown.setProps({ isOpen: false });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        maxWidth: 320,
        transform: 'translate(100px, 324px)',
        pointerEvents: 'none',
        opacity: 0,
      })
    );

    jest.spyOn(elementRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      right: 940,
      bottom: 120,
      left: 920,
    });
    dropdown.setProps({ isOpen: true });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        maxWidth: 320,
        transform: 'translate(700px, 324px)',
        pointerEvents: 'all',
        opacity: 1,
      })
    );

    dropdown.setProps({ isOpen: false });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        maxWidth: 320,
        transform: 'translate(700px, 324px)',
        pointerEvents: 'none',
        opacity: 0,
      })
    );

    jest.spyOn(elementRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 760,
      right: 120,
      bottom: 780,
      left: 100,
    });
    dropdown.setProps({ isOpen: true });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        maxWidth: 320,
        transform: 'translate(100px, 756px)',
        pointerEvents: 'all',
        opacity: 1,
      })
    );

    dropdown.setProps({ isOpen: false });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        maxWidth: 320,
        transform: 'translate(100px, 756px)',
        pointerEvents: 'none',
        opacity: 0,
      })
    );

    Object.defineProperty(window.document.documentElement, 'clientWidth', {
      value: 260,
      configurable: true,
    });
    jest.spyOn(elementRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      right: 120,
      bottom: 120,
      left: 100,
    });
    dropdown.setProps({ isOpen: true });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        maxWidth: 244,
        transform: 'translate(8px, 324px)',
        pointerEvents: 'all',
        opacity: 1,
      })
    );

    dropdown.setProps({ isOpen: false });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        maxWidth: 320,
        transform: 'translate(8px, 324px)',
        pointerEvents: 'none',
        opacity: 0,
      })
    );

    dropdown.setProps({ isOpen: true, shouldUseFixedPosition: true });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'fixed',
        maxWidth: 244,
        transform: 'translate(8px, 124px)',
        pointerEvents: 'all',
        opacity: 1,
      })
    );

    dropdown.setProps({ isOpen: false });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'fixed',
        maxWidth: 320,
        transform: 'translate(8px, 124px)',
        pointerEvents: 'none',
        opacity: 0,
      })
    );

    dropdown.setProps({ elementRef: { current: null }, isOpen: true });
    dropdown.update();

    expect(dropdown.find('styled__Container').props().style).toEqual(
      expect.objectContaining({
        position: 'fixed',
        maxWidth: 320,
        transform: 'translate(8px, 124px)',
        pointerEvents: 'none',
        opacity: 0,
      })
    );
  });

  it('should update dropdown style when dropdown is opened and window is resized', () => {
    const dropdown = renderComponent();

    jest.spyOn(dropdown.instance(), 'setOpenContainerStyle');
    dropdown.setProps({ isOpen: true });
    window.dispatchEvent(new Event('resize'));
    dropdown.setProps({ isOpen: false });
    window.dispatchEvent(new Event('resize'));

    expect(dropdown.instance().setOpenContainerStyle).toHaveBeenCalledTimes(2);
  });
});
