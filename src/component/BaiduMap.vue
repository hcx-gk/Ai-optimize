<template>
    
        
        <div id="container" style="width: 50%;height: 1000px;margin-left: 20%;"></div>
    </div>
    
    
  </template>
  
  <script>
  import * as echarts from 'echarts';

  export default {
    name: 'BaiduMap',
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        
        // 创建地图实例
        
        const map = new BMap.Map("container"); // 创建Map实例
        const point = new BMap.Point(116.6819, 23.3682); // 创建汕头的点坐标
        map.centerAndZoom(point, 15); // 初始化地图，设置中心点和缩放级别
        map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
        map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
        map.addControl(new BMap.OverviewMapControl()); // 添加缩略图控件
        map.addControl(new BMap.MapTypeControl()); // 添加地图类型控件
        map.setCurrentCity("汕头"); // 设置地图显示的城市
        map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      }
    }
  };
  </script>
  
  <style scoped>
  </style>