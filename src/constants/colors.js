// @flow

import color from 'color';

/**
 * Base colors
 */
export const blue = '#157dfb';
export const gray = '#757575';
export const darkGray = '#1a1a1a';

/**
 * Theme colors
 */
export const primary = blue;
export const secondary = gray;
export const focusedShadowColor = color(primary)
  .alpha(0.25)
  .string();

/**
 * Components colors
 */

/* Button */
export const buttonContainerColor = primary;
export const buttonIconColor = 'inherit';
export const buttonLabelColor = '#fff';

/* ToolbarButton */
export const toolbarButtonContainerColor = secondary;
export const toolbarButtonActiveLabelColor = color(secondary)
  .darken(0.5)
  .string();
export const toolbarButtonTitleContainerColor = darkGray;
export const toolbarButtonTitleTextColor = '#fff';

/* TextField */
export const textFieldBorderColor = color(secondary)
  .lighten(0.8)
  .string();
export const textFieldFocusBorderColor = primary;
export const textFieldBackgroundColor = '#fff';
export const textFieldDisabledBackgroundColor = color(secondary)
  .alpha(0.05)
  .string();
export const textFieldPlaceholderColor = color(secondary)
  .lighten(0.5)
  .string();
export const textFieldTextColor = darkGray;
export const textFieldLeadingIconColor = secondary;
export const textFieldTrailingIconColor = secondary;

/* Dropdown */
export const dropdownBackgroundColor = '#fff';
export const dropdownShadowColor = darkGray;
