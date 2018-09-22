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

/* input colors */
export const inputBorderColor = color(secondary)
  .lighten(0.8)
  .string();
export const inputFocusBorderColor = primary;
export const inputBackgroundColor = '#fff';
export const inputDisabledBackgroundColor = color(secondary)
  .alpha(0.05)
  .string();
export const inputPlaceholderColor = color(secondary)
  .lighten(0.5)
  .string();
export const inputTextColor = darkGray;
export const inputLeadingIconColor = secondary;
export const inputTrailingIconColor = secondary;

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

/* Dropdown */
export const dropdownBackgroundColor = '#fff';
export const dropdownShadowColor = darkGray;

/* BlockTypeSelect */
export const blockTypeOptionBackgroundColor = '#fff';
export const blockTypeOptionTextColor = darkGray;
export const blockTypeOptionHoverColor = color(secondary)
  .alpha(0.1)
  .string();

/* Dialog */
export const dialogBackdropBackgroundColor = color(darkGray)
  .alpha(0.2)
  .string();
export const dialogContainerBackgroundColor = '#fff';
export const dialogContainerShadowColor = darkGray;
export const dialogTitleColor = darkGray;
export const dialogTextColor = darkGray;

/* LinkPlugin */
export const linkPluginTextColor = blue;
export const linkPluginBackgroundColor = color(blue)
  .alpha(0.1)
  .string();
export const linkPluginActiveTextColor = darkGray;
export const linkPluginActiveBackgroundColor = color(darkGray)
  .alpha(0.1)
  .string();
export const linkPluginActionButtonBorderColor = color(secondary)
  .lighten(0.8)
  .string();
export const linkPluginActionButtonBackgroundColor = '#fff';
export const linkPluginActionButtonBackgroundHoverColor = color(secondary)
  .lighten(1.05)
  .string();
