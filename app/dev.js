/**
 * Created by realm on 2017/2/21.
 */

import marked from 'marked';
import _ from 'underscore';
import CityPicker from './city-picker';
import template from '../template/body.hbs';
import list from '../template/list.hbs';
import errorInfo from '../template/error.hbs';
import cities from '../assets/city.json';
import {DEBUG} from 'config';

if (DEBUG) {
  $.get('./README.md')
    .then( content => {
      let html = marked(content);
      $('#readme').html(html);
    });
}

let staticSample = template({
  'static': true
});
let listHTML = list(CityPicker.format(_.clone(cities)));
$('#static-sample')
  .find('.sample-container').html(staticSample)
    .end()
  .find('.btn-group').on('change', 'input', event => {
    let name = event.currentTarget.value;
    let container = $('.tqb-cp-container');
    switch (name) {
      case 'loading':
        container
          .addClass('loading')
          .html('<p class="loading">加载中，请稍候</p>');
        break;

      case 'ready':
        container
          .removeClass('loading')
          .html(listHTML);
        break;

      case 'error':
        container
          .addClass('loading')
          .html(errorInfo({
            msg: '这里会显示错误信息'
          }));
        break;
    }
  });