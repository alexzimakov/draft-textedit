import React from 'react';
import { shallow } from 'enzyme';
import Option from './Option';

function renderComponent(
  { value = 'header-one', label = 'Heading 1', ...otherProps } = {},
  mountFn = shallow
) {
  return mountFn(<Option value={value} label={label} {...otherProps} />);
}

describe('BlockTypeSelect <Option /> component', () => {
  it('should renders without errors', () => {
    const option = renderComponent();

    expect(option.text()).toBe('Heading 1');
  });

  it('should renders with value if `label` is not given', () => {
    const option = renderComponent({ label: null });

    expect(option.text()).toBe('header-one');
  });

  it('should renders with icon if `selected` property is true', () => {
    const option = renderComponent({ selected: true });

    expect(option.find('FontAwesomeIcon')).toHaveLength(1);
  });

  it('should calls onPress callback', () => {
    const onPress = jest.fn();
    const option = renderComponent({ onPress });

    option.simulate('mousedown', { preventDefault: jest.fn() });
    expect(onPress).toHaveBeenCalledWith('header-one');
  });

  it('should not throws an error if `onPress` property is not given', () => {
    const option = renderComponent();

    expect(() => {
      option
        .find('li')
        .props()
        .onMouseDown({ preventDefault: jest.fn() });
    }).not.toThrow();
  });
});
