import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import classNames from 'classnames';
import './StatelessTooltip.css';

class StatelessTooltip extends Component {
  constructor(props) {
    super(props);
    this.getDimensions = this.getDimensions.bind(this);
    this.tooltipId = `tooltip-${shortId.generate()}`;
    this.tooltipRef = React.createRef();
  }

  getDimensions() {
    return {
      width: this.tooltipRef.current.offsetWidth,
      height: this.tooltipRef.current.offsetHeight,
    };
  }

  render() {
    const { children, id, className, style, darkMode, placement, position } = this.props;
    const tooltipClassName = classNames(
      'DraftTextEditStatelessTooltip',
      darkMode && `DraftTextEditStatelessTooltip_darkMode`,
      placement && `DraftTextEditStatelessTooltip_placement_${placement}`,
      position && `DraftTextEditStatelessTooltip_position_${position}`,
      className
    );

    return (
      <figure
        ref={this.tooltipRef}
        id={id || this.tooltipId}
        style={style}
        className={tooltipClassName}
        role="tooltip">
        <figcaption className="DraftTextEditStatelessTooltip-Body">
          <span className="DraftTextEditStatelessTooltip-Title">{children}</span>
        </figcaption>
      </figure>
    );
  }
}

StatelessTooltip.propTypes = {
  children: PropTypes.string.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  darkMode: PropTypes.bool,
  placement: PropTypes.oneOf(['top', 'bottom']),
  position: PropTypes.oneOf(['left', 'right']),
};
StatelessTooltip.defaultProps = {
  id: null,
  className: '',
  style: {},
  darkMode: false,
  placement: 'bottom',
  position: null,
};

export default StatelessTooltip;
