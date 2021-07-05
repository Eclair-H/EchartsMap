/**
 * @description: 生成各个城市的流向图或者热力地图方法，由于调用ajax，需要启用服务
 * @param {*} id 需要生成div的id 必填
 * @param {*} area 需要生成地图的城市/区域 必填
 * @param {*} data 数据 必填
 * @param {*} type 生成图类型 0为热力图；1为流入流向图；2为流出流向图 必填
 * @param {*} setting 替换默认配置 选填
 * @return {*}
 * @Author: Eclair
 * @Date: 2021-06-02
 */
function mapCharts(id, area, data, type, setting) {
  var mapEcharts; //定义一下全局画图对象
  // 判断是否有已生成图画对象
  if (mapEcharts != null && mapEcharts != '' && mapEcharts != undefined) {
    mapEcharts.dispose(); //销毁
  }
  mapEcharts = echarts.init(document.getElementById(id));
  // 异步获取城市数据
  $.get('./js/map/json/' + area + '.json', function (geoJson) {
    echarts.registerMap(area, geoJson, {}); // 根据获取城市区域绘制地图
    var defaultOption = {};
    if (type == 0) {
      // console.log('热力图');
      defaultOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>{c} ',
        },
        visualMap: {
          show: true,
          // type: 'piecewise',
          min: 0,
          max: 300000,
          text: ['High', 'Low'],
          left: 'right',
          realtime: false,
          calculable: true,
          inRange: {
            color: ['rgba(147, 235, 248, 0.2)', '#FFE63F'],
          },
          textStyle: {
            color: '#fff',
          },
        },
        series: [
          {
            type: 'map',
            mapType: area,
            aspectScale: 0.75, //地图长度比
            itemStyle: {
              normal: {
                borderColor: '#069FEE',
                borderWidth: 1,
                areaColor: 'rgba(147, 235, 248, .2)',
              },
            },
            label: {
              normal: {
                show: false,
                formatter: '{b}\n{c}',
                textStyle: {
                  color: '#fff',
                },
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#fff',
                },
                // 地图区域的高亮颜色
                areaColor: 'blue',
              },
            },
            data: data,
          },
        ],
      };
    } else {
      let mapdata = resetData(data, type); //画流向图之前调用该方法，整理后台返回数据，获得最终所需数据
      // console.log(mapdata);
      defaultOption = {
        tooltip: {
          formatter: function (params) {
            // console.log(params);
            if (params.componentSubType == 'effectScatter') {
              return params.data.name + '<br/>' + params.data.traffiFlow; //这里是鼠标移入每个标志点所显示的文字内容
            }
            if (params.componentSubType == 'lines') {
              return params.data.fromName + '->' + params.data.toName;
            }
          },
        },
        //线颜色及飞行轨道颜色
        visualMap: [
          {
            show: false,
            // type: 'piecewise',
            min: 0,
            max: 300,
            text: ['High', 'Low'],
            seriesIndex: [2],
            left: 'right',
            realtime: false,
            calculable: true,
            inRange: {
              color: ['rgba(147, 235, 248, 0.2)', '#FFE63F'],
            },
            textStyle: {
              color: '#fff',
            },
          },
        ],
        geo: {
          map: area,
          zoom: 1.2,
          aspectScale: 0.75, //地图长度比
          roam: false, //  鼠标缩放和 平移漫游
          itemStyle: {
            normal: {
              areaColor: '#6ea5f7',
              label: {
                show: false,
              },
            },
          },
        },
        series: [
          {
            name: '',
            type: 'lines', //在 地理坐标系上画线图
            zlevel: 2,
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: 'arrow', // 图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
              symbolSize: 10,
            },
            lineStyle: {
              normal: {
                color: '#feb43b',
                width: 2,
                opacity: 0.6,
                curveness: 0.2,
              },
            },
            data: mapdata.linesData,
          },
          {
            name: '',
            type: 'effectScatter', //在地理坐标系画出所有的标志点
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stoke',
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: function (params) {
                  // return params.data.name
                  // 判断是否为起始点/终点
                  if (params.data.type === mapdata.totalType) {
                    return params.data.name;
                  } else {
                    return '';
                  }
                },
              },
            },
            symbol: 'circle',
            // symbolSize: 20,
            symbolSize: function (value, params) {
              if (params.data.type === mapdata.totalType) {
                //标志点的大小
                return 20;
              } else {
                return 10;
              }
            },
            itemStyle: {
              normal: {
                color: '#feb43b',
                borderColor: 'white',
              },
            },
            data: mapdata.effectScatterData,
          },
          {
            type: 'map',
            map: 'changsanjiao',
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            roam: true,
            animation: false,
            data: mapdata.heatData,
          },
        ],
      };
    }
    if (defaultOption && typeof defaultOption === 'object') {
      // 用传入配置替换默认配置
      let option = $.extend(defaultOption, setting);
      mapEcharts.setOption(option, true);
    }
  });

  // data代表返回的数据
  // type为1，流入；type为2 流出。
  function resetData(data, type) {
    let result = {
      totalType: '', //总的为流入还是流出
      falseTotalType: '', //totalType为lr，则falseTotalType为lc；反之为lr
      linesData: [], // 流向图数据
      effectScatterData: [], // 强调点数据
      heatData: [], // 热力数据
    };
    if (type == 1) {
      result.totalType = 'lr';
      result.falseTotalType = 'lc';
    } else {
      result.totalType = 'lc';
      result.falseTotalType = 'lr';
    }
    data.forEach((item, index) => {
      result.effectScatterData.push({
        type: result.totalType,
        // i: index + 1,
        traffiFlow: item.tollStationCount,
        name: item.tollStationName,
        value: [item.startLng, item.startLat],
      });
      // console.log(result.effectScatterData);
      result.heatData.push({
        name: item.tollStationName,
        value: item.tollStationCount,
      });
      item.list.forEach((el, i) => {
        if (type == 1) {
          //判断是流入图还是流出图，1为流入
          result.linesData.push({
            fromName: el.fromToTollStationName, //开始地点name
            toName: item.tollStationName, //目的地地点name
            coords: [
              [el.startLng, el.startLat], //开始地点的坐标
              [item.startLng, item.startLat], //目的地的坐标
            ],
          });
        } else {
          //流出的话，就调换开始和结束的位置即可
          result.linesData.push({
            fromName: item.tollStationName,
            toName: el.fromToTollStationName,
            coords: [
              [item.startLng, item.startLat],
              [el.startLng, el.startLat],
            ],
          });
        }
        result.effectScatterData.push({
          //这里就是把所有的要标注的位置给集合一下，不管是流入还是流出
          type: result.falseTotalType,
          // i: i + 1,
          traffiFlow: el.trafficFlow,
          name: el.fromToTollStationName,
          value: [el.startLng, el.startLat],
        });
        result.heatData.push({
          name: el.fromToTollStationName,
          value: el.trafficFlow,
        });
      });
    });
    // console.log(result);
    return result;
  }
}
