/**
 * Created by meathill on 2017/5/13.
 */

export function isSupported(property, value, noPrefixes) {
  let el = document.createElement('div');
  let style = el.style;
  let cssText;
  if (noPrefixes) {
    cssText = `${property}:${value}`;
  } else {
    cssText = ['-webkit-', '-moz-', '-ms-', '-o-', ''].map( prefix => {
      return `${property}:${prefix}${value}`;
    }).join(';');
  }
  style.cssText = cssText;
  return !!style[property];
}