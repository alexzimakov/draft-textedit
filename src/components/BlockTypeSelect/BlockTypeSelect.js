import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash.pick';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faChevronDown from '@fortawesome/fontawesome-free-solid/faChevronDown';
import * as blockTypes from '../../constants/blockTypes';
import Button from '../Button';
import Popover from '../Popover';
import Option from './Option';
import './BlockTypeSelect.css';

class BlockTypeSelect extends Component {
  constructor(props) {
    super(props);
    this.getState = this.getState.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handlePressOutside = this.handlePressOutside.bind(this);
    this.handleOptionPress = this.handleOptionPress.bind(this);
    this.state = {
      value: props.defaultValue,
      popoverIsVisible: false,
    };
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyDown);
  }

  getState() {
    return { ...this.state, ...pick(this.props, ['value']) };
  }

  handleKeyDown(event) {
    if (
      event.key === 'Escape' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp'
    ) {
      this.setState({ popoverIsVisible: false });
    }
  }

  handleButtonPress() {
    const { popoverIsVisible } = this.state;
    this.setState({ popoverIsVisible: !popoverIsVisible });
  }

  handlePressOutside(event) {
    const { popoverIsVisible } = this.state;

    if (popoverIsVisible) {
      event.stopPropagation();
      event.preventDefault();
      this.setState({ popoverIsVisible: false });
    }
  }

  handleOptionPress(value) {
    const { onChange } = this.props;

    this.setState({ value, popoverIsVisible: false });
    onChange(value);
  }

  render() {
    const { popoverPosition, options, labels } = this.props;
    const { popoverIsVisible, value } = this.getState();
    const popoverClasses = classNames(
      'DraftTextEditBlockTypeSelect-Popover',
      popoverPosition &&
        `DraftTextEditBlockTypeSelect-Popover_position_${popoverPosition}`,
      popoverIsVisible && 'DraftTextEditBlockTypeSelect-Popover_visible'
    );

    return (
      <div className="DraftTextEditBlockTypeSelect">
        <Button
          className="DraftTextEditBlockTypeSelect-Button"
          variant="text"
          aria-haspopup="listbox"
          onPress={this.handleButtonPress}>
          <span className="DraftTextEditBlockTypeSelect-Button_label">
            {labels[value] || value}
          </span>
          <FontAwesomeIcon
            className="DraftTextEditBlockTypeSelect-Button_arrow"
            icon={faChevronDown}
          />
        </Button>
        <div className={popoverClasses}>
          <Popover
            onPressOutside={this.handlePressOutside}
            position={popoverPosition}>
            <ul className="DraftTextEditBlockTypeSelect-Options" role="listbox">
              {options.map(option => (
                <Option
                  key={option}
                  value={option}
                  label={labels[option]}
                  selected={option === value}
                  onPress={this.handleOptionPress}
                />
              ))}
            </ul>
          </Popover>
        </div>
      </div>
    );
  }
}

BlockTypeSelect.propTypes = {
  popoverPosition: PropTypes.oneOf(['left', 'right']),
  options: PropTypes.arrayOf(PropTypes.oneOf(Object.values(blockTypes))),
  labels: PropTypes.objectOf(PropTypes.string),
  // eslint-disable-next-line
  value: PropTypes.oneOf(Object.values(blockTypes)),
  defaultValue: PropTypes.oneOf(Object.values(blockTypes)),
  onChange: PropTypes.func,
};
BlockTypeSelect.defaultProps = {
  popoverPosition: null,
  options: [
    blockTypes.headerOne,
    blockTypes.headerTwo,
    blockTypes.headerThree,
    blockTypes.headerFour,
    blockTypes.headerFive,
    blockTypes.headerSix,
    blockTypes.paragraph,
  ],
  labels: {
    [blockTypes.headerOne]: 'Heading 1',
    [blockTypes.headerTwo]: 'Heading 2',
    [blockTypes.headerThree]: 'Heading 3',
    [blockTypes.headerFour]: 'Heading 4',
    [blockTypes.headerFive]: 'Heading 5',
    [blockTypes.headerSix]: 'Heading 6',
    [blockTypes.blockQuote]: 'Blockquote',
    [blockTypes.codeBlock]: 'Code',
    [blockTypes.atomic]: 'Figure',
    [blockTypes.unorderedList]: 'Unordered list',
    [blockTypes.orderedList]: 'Ordered list',
    [blockTypes.paragraph]: 'Paragraph',
  },
  defaultValue: blockTypes.paragraph,
  onChange: () => {},
};

export default BlockTypeSelect;
