import React from 'react';
import { shallow } from 'enzyme';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faBold } from '@fortawesome/fontawesome-free-solid';
import StyleButton from './StyleButton';

function renderComponent(
  { style = 'BOLD', ...otherProps } = {},
  mountFn = shallow
) {
  return mountFn(
    <StyleButton style={style} {...otherProps}>
      <FontAwesomeIcon icon={faBold} />
    </StyleButton>
  );
}

describe('<StyleButton /> component', () => {
  it('should render without errors', () => {
    const styleButton = renderComponent();

    expect(styleButton.hasClass('DraftTextEdit-StyleButton')).toBeTruthy();
  });

  it('should render with tooltip', () => {
    const styleButton = renderComponent({ tooltip: 'Bold' });

    expect(
      styleButton.find('.DraftTextEdit-StyleButton__tooltip')
    ).toHaveLength(1);
    expect(styleButton.find('.DraftTextEdit-StyleButton__tooltip').text()).toBe(
      'Bold'
    );
  });

  it('should show tooltip during hover', () => {
    const styleButton = renderComponent({ tooltip: 'Bold' });

    styleButton.simulate('mouseover');
    expect(
      styleButton
        .find('.DraftTextEdit-StyleButton__tooltip')
        .hasClass('DraftTextEdit-StyleButton__tooltip_visible')
    ).toBeTruthy();
  });

  it('should add class if button is active', () => {
    const styleButton = renderComponent({ active: true });

    expect(
      styleButton.hasClass('DraftTextEdit-StyleButton_active')
    ).toBeTruthy();
  });

  it('should call onPress callback', () => {
    const onPressStub = jest.fn();
    const styleButton = renderComponent({ onPress: onPressStub });

    styleButton.simulate('mousedown', { preventDefault: jest.fn() });
    styleButton.simulate('keydown', {
      preventDefault: jest.fn(),
      key: 'Enter',
    });
    styleButton.simulate('keydown', { preventDefault: jest.fn(), key: ' ' });
    expect(onPressStub).toHaveBeenCalledTimes(3);
    expect(onPressStub.mock.calls).toEqual([['BOLD'], ['BOLD'], ['BOLD']]);
  });

  it('should not call onPress callback', () => {
    const onPressStub = jest.fn();
    const styleButton = renderComponent({ onPress: onPressStub });

    styleButton.simulate('keydown', { preventDefault: jest.fn(), key: 'Tab' });
    expect(onPressStub).not.toHaveBeenCalled();
  });
});
