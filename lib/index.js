/**
 * Host half of the acrylic skin bundle.
 *
 * The skin is browser presentation only; the desktop shell owns the native
 * window material. This empty plugin exists so the profile has a Host entry
 * whose package metadata also supplies the browser bundle.
 */

/** Cordis plugin label for the empty Host row. */
export const name = 'acrylic-skin'

/** Host plugin body: this bundle contributes browser presentation only. */
export function apply() {}
