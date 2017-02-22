/**
 * Created by realm on 2017/2/21.
 */

import CityPicker from './city-picker';

$('body').on('click', '.tqb-city-picker-input', event => {
  let target = $(event.currentTarget);
  let data = target.data();
  let picker = data.cityPicker;
  if (picker) {
    picker.show();
    return;
  }
  data.show = true
  picker = new CityPicker(target, data);
  target.data('city-picker', picker);
  target.blur();
});