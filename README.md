天气宝 城市选择组件 City Picker
======================

A city picker component for 天气宝

这是供天气宝使用的城市选择组件，用在移动设备上。

[GitHub](https://github.com/meathill-freelance/city-picker/)

## 需求 Requirements

* [jQuery](https://jquery.com) >=3.1.1
* Mobile Devices

## 使用 Installation

本插件会自动初始化页面中含有 `.tqb-city-picker-input` 样式的标签，并将其设置为 `readonly`。使用时只需要引用响应的 CSS、JS 文件即可。

本插件会从目标 `<input>` 的 `data-*` 属性取初始化数据，目前支持以下两个参数：

| 参数 | 功能 |
|------|------|
| `url` | 取城市数据的接口地址，默认是当前页面的 `./assets/city.json` |
| `params` | 传给接口的参数，会直接连在 `url` 的后面 |
| `hot` | 前多少个为热门城市 |
| `source` | 全局变量的名称，用来取城市列表的数据，可能由其它 JS 绑定在 `window[source]` 上 |

### 范例

```html
<!doctype html>
<html>
<head>
  <meta name="viewport" content="initial-scale=1,user-scalable=no">
  <link rel="stylesheet" href="path/to/tqb-city-picker.min.css">
  <link rel="stylesheet" href="your/own/css/css.css">
</head>
<body>

<input type="text" class="tqb-city-picker-input" data-url="http://your.domain.com/path/to/city/api/" data-params="some=1&thing=2">
<script src="path/to/jquery.js"></script>
<script src="path/to/tqb-date-picker.min.js"></script>
<script src="path/to/your/own/js/js.js"></script>
</body>
```