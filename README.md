# EchartsMap

[![standard-readme compliant](https://img.shields.io/badge/readme style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)![https://img.shields.io/badge/build-passing-brightgreen](https://img.shields.io/badge/build-passing-brightgreen)

## 项目背景
*echartsMap* 是基於 *echarts* 和 *jQuery* 集成的，用於生成各個城市的流向地圖及熱力地圖的方法。由於方法需要利用 *ajax* 接入 *geoJson* 數據，所以直接打開頁面顯示不了，需要啓用 *http* 服務。

## 安装

- git clone

```javascript
git clone https://github.com/Eclair-H/EchartsMap.git
```

## 使用

### 引入

引入* jQuery.js* 以及 *echarts.js*

下载地址：[jQuery 下載地址](https://jquery.com/download/)；[echarts 下載地址](https://echarts.apache.org/zh/download.html)

### 参数定义

#### id

- **必填，** 需要生成地图 DIV 的 ID

#### area

- **必填，** 所需区域/城市的名字，如：`shanghai`,`china`

#### data

- **必填，** 数据

- 流向图数据格式示例：

  ```javascript
  var data = [
    {
      startLat: '31.28', // 流向起点/终点 纬度
      startLng: '121.46', // 流向起点/终点 经度
      tollStationName: '上海', // 流向起点/终点 城市名
      tollStationCount: 12345, // 流向起点/终点数值，可无
      // 流出/流入城市数据 可填写多个，可不填，但不可没有 list 值
      list: [
        {
          fromToTollStationName: '合肥市', // 流出/流入 城市名
          startLat: '31.86', // 流出/流入 纬度
          startLng: '117.28', // 流出/流入 经度
          trafficFlow: 123, // 流出/流入 数值，可无
        },
      ],
    },
  ];
  ```

- 热力图数据格式示例：

  ```javascript
  var data2 = [
    { name: '嘉定区', value: 94450 },
    { name: '奉贤区', value: 50152 },
    { name: '宝山区', value: 82343 },
    { name: '崇明区', value: 11399 },
    { name: '徐汇区', value: 97974 },
    { name: '普陀区', value: 39727 },
    { name: '杨浦区', value: 105730 },
    { name: '松江区', value: 96023 },
    { name: '浦东新区', value: 306592 },
    { name: '虹口区', value: 24600 },
    { name: '金山区', value: 44584 },
    { name: '长宁区', value: 36863 },
    { name: '闵行区', value: 164701 },
    { name: '青浦区', value: 47151 },
    { name: '静安区', value: 39730 },
    { name: '黄浦区', value: 31009 },
  ];
  ```

#### type

- **必填，** 生成图类型
- **0 为热力图；1 为流入流向图；2 为流出流向图**

#### setting

- **选填，** 替换默认配置，详见 [echarts 官网](https://echarts.apache.org/zh/option.html#title)

- 可替换配置示例：

  ```javascript
  var setting = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} {c} ',
    },
  };
  ```

## 主要项目负责人

[@Eclair-H](https://github.com/Eclair-H)

## 开源协议

[MIT © Eclair Howe.](../LICENSE)
