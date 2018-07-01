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
  it('should renders without errors', () => {
    const styleButton = renderComponent();

    expect(
      styleButton.find('Button').hasClass('DraftTextEditStyleButton-Button')
    ).toBeTruthy();
  });

  it('should adds a class with modifier for the `Button` element', () => {
    const styleButton = renderComponent({ active: true });

    expect(
      styleButton
        .find('Button')
        .hasClass('DraftTextEditStyleButton-Button_active')
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

  it('should renders with the `Tooltip` element if `title` property is given', () => {
    const styleButton = renderComponent({ title: 'test' });

    expect(styleButton.find('Tooltip')).toHaveLength(1);
    expect(styleButton.find('Tooltip').props().children).toBe('test');
    expect(styleButton.find('Button').props()['aria-describedby']).toBe(
      styleButton.find('Tooltip').props().id
    );
  });

  it('should shows and hides the tooltip', () => {
    const styleButton = renderComponent({ title: 'test' });

    styleButton
      .find('Button')
      .props()
      .onMouseOver();
    styleButton.update();
    expect(
      styleButton
        .find('.DraftTextEditStyleButton-Tooltip')
        .hasClass('DraftTextEditStyleButton-Tooltip_visible')
    ).toBeTruthy();
    styleButton
      .find('Button')
      .props()
      .onMouseOut();
    styleButton.update();
    expect(
      styleButton
        .find('.DraftTextEditStyleButton-Tooltip')
        .hasClass('DraftTextEditStyleButton-Tooltip_visible')
    ).toBeFalsy();
  });

  it('should not shows the tooltip if `disabled` property is true', () => {
    const styleButton = renderComponent({ title: 'test', disabled: true });

    styleButton
      .find('Button')
      .props()
      .onMouseOver();
    styleButton.update();
    expect(
      styleButton
        .find('.DraftTextEditStyleButton-Tooltip')
        .hasClass('DraftTextEditStyleButton-Tooltip_visible')
    ).toBeFalsy();
  });
});
