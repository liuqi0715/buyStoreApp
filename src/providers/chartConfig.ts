  import {Injectable} from '@angular/core';
import ECharts from 'echarts';

@Injectable()
export class chartConfig {

  constructor() {
    
  }

  public getConfig() {
      var dpr = window.devicePixelRatio;
      var ratio = dpr>1?1:0.5;
      let option = {
            title: {
                // text: '折线图堆叠',
                // subtext:"单位：元",
                subtextStyle:{
                    color:"white"
                }
            },
            // tooltip: {
            //     trigger: 'axis',
            //     //formatter: "{a}"
            // },
            // legend: {
            //     // data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
            // },
            grid: {
                left: '4%',
                right: '-3%',
                bottom: '19%',
                top:"10%",
                containLabel: true,
            },
            label:{ 
                normal:{ 
                show: true, 
                position: 'top' //点上显示数据---
                } 
              },
            toolbox: {
               /*  feature: {
                    saveAsImage: {}
                } */
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                  fontSize: Math.ceil(12*ratio),
                },
                boundaryGap: false,
                data: null,
                axisLine:{              //这个属性是改变坐标轴X轴颜色，和字体颜色
                         lineStyle:{
                             color:'#FFF',
                             width:Math.ceil(2*ratio),//这里是为了突出显示加上的,这里是X轴宽度
                         }
                }
                // splitLine: {        //这里设置的是分割线条的颜色
                //     lineStyle: {
                //         color: "#88CCC8"
                //     },
                //     show:true,
                // },
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 0,
                splitNumber:10,      //200
                axisLine:{              //这个属性是改变坐标轴X轴颜色，和字体颜色
                    lineStyle:{
                        color:'#88CCC8',
                        width:Math.ceil(2*ratio),//这里是为了突出显示加上的,这里是X轴宽度
                    }
                },
                splitLine: {        //这里设置的是分割线条的颜色
                    // lineStyle: {
                    //     color: "#88CCC8"
                    // },
                    show: false
                },
                axisTick:{
                  show:false
              },
              axisLabel : {
                formatter: function(){
                      return "";
                }
            }
            },
            series: [
                {
                  name:'平均价格',
                    type:'line',
                    // stack: '总量',
                    symbol: 'circle',
                    symbolSize: Math.ceil(6*ratio),
                    areaStyle: {normal: {
                         color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
                             {offset: 0, color: '#219E8E'},{offset: 1, color: '#5CBFB2'}
                       ], false)
                    }},
                    label:{
                       show:true,
                       color:'#FFF',
                       fontSize:Math.ceil(12*ratio),
                       position:'top',
                       offset:[10,-5]
                       // distance:10
                    },
                    data:null,      //接受数据++++++++++++++++++++++++
                    itemStyle : {
                        normal : {
                            color:'#8DD6D7',
                            lineStyle:{
                                width:2*ratio,
                                color:'#8DD6D7'
                            }
                        }
                    }
                },

            ]
        };
        return option;
  }

}
