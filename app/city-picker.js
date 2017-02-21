import template from '../template/body.hbs';
import list from '../template/list.hbs';
import error from '../template/error.hbs';

export default class CityPicker {
  constructor(target, options) {
    this.target = target;
    this.createElement(options);
    this.delegateEvents(options);
    this.setValue(target.val());

    target.prop('readonly', true);
    if (options.show) {
      this.show();
    }
  }

  createElement(options) {
    let url = CityPicker.getDataAPI(options);
    fetch(url)
      .then( response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network error');
      })
      .then( json => {
        this.$el.html(list(json));
      })
      .catch( err => {
        this.$el.html(error(err));
      });

    let el = this.$el = $(template());
  }

  delegateEvents(options) {
    this.$el
      .on('click', 'li', event => {
        let li = $(event.currentTarget);
        li.toggleClass('select');
      });
  }

  static getDataAPI(options) {
    let url = options.url || './assets/city.json';
    if ('params' in options) {
      url += options.params;
    }
    return url
  }

  setValue(value) {
    this.$el.find(`li[data-value="${value}"`).addClass('select');
  }

  show() {

  }
}