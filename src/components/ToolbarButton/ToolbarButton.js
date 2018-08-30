// @flow

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import shortId from 'shortid';
import { toolbarButtonContainerColor } from '../../constants/colors';
import StyledButton, { Title } from './styled';

type Props = {
  children: React.Node,
  title?: string,
  isActive: boolean,
  isDisabled: boolean,
  onPress: (SyntheticMouseEvent<HTMLButtonElement>) => void,
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
  titleRef: { current: ?HTMLDivElement };
  buttonRef: { current: ?HTMLButtonElement };

  static defaultProps = {
    isSelected: false,
    isDisabled: false,
    onPress: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.titleRoot = document.createElement('div');
    this.titleId = `title-${shortId.generate()}`;
    this.titleRef = React.createRef();
    this.buttonRef = React.createRef();
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
    const {
      titleRef: { current: titleEl },
      buttonRef: { current: buttonEl },
    } = this;

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
    const { titleStyle } = this.state;

    this.setState({
      shouldShowTitle: true,
      titleStyle: { ...titleStyle, ...this.getTitleStyle() },
    });
  };

  hideTitle = () => {
    const { titleStyle } = this.state;

    this.setState({
      shouldShowTitle: false,
      titleStyle: { ...titleStyle, maxWidth: 'none', pointerEvents: 'none', opacity: 0 },
    });
  };

  handleMouseDown = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.props.onPress(event);
  };

  handleKeyDown = (event: SyntheticKeyboardEvent<HTMLButtonElement>) => {
    const { shouldShowTitle } = this.state;

    if (shouldShowTitle && event.key === 'Escape') {
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
          onFocus={this.showTitle}
          onBlur={this.hideTitle}
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
