// @flow

import color from 'color';

/**
 * Base colors
 */
export const blue = '#157dfb';

/**
 * Theme colors
 */
export const primary = blue;
export const focusedShadowColor = color(primary)
  .alpha(0.25)
  .string();

/**
 * Components colors
 */

/* Button */
export const buttonContainerColor = primary;
export const buttonIconColor = 'inherit';
export const buttonLabelColor = 'white';
