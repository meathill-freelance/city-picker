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
    $.get({
      url: url,
      dataType: 'json'
    })
      .then( json => {
        json = CityPicker.format(json);
        let html = list(json).split('<!-- split -->');
        container.removeClass('loading')
          .html(html[0]);
        this.$el.removeClass('loading')
          .append(html[1]);
        this.list = this.$el.find('.tqb-cp-list');
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
    el.appendTo(document.body);
    setTimeout( () => {
      el.removeClass('out');
    });
  }

  delegateEvents() {
    let self = this;
    this.$el
      .on('click', '.tqb-cp-list li:not(.label)', event => {
        this.$el.find('.select').removeClass('select');
        let li = $(event.currentTarget);
        li.toggleClass('select');
        this.target.val(li.text());
        this.input.val(li.data('id'));
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
          this.list.find('.list').removeClass('searching');
        }
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
    })
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
        len += 1;
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
}

CityPicker.hotLength = 5;