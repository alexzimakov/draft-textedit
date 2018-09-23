import React from 'react';
import { shallow } from 'enzyme';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import Button from './Button';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(<Button {...props}>Test</Button>);
}

describe('<Button /> component', () => {
  it('should render with necessary components and children', () => {
    const button = renderComponent();

    expect(button.find('styled__DefaultButton')).toHaveLength(1);
    expect(button.contains('Test')).toBeTruthy();
  });

  it('should render with icon element', () => {
    const button = renderComponent({ icon: faHeart });

    expect(button.find('styled__DefaultButton')).toHaveLength(1);
    expect(button.find('styled__Icon')).toHaveLength(1);
    expect(button.contains('Test')).toBeTruthy();
  });
});
