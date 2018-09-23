// @flow

import styled from 'styled-components';
import {
  focusedShadowColor,
  inputFocusBorderColor,
  inputTextColor,
  inputDisabledBackgroundColor,
} from '../../constants/colors';
import { inputMixin } from '../TextField/styled';

const icon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHdSURBVHhe7ZvNTcNAEIWdC1caoAQoIkVwoQ3/Hd1DqIN0QRGUkAK4IcF7yazkGGOZke3s7swnPSk4u555yYq82JvCcRzHuRFlWT5S8qct2ra9r+v6g+JjOWyGXVVVbzD/TfExj12eMgAMN8F870Vo5Om8gdk99NU3L+KxvQzLk6ZpHmDy1DM91IljZHhedF13h2X+PmL6ShzDsTItH2DuMDQ7oYNMywO8qy8jJifFOTI9bRh0YOZzzOSUOCf5kNQLO6MmZyjpkLSDgePAkEZHnutyyoTAEv4VdrTiueS0aYCm/wo7WqUTkmaEHa3iD0lzw45WPHfUIQkNvo41vqRYQ8rFBRr7d9jRirWkbBxow45WrBVNSFog7GgVRUhaKuxodduQhKW4WNjRij1IO9uC4kuHHa22D0krhh2ttg1JKPaEos8xiT1Je47jOOti/p8gP3JQ1O7HIEFRu0EoYDoKC7a/DBHrX4fPmL4gEkBTdi+JBdCY3YuixPxlcbJiSEpn9wiatXtrLIDlavfmqGD79jhZICSlv4tUG5I4J7qwowVm7G6SCsCU3W1yZG5I4pjow46WGSEp362yAZi0u1k6gGVud7u8YPsHE6QXkkz+ZOYMg042YcdxHCc9iuIHlAX0PfQukdYAAAAASUVORK5CYII=';

export const StyledSelect = styled.select`
  ${inputMixin};
  outline: none;
  background-image: url(${icon});
  background-repeat: no-repeat;
  background-position: calc(100% - 2px) 55%;
  background-size: 1em auto;
  appearance: none;

  :focus {
    border-color: ${inputFocusBorderColor};
    box-shadow: 0 0 0 ${props => (props.size === 'small' ? 2 : 3)}px ${focusedShadowColor};
  }

  :-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 ${inputTextColor};
  }

  :disabled {
    cursor: not-allowed;
    background-color: ${inputDisabledBackgroundColor};
  }
`;
