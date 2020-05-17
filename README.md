将[matery主题](https://github.com/blinkfox/hexo-theme-matery)中的`文章发布统计图`、`标签统计图`、`文章分类统计图`做成了插件。

[Demo](https://demo.hclonely.com/posts/e8bb6eed/)

## 安装

```shell
npm install hexo-chart -S
```

## 使用

### 文章发布统计图

```html
<div id="posts-chart"></div>
```

### 标签统计图

```html
<!-- "data-length"为显示标签个数(从多到少)，默认为10 -->
<div id="tags-chart" data-length="10"></div>
```

### 文章分类统计图

```html
<div id="categories-chart"></div>
```

## 说明

如果出现文章中文目录乱码现象，请添加属性`data-encode="true"`.
因为使用`Tag`会导致文章获取不全，所以本插件直接使用`html标签`渲染，而不是使用`Tag`。
由于使用了`cheerio`模块，如果你使用了html压缩插件，可能会出现压缩报错，暂时无解。

## 截图

![](https://github.com/HCLonely/hexo-charts/raw/master/screenshot/2020-05-02-201802.png)
![](https://github.com/HCLonely/hexo-charts/raw/master/screenshot/2020-05-02-201849.png)
![](https://github.com/HCLonely/hexo-charts/raw/master/screenshot/2020-05-02-201935.png)

## 许可协议

[Apache License 2.0](https://github.com/HCLonely/hexo-charts/blob/master/LICENSE)