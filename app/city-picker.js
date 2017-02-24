import template from '../template/body.hbs';
import list from '../template/list.hbs';
import error from '../template/error.hbs';

export default class CityPicker {
  constructor(target, options) {
    this.target = target;
    this.input = CityPicker.generatePlaceholder(target);
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
        json = CityPicker.format(json);
        container.removeClass('loading')
          .html(list(json));
        this.list = this.$el.find('.tqb-cp-list');
        this.header = this.$el.find('header');
        this.$el.removeClass('loading');
      })
      .catch( err => {
        container.html(error(err));
      });

    let el = this.$el = $(template());
    let container = this.container = this.$el.find('.tqb-cp-container');
    el.appendTo(document.body);
    setTimeout( () => {
      el.removeClass('out');
    });
  }

  delegateEvents(options) {
    this.$el
      .on('click', '.tqb-cp-list li:not(.label)', event => {
        this.$el.find('.select').removeClass('select');
        let li = $(event.currentTarget);
        li.toggleClass('select');
        this.target.val(li.text());
        this.input.val(li.data('id'));
      })
      .on('click', '.vocabulary li', event => {
        let char = event.currentTarget.innerHTML;
        let position = this.list.find(`.label.${char}`).position();
        this.container.scrollTop(position.top);
        console.log(char, position);
      })
      .on('click', '.tqb-cp-close-button', () => {
        this.hide();
      })
      .on('click', '.tqb-cp-search-button', event => {
        this.$el.toggleClass('search');
      })
      .on('click', '.tqb-cp-clear-button', () => {
        this.$el.find('[type=search]').val('');
      })
      .on('change input', '[type=search]', event => {
        let value = event.currentTarget.value;
        if (value) {
          this.list.find('.check').removeClass('check');
          this.list.find('.list').addClass('searching');
          this.list.find(`.${value},[data-py^=${value}]`).addClass('check');
        } else {
          this.list.find('.list').removeClass('searching');
        }
      })
      .on('transitionend', ()=> {
        this.$el.toggleClass('hide', this.$el.hasClass('out'));
      });
  }

  static format(json) {
    let result = {};
    let vocabulary = {};
    result.hot = json.suggestions.slice(0, CityPicker.hotLength);
    result.list = json.suggestions.sort( (a, b) => {
      if (a.py > b.py) {
        return 1;
      }
      if (a.py < b.py) {
        return -1;
      }
      return 0;
    });
    let start = '';
    for (let i = 0, len = result.list.length; i < len; i++) {
      let capital = result.list[i].py.substr(0, 1);
      result.list[i].searchKey = result.list[i].searchKey.split('|').join(' ');
      if (capital != start) {
        start = capital;
        result.list.splice(i, 0, {
          capital: capital.toUpperCase()
        });
        i += 1;
      }
      vocabulary[capital.toUpperCase()] = 0;
    }
    result.vocabulary = Object.keys(vocabulary);
    return result;
  }

  static generatePlaceholder(input) {
    let real = document.createElement('input');
    real.type = 'hidden';
    real.name = input.attr('name');
    input.attr('name', (index, value) => {
      return value + '-placeholder';
    });
    real = $(real);
    real.insertAfter(input);
    return real;
  }

  static getDataAPI(options) {
    let url = options.url || './assets/city.json';
    if ('params' in options) {
      url += options.params;
    }
    return url
  }

  setValue(value) {
    this.$el.find(`li[data-id="${value}"]`).addClass('select');
  }

  show() {
    this.$el
      .removeClass('hide');
    setTimeout(() => {
      this.$el.removeClass('out');
    })
  }

  hide() {
    this.$el.addClass('out');
  }
}

CityPicker.hotLength = 5;