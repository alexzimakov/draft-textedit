// @flow

import React from 'react';
import type { Node } from 'react';
import ReactDOM from 'react-dom';
import uniqueId from 'lodash/uniqueId';
import isFunction from 'lodash/isFunction';
import Button from '../Button';
import { Wrapper, Backdrop, Container, Title, Content, Buttons } from './styled';

type Props = {
  children: Node,
  isOpen: boolean,
  title?: string,
  cancelButtonCaption?: string,
  confirmButtonCaption?: string,
  onBackdropPress?: (event: SyntheticMouseEvent<HTMLDivElement>) => void,
  onCancelPress?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
  onConfirmPress?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
};
type State = {};

export default class Dialog extends React.Component<Props, State> {
  dialogRoot: HTMLDivElement;

  static defaultProps = {
    isOpen: false,
    cancelButtonCaption: 'Cancel',
    confirmButtonCaption: 'OK',
  };

  constructor(props: Props) {
    super(props);
    this.dialogRoot = document.createElement('div');
    this.dialogRoot.id = uniqueId('dialog-root-');
  }

  componentDidMount() {
    window.document.body.appendChild(this.dialogRoot);
  }

  componentWillUnmount() {
    window.document.body.removeChild(this.dialogRoot);
  }

  handleConfirmButtonMouseDown = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    isFunction(this.props.onConfirmPress) && this.props.onConfirmPress();
  };

  handleCancelButtonMouseDown = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    isFunction(this.props.onCancelPress) && this.props.onCancelPress();
  };

  handleBackdropMouseDown = (event: SyntheticMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    isFunction(this.props.onBackdropPress) && this.props.onBackdropPress();
  };

  render() {
    return ReactDOM.createPortal(
      <Wrapper isOpen={this.props.isOpen}>
        <Backdrop onMouseDown={this.handleBackdropMouseDown} />
        <Container>
          {this.props.title && <Title>{this.props.title}</Title>}
          <Content>{this.props.children}</Content>
          <Buttons>
            <Button onMouseDown={this.handleConfirmButtonMouseDown}>
              {this.props.confirmButtonCaption}
            </Button>
            <Button variant="text" onMouseDown={this.handleCancelButtonMouseDown}>
              {this.props.cancelButtonCaption}
            </Button>
          </Buttons>
        </Container>
      </Wrapper>,
      this.dialogRoot
    );
  }
}
