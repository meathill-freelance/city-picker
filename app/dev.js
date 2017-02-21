/**
 * Created by realm on 2017/2/21.
 */

import marked from 'marked';
import template from '../template/body.hbs';

fetch('./README.md')
  .then( response => {
    if (response.ok) {
      return response.text();
    }
    throw new Error('Network error');
  })
  .then( content => {
    let html = marked(content);
    $('#readme').html(html);
  });

let staticSample = template({
  'static': true
});
$('#static-sample .sample-container').html(staticSample);