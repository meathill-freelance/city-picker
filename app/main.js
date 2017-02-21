/**
 * Created by realm on 2017/2/21.
 */

import CityPicker from './city-picker';

$('body').on('click', '.tqb-city-picker-input', event => {
  let target = $(event.currentTarget);
  let picker = target.data('city-picker');
  if (picker) {
    picker.show();
  }
  picker = new CityPicker(target, {
    show: true
  });
  target.data('city-picker', picker);
  target.blur();
});