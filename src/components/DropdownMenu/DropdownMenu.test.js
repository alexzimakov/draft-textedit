import React from 'react';
import { mount } from 'enzyme';
import DropdownMenu from './DropdownMenu';

function renderComponent(
  { content = <p>Popover content</p>, ...otherProps } = {},
  mountFn = mount
) {
  return mountFn(
    <DropdownMenu content={content} {...otherProps}>
      <button>Open popover</button>
    </DropdownMenu>
  );
}

describe('<DropdownMenu /> component', () => {
  it('should renders with necessary components and children', () => {
    const dropdownMenu = renderComponent();

    expect(dropdownMenu.contains(<button>Open popover</button>)).toBeTruthy();
    expect(dropdownMenu.contains(<p>Popover content</p>)).toBeTruthy();
    expect(dropdownMenu.find('.DraftTextEditDropdownMenu-Switcher')).toHaveLength(1);
    expect(dropdownMenu.find('Popover')).toHaveLength(1);
  });

  it('should not throws an error if `onClose` property is not given', () => {
    const dropdownMenu = renderComponent();

    expect(() => {
      dropdownMenu
        .find('Popover')
        .props()
        .onBackdropMouseDown();
    }).not.toThrow();
  });

  it('should calls `onClose` callback', () => {
    const onClose = jest.fn();
    const dropdownMenu = renderComponent({ onClose });

    dropdownMenu
      .find('Popover')
      .props()
      .onBackdropMouseDown();

    expect(onClose).toHaveBeenCalled();
  });

  it('should not throws an error if `onClose` property is not given', () => {
    const dropdownMenu = renderComponent();

    expect(() => {
      dropdownMenu
        .find('.DraftTextEditDropdownMenu-Switcher')
        .props()
        .onMouseDown({ preventDefault: jest.fn() });
    }).not.toThrow();
  });

  it('should calls `onOpen` callback', () => {
    const onOpen = jest.fn();
    const dropdownMenu = renderComponent({ onOpen });

    dropdownMenu
      .find('.DraftTextEditDropdownMenu-Switcher')
      .props()
      .onMouseDown({ preventDefault: jest.fn() });

    expect(onOpen).toHaveBeenCalled();
  });
});
