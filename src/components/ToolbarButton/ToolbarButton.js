// @flow

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import uniqueId from 'lodash/uniqueId';
import isFunction from 'lodash/isFunction';
import * as types from '../../constants/types';
import { toolbarButtonContainerColor } from '../../constants/colors';
import StyledButton, { Title } from './styled';

type Props = {
  forwardedRef?: types.Ref<HTMLButtonElement>,
  children: React.Node,
  title?: string,
  isActive: boolean,
  isDisabled: boolean,
  onFocus?: (event: SyntheticFocusEvent<HTMLButtonElement>) => void,
  onBlur?: (event: SyntheticFocusEvent<HTMLButtonElement>) => void,
  onPress?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
};
type State = {
  shouldShowTitle: boolean,
  titleStyle: {
    maxWidth: number | 'none',
    transform: string,
    pointerEvents: 'all' | 'none',
    opacity: 0 | 1,
  },
};

class ToolbarButton extends React.Component<Props, State> {
  titleRoot: HTMLDivElement;
  titleId: string;
  titleRef: types.Ref<HTMLDivElement>;
  buttonRef: types.Ref<HTMLButtonElement>;

  static defaultProps: Props = {
    children: null,
    isActive: false,
    isDisabled: false,
  };

  constructor(props: Props) {
    super(props);
    this.titleRoot = document.createElement('div');
    this.titleId = uniqueId('title-');
    this.titleRef = React.createRef();
    this.buttonRef = props.forwardedRef || React.createRef();
    this.state = {
      shouldShowTitle: false,
      titleStyle: {
        maxWidth: 'none',
        transform: 'translate(0, 0)',
        pointerEvents: 'none',
        opacity: 0,
      },
    };
  }

  componentDidMount() {
    window.document.body.appendChild(this.titleRoot);
  }

  componentWillUnmount() {
    window.document.body.removeChild(this.titleRoot);
  }

  getTitleStyle = () => {
    const titleEl = this.titleRef.current;
    const buttonEl = this.buttonRef.current;

    if (!titleEl || !buttonEl) {
      return {};
    }

    const verticalOffset = 4;
    const horizontalOffset = 8;
    const viewportWidth = window.document.documentElement.clientWidth;
    const viewportHeight = window.document.documentElement.clientHeight;
    const { width, height } = titleEl.getBoundingClientRect();
    const { top, right, bottom, left } = buttonEl.getBoundingClientRect();
    let maxWidth = 'none';
    let x = (left + right) / 2 - width / 2;
    let y = bottom + verticalOffset;

    if (width >= viewportWidth) {
      x = horizontalOffset;
      maxWidth = viewportWidth - 2 * horizontalOffset;
    } else if (x < 0) {
      x = left;
    } else if (x + width > viewportWidth) {
      x = right - width;
    }

    if (y + height > viewportHeight) {
      y = top - height - verticalOffset;
    }

    return {
      maxWidth,
      transform: `translate(${x}px, ${y}px)`,
      pointerEvents: 'all',
      opacity: 1,
    };
  };

  showTitle = () => {
    this.setState({
      shouldShowTitle: true,
      titleStyle: { ...this.state.titleStyle, ...this.getTitleStyle() },
    });
  };

  hideTitle = () => {
    this.setState({
      shouldShowTitle: false,
      titleStyle: { ...this.state.titleStyle, maxWidth: 'none', pointerEvents: 'none', opacity: 0 },
    });
  };

  handleFocus = (event: SyntheticFocusEvent<HTMLButtonElement>) => {
    this.showTitle();
    isFunction(this.props.onFocus) && this.props.onFocus(event);
  };

  handleBlur = (event: SyntheticFocusEvent<HTMLButtonElement>) => {
    this.hideTitle();
    isFunction(this.props.onBlur) && this.props.onBlur(event);
  };

  handleMouseDown = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    isFunction(this.props.onPress) && this.props.onPress(event);
  };

  handleKeyDown = (event: SyntheticKeyboardEvent<HTMLButtonElement>) => {
    if (this.state.shouldShowTitle && event.key === 'Escape') {
      this.hideTitle();
    }
  };

  render() {
    const { children, title, isActive, isDisabled } = this.props;
    const { titleStyle, shouldShowTitle } = this.state;
    const buttonPreferences = {
      containerColor: toolbarButtonContainerColor,
      horizontalPadding: 8,
    };
    const titleElement =
      title && !isDisabled
        ? ReactDOM.createPortal(
            <Title
              innerRef={this.titleRef}
              id={this.titleId}
              style={titleStyle}
              aria-hidden={!shouldShowTitle}>
              {title}
            </Title>,
            this.titleRoot
          )
        : null;

    return (
      <React.Fragment>
        <StyledButton
          forwardedRef={this.buttonRef}
          styled={buttonPreferences}
          variant="text"
          isActive={isActive}
          disabled={isDisabled}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseDown={this.handleMouseDown}
          onMouseOver={this.showTitle}
          onMouseOut={this.hideTitle}>
          {children}
        </StyledButton>
        {titleElement}
      </React.Fragment>
    );
  }
}

export default ToolbarButton;
