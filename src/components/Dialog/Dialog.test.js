import React from 'react';
import { mount } from 'enzyme';
import Dialog from './Dialog';

function renderComponent(props = {}, mountFn = mount) {
  return mountFn(
    <Dialog isOpen={false} title="Title" {...props}>
      <div>Children</div>
    </Dialog>
  );
}

describe('<Dialog /> component', () => {
  it('should render with necessary elements and children', () => {
    const dialog = renderComponent();

    expect(dialog.contains(<div>Children</div>)).toBeTruthy();
    expect(dialog.find('styled__Backdrop')).toHaveLength(1);
    expect(dialog.find('styled__Title')).toHaveLength(1);
    expect(dialog.find('styled__Wrapper')).toHaveLength(1);
    expect(dialog.find('styled__Container')).toHaveLength(1);
    expect(dialog.find('styled__Content')).toHaveLength(1);
    expect(dialog.find('Button')).toHaveLength(2);
  });

  it('should add root element to body', () => {
    const dialog = renderComponent();
    const root = dialog.instance().dialogRoot;

    expect(window.document.body.contains(root)).toBeTruthy();
  });

  it('should remove root element from body', () => {
    const dialog = renderComponent();
    const root = dialog.instance().dialogRoot;
    dialog.unmount();

    expect(window.document.body.contains(root)).toBeFalsy();
  });

  it('should not throw error if `onBackdropPress` is not a function', () => {
    const dialog = renderComponent();

    expect(() => {
      dialog
        .find('styled__Backdrop')
        .props()
        .onMouseDown({ preventDefault: jest.fn() });
    }).not.toThrow();
  });

  it('should call `onBackdropPress` callback', () => {
    const onBackdropPress = jest.fn();
    const event = { preventDefault: jest.fn() };
    const dialog = renderComponent({ onBackdropPress });
    dialog
      .find('styled__Backdrop')
      .props()
      .onMouseDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onBackdropPress).toHaveBeenCalled();
  });

  it('should not throw error if `onCancelPress` is not a function', () => {
    const dialog = renderComponent();

    expect(() => {
      dialog
        .find('Button')
        .at(1)
        .props()
        .onMouseDown({ preventDefault: jest.fn() });
    }).not.toThrow();
  });

  it('should call `onCancelPress` callback', () => {
    const onCancelPress = jest.fn();
    const event = { preventDefault: jest.fn() };
    const dialog = renderComponent({ onCancelPress });
    dialog
      .find('Button')
      .at(1)
      .props()
      .onMouseDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onCancelPress).toHaveBeenCalled();
  });

  it('should not throw error if `onConfirmPress` is not a function', () => {
    const dialog = renderComponent();

    expect(() => {
      dialog
        .find('Button')
        .at(0)
        .props()
        .onMouseDown({ preventDefault: jest.fn() });
    }).not.toThrow();
  });

  it('should call `onConfirmPress` callback', () => {
    const onConfirmPress = jest.fn();
    const event = { preventDefault: jest.fn() };
    const dialog = renderComponent({ onConfirmPress });
    dialog
      .find('Button')
      .at(0)
      .props()
      .onMouseDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onConfirmPress).toHaveBeenCalled();
  });
});
