// @flow

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import uniqueId from 'lodash/uniqueId';
import isFunction from 'lodash/isFunction';
import { Container } from './styled';

type Props = {
  children: React.Node,
  elementRef: { current: ?HTMLElement },
  isOpen: boolean,
  zIndex: number,
  shouldUseFixedPosition: boolean,
  onOutsideClick?: (event: SyntheticMouseEvent<HTMLElement>) => void,
};
type State = {
  containerStyle: {
    position: 'absolute' | 'fixed',
    maxWidth: number,
    transform: string | 'none',
    pointerEvents: 'all' | 'none',
    opacity: 0 | 1,
  },
};

class Dropdown extends React.Component<Props, State> {
  dropdownRoot: HTMLDivElement;
  dropdownRef: { current: ?HTMLDivElement };

  static defaultProps: Props = {
    children: null,
    elementRef: { current: null },
    isOpen: false,
    zIndex: 9999,
    shouldUseFixedPosition: false,
  };

  constructor(props: Props) {
    super(props);
    this.dropdownRoot = window.document.createElement('div');
    this.dropdownRoot.id = uniqueId('dropdown-root-');
    this.dropdownRef = React.createRef();
    this.state = {
      containerStyle: {
        position: 'absolute',
        maxWidth: 320,
        transform: 'none',
        pointerEvents: 'none',
        opacity: 0,
      },
    };
  }

  componentDidMount() {
    window.document.body.appendChild(this.dropdownRoot);
    window.addEventListener('resize', this.handleWindowResize);
    window.document.body.addEventListener('click', this.handleBodyClick);
  }

  componentDidUpdate(prevProps: Props) {
    const { isOpen } = this.props;

    if (isOpen !== prevProps.isOpen && isOpen) {
      this.setOpenContainerStyle();
    }

    if (isOpen !== prevProps.isOpen && !isOpen) {
      this.setHiddenContainerStyle();
    }
  }

  componentWillUnmount() {
    window.document.body.removeChild(this.dropdownRoot);
    window.removeEventListener('resize', this.handleWindowResize);
    window.document.body.removeEventListener('click', this.handleBodyClick);
  }

  setOpenContainerStyle = () => {
    const {
      elementRef: { current: trigerEl },
      shouldUseFixedPosition,
    } = this.props;
    const {
      dropdownRef: { current: dropdownEl },
    } = this;

    if (dropdownEl && trigerEl) {
      const verticalOffset = 4;
      const horizontalOffset = 8;
      const viewportWidth = window.document.documentElement.clientWidth;
      const viewportHeight = window.document.documentElement.clientHeight;
      const scrollTop = shouldUseFixedPosition ? 0 : window.pageYOffset;
      const { width, height } = dropdownEl.getBoundingClientRect();
      const { top, right, bottom, left } = trigerEl.getBoundingClientRect();
      let maxWidth = 320;
      let x = left;
      let y = bottom + verticalOffset;

      if (x + width > viewportWidth) {
        x = right - width;
      }

      if (x < 0) {
        x = horizontalOffset;
        maxWidth = viewportWidth - 2 * horizontalOffset;
      }

      if (y + height > viewportHeight) {
        y = top - height - verticalOffset;
      }

      this.setState({
        containerStyle: {
          position: shouldUseFixedPosition ? 'fixed' : 'absolute',
          maxWidth,
          transform: `translate(${x}px, ${y + scrollTop}px)`,
          pointerEvents: 'all',
          opacity: 1,
        },
      });
    }
  };

  setHiddenContainerStyle = () => {
    this.setState({
      containerStyle: {
        ...this.state.containerStyle,
        maxWidth: 320,
        pointerEvents: 'none',
        opacity: 0,
      },
    });
  };

  handleWindowResize = () => {
    const { isOpen } = this.props;

    if (isOpen) {
      this.setOpenContainerStyle();
    }
  };

  handleBodyClick = (event: SyntheticMouseEvent<HTMLElement>) => {
    const { isOpen, onOutsideClick } = this.props;
    const { current: dropdownEl } = this.dropdownRef;

    if (
      isFunction(onOutsideClick) &&
      isOpen &&
      dropdownEl &&
      !dropdownEl.contains((event.target: any))
    ) {
      onOutsideClick(event);
    }
  };

  render() {
    const { children, zIndex } = this.props;
    const { containerStyle } = this.state;

    return ReactDOM.createPortal(
      <Container innerRef={this.dropdownRef} style={{ zIndex, ...containerStyle }}>
        {children}
      </Container>,
      this.dropdownRoot
    );
  }
}

export default Dropdown;
