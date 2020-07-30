const cheerio = require('cheerio')
const moment = require('moment')

hexo.extend.filter.register('after_render:html', function (locals) {
  const $ = cheerio.load(locals)
  const post = $('#posts-chart')
  const tag = $('#tags-chart')
  const category = $('#categories-chart')
  let htmlEncode = false

  if (post.length > 0 || tag.length > 0 || category.length > 0) {
    $('head').after('<style type="text/css">#posts-chart,#categories-chart,#tags-chart{width: 100%;height: 300px;margin: 0.5rem auto;padding: 0.5rem;overflow-x: auto;}</style><script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts@4.7.0/dist/echarts.min.js"></script>')
    if (post.length > 0 && $('#postsChart').length === 0) {
      if (post.attr('data-encode') === 'true') htmlEncode = true
      post.after(postsChart())
    }
    if (tag.length > 0 && $('#tagsChart').length === 0) {
      if (tag.attr('data-encode') === 'true') htmlEncode = true
      tag.after(tagsChart(tag.attr('data-length')))
    }
    if (category.length > 0 && $('#categoriesChart').length === 0) {
      if (category.attr('data-encode') === 'true') htmlEncode = true
      category.after(categoriesChart())
    }
    if (htmlEncode) {
      return $.root().html().replace(/&amp;#/g, '&#')
    } else {
      return $.root().html()
    }
  } else {
    return locals
  }
}, 15)

function postsChart () {
  const startDate = moment().subtract(1, 'years').startOf('month')
  const endDate = moment().endOf('month')

  const monthMap = new Map()
  const dayTime = 3600 * 24 * 1000
  for (let time = startDate; time <= endDate; time += dayTime) {
    const month = moment(time).format('YYYY-MM')
    if (!monthMap.has(month)) {
      monthMap.set(month, 0)
    }
  }
  hexo.locals.get('posts').forEach(function (post) {
    const month = post.date.format('YYYY-MM')
    if (monthMap.has(month)) {
      monthMap.set(month, monthMap.get(month) + 1)
    }
  })
  const monthArr = JSON.stringify([...monthMap.keys()])
  const monthValueArr = JSON.stringify([...monthMap.values()])

  return `
  <script id="postsChart">
    let postsChart = echarts.init(document.getElementById('posts-chart'));
    let postsOption = {
        title: {
            text: '文章发布统计图',
            top: -5,
            x: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ${monthArr}
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '文章篇数',
                type: 'line',
                color: ['#6772e5'],
                data: ${monthValueArr},
                markPoint: {
                    symbolSize: 45,
                    color: ['#fa755a','#3ecf8e','#82d3f4'],
                    data: [{
                        type: 'max',
                        itemStyle: {color: ['#3ecf8e']},
                        name: '最大值'
                    }, {
                        type: 'min',
                        itemStyle: {color: ['#fa755a']},
                        name: '最小值'
                    }]
                },
                markLine: {
                    itemStyle: {color: ['#ab47bc']},
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    postsChart.setOption(postsOption);
    </script>`
}

function tagsChart (dataLength = 10) {
  const tagArr = []
  hexo.locals.get('tags').map(function (tag) {
    tagArr.push({ name: tag.name, value: tag.length })
  })
  tagArr.sort((a, b) => { return b.value - a.value })

  const tagNameArr = []
  const tagCountArr = []
  for (let i = 0, len = Math.min(tagArr.length, dataLength); i < len; i++) {
    tagNameArr.push(tagArr[i].name)
    tagCountArr.push(tagArr[i].value)
  }

  const tagNameArrJson = JSON.stringify(tagNameArr)
  const tagCountArrJson = JSON.stringify(tagCountArr)

  return `
  <script id="tagsChart">
    let tagsChart = echarts.init(document.getElementById('tags-chart'));
    let tagsOption = {
        title: {
            text: 'Top${dataLength}标签统计图',
            top: -5,
            x: 'center'
        },
        tooltip: {},
        xAxis: [
            {
                type: 'category',
                data: ${tagNameArrJson}
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                type: 'bar',
                color: ['#82d3f4'],
                barWidth : 18,
                data: ${tagCountArrJson},
                markPoint: {
                    symbolSize: 45,
                    data: [{
                        type: 'max',
                        itemStyle: {color: ['#3ecf8e']},
                        name: '最大值'
                    }, {
                        type: 'min',
                        itemStyle: {color: ['#fa755a']},
                        name: '最小值'
                    }],
                },
                markLine: {
                    itemStyle: {color: ['#ab47bc']},
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    tagsChart.setOption(tagsOption);
    </script>`
}

function categoriesChart () {
  const categoryArr = []
  hexo.locals.get('categories').map(function (category) {
    categoryArr.push({ name: category.name, value: category.length })
  })

  const categoryArrJson = JSON.stringify(categoryArr)

  return `
  <script id="categoriesChart">
    let categoriesChart = echarts.init(document.getElementById('categories-chart'));
    let categoriesOption = {
        title: {
            text: '文章分类统计图',
            top: -4,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '分类',
                type: 'pie',
                radius: '50%',
                color: ['#6772e5', '#ff9e0f', '#fa755a', '#3ecf8e', '#82d3f4', '#ab47bc', '#525f7f', '#f51c47', '#26A69A'],
                data: ${categoryArrJson},
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    categoriesChart.setOption(categoriesOption);
    </script>`
}
