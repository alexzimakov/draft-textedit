import React from 'react';
import { shallow } from 'enzyme';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faBold from '@fortawesome/fontawesome-free-solid/faBold';
import StyleButton from './StyleButton';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(
    <StyleButton {...props}>
      <FontAwesomeIcon icon={faBold} />
    </StyleButton>
  );
}

describe('<StyleButton /> component', () => {
  it('should renders with necessary components and children', () => {
    const styleButton = renderComponent();

    expect(styleButton.find('Tooltip')).toHaveLength(1);
    expect(styleButton.find('Button')).toHaveLength(1);
    expect(styleButton.contains(<FontAwesomeIcon icon={faBold} />)).toBeTruthy();
  });

  it('should adds a class with modifier for the `Button` element', () => {
    const styleButton = renderComponent({ active: true });

    expect(
      styleButton.find('Button').hasClass('DraftTextEditStyleButton-Button_active')
    ).toBeTruthy();
  });

  it('should calls `onPress` callback', () => {
    const onPressStub = jest.fn();
    const styleButton = renderComponent({ onPress: onPressStub });

    styleButton
      .find('Button')
      .props()
      .onPress();
    expect(onPressStub).toHaveBeenCalled();
  });

  it('should not throws an error if `onPress` property is not given', () => {
    const styleButton = renderComponent();

    expect(() => {
      styleButton
        .find('Button')
        .props()
        .onPress();
    }).not.toThrow();
  });

  it('should not shows the tooltip if `disabled` property is true', () => {
    const styleButton = renderComponent({ title: 'test', disabled: true });

    expect(styleButton.find('Tooltip').props().caption).toBeFalsy();
  });
});
