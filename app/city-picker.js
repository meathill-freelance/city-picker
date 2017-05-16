import template from '../template/body.hbs';
import list from '../template/list.hbs';
import error from '../template/error.hbs';
import { isSupported } from './utils';

export default class CityPicker {
  constructor(target, options) {
    options.hot = 'hot' in options ? options.hot : CityPicker.hotLength;
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
    let promise;
    if ('source' in options && window[options.source]) {
      promise = $.Deferred();
      promise.resolve(window[options.source]);
    } else {
      let url = CityPicker.getDataAPI(options);
      promise = $.get({
        url: url,
        dataType: 'json'
      });
    }
    promise
      .then( json => {
        json = CityPicker.format(json, options.hot);
        let html = list(json).split('<!-- split -->');
        container.removeClass('tqb-cp-loading')
          .html(html[0]);
        this.$el.removeClass('tqb-cp-loading')
          .append(html[1]);
        this.list = this.$el.find('.list');
        this.capitalHeader = this.$el.find('.capital-header');
        this.labels = this.list.find('.label').get().map(function (element) {
          return {
            label: element.innerHTML,
            top: $(element).position().top
          };
        });
      })
      .catch( err => {
        console.log(err);
        container.html(error(err));
      });

    let el = this.$el = $(template());
    let container = this.container = this.$el.find('.tqb-cp-container');
    if (CityPicker.fixContainerHeight) {
      container.height($(window).height() - 65);
    }
    el.appendTo(document.body);
    setTimeout( () => {
      el.removeClass('out');
    }, 50);
  }

  delegateEvents() {
    let self = this;
    this.$el
      .on('click', '.tqb-cp-list li:not(.label)', event => {
        this.$el.find('.select').removeClass('select');
        let li = $(event.currentTarget);
        li.toggleClass('select');
        if (this.target[0].tagName.toLowerCase() === 'label') {
          this.target.text(li.text());
        } else {
          this.target.val(li.text());
        }
        this.input.val(li.data('id'));
        let e = document.createEvent('HTMLEvents'); // 为了让 Vue 能侦听到事件
        e.initEvent('change', true, true);
        this.input[0].dispatchEvent(e);
        this.hide();
      })
      .on('click', '.vocabulary li', event => {
        let char = event.currentTarget.innerHTML;
        this.scrollTo(char);
      })
      .on('touchstart', '.vocabulary', function () {
        let vocabulary = $(this);
        $('body').one('touchend', () => {
          vocabulary.off('touchmove');
        });
        vocabulary.on('touchmove', function (event) {
          let location = event.originalEvent.changedTouches[0];
          let node = document.elementFromPoint(location.clientX, location.clientY);
          if (this.contains(node)) {
            let char = node.innerHTML;
            self.scrollTo(char);
          }
        });
      })
      .on('click', '.tqb-cp-close-button', () => {
        this.hide();
      })
      .on('click', '.tqb-cp-search-button', () => {
        this.$el.toggleClass('search');
        if (this.$el.hasClass('search')) {
          this.$el.find('[type=search]').focus();
        } else {
          this.list.removeClass('searching');
        }
      })
      .on('click', '.tqb-cp-clear-button', () => {
        this.$el.find('[type=search]').val('');
      })
      .on('change input', '[type=search]', event => {
        let value = event.currentTarget.value;
        this.list.find('.check').removeClass('check')
          .text( (i, text) => {
            return text;
          });
        if (value) {
          this.list.addClass('searching');
          this.list.find(`[class*="${value}"]`).addClass('check')
            .html( (i, html) => {
              return html.replace(value, `<strong>${value}</strong>`);
            });
        } else {
          this.list.find('.list').removeClass('searching');
        }
      })
      .on('transitionend', ()=> {
        this.$el.toggleClass('hide', this.$el.hasClass('out'));
      });
    if (isSupported('position', 'sticky')) {
      return;
    }
    this.$el.find('.tqb-cp-container').on('scroll', event => {
      let scrollTop = event.currentTarget.scrollTop;
      let current;
      if (scrollTop < this.labels[1].top) {
        this.removeLabel();
        return;
      }
      for (let i = 1, len = this.labels.length; i < len; i++) {
        if (scrollTop > this.labels[i].top) {
          current = i;
        } else if (current) {
          this.addLabel(this.labels[current].label);
          return;
        }
      }
    });
  }

  scrollTo(char) {
    let position = this.list.find(`.label.${char}`).position();
    this.container.scrollTop(position.top);
  }

  setValue(value) {
    this.$el.find(`li[data-id="${value}"]`).addClass('select');
  }

  show() {
    this.$el
      .removeClass('hide');
    setTimeout(() => {
      this.$el.removeClass('out');
    }, 50);
  }

  hide() {
    this.$el.addClass('out');
  }

  addLabel(label) {
    this.capitalHeader
      .addClass('show')
      .text(label);
  }

  removeLabel() {
    this.capitalHeader
      .removeClass('show');
  }

  static format(json, hotLength) {
    let result = {};
    let vocabulary = {};
    result.hot = hotLength ? json.suggestions.slice(0, hotLength) : false;
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
      if (capital !== start) {
        start = capital;
        result.list.splice(i, 0, {
          capital: capital.toUpperCase()
        });
        len += 1;
        i += 1;
      }
      vocabulary[capital.toUpperCase()] = 0;
    }
    result.vocabulary = Object.keys(vocabulary);
    return result;
  }

  static generatePlaceholder(input) {
    if (input[0].tagName.toLowerCase() === 'label') { // 有可能直接拿 <label> 做显示容器
      return input[0].control ? $(input[0].control) : $('#' + input.attr('for')) ;
    }
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
      url += '?' + options.params;
    }
    return url
  }
}

CityPicker.hotLength = 5;