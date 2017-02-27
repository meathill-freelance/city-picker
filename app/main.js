/**
 * Created by realm on 2017/2/21.
 */

import CityPicker from './city-picker';

$('body').on('click', '.tqb-city-picker-input', event => {
  let target = $(event.currentTarget);
  let data = target.data();
  let picker = data.cityPicker;
  target.blur();
  if (picker) {
    picker.show();
    return;
  }
  data.show = true;
  picker = new CityPicker(target, data);
  target.data('city-picker', picker);
});

$('.tqb-city-picker-input').prop('readonly', true);

if (/micromessenger/i.test(navigator.userAgent)) {
  let script = document.createElement('script');
  script.async = true;
  script.src = '//cdn.staticfile.org/fastclick/1.0.6/fastclick.min.js';
  document.body.appendChild(script);
}