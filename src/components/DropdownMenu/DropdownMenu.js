import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import classNames from 'classnames';
import Popover from '../Popover';
import './DropdownMenu.css';

class DropdownMenu extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    popoverIsSticky: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    popoverIsSticky: false,
    className: '',
    style: {},
    onOpen: () => {},
    onClose: () => {},
  };

  constructor(props) {
    super(props);
    this.targetRef = React.createRef();
    this.popoverId = `popover-${shortId.generate()}`;
    this.state = { isOpen: false };
  }

  openPopover = () => {
    const { onOpen } = this.props;

    this.setState({ isOpen: true });
    onOpen();
  };

  closePopover = () => {
    const { onClose } = this.props;

    this.setState({ isOpen: false });
    onClose();
  };

  handleTargetMouseDown = event => {
    event.preventDefault();
    this.openPopover();
  };

  render() {
    const { children, content, popoverIsSticky, style, className } = this.props;
    const { isOpen } = this.state;
    const popoverClassName = classNames('DraftTextEditDropdownMenu', className);

    return (
      <div style={style} className={popoverClassName}>
        <div
          ref={this.targetRef}
          className="DraftTextEditDropdownMenu-Switcher"
          role="switch"
          tabIndex={-1}
          aria-checked={isOpen}
          aria-describedby={this.popoverId}
          onFocus={this.openPopover}
          onBlur={this.closePopover}
          onMouseDown={this.handleTargetMouseDown}>
          {children}
        </div>
        <Popover
          targetRef={this.targetRef}
          id={this.popoverId}
          isOpen={isOpen}
          isSticky={popoverIsSticky}
          hasArrow
          onBackdropMouseDown={this.closePopover}
          onEscapeKeyDown={this.closePopover}>
          {content}
        </Popover>
      </div>
    );
  }
}

export default DropdownMenu;
