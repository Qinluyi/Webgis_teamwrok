
$(function(){


    initMap();





})
//地图界面高度设置



//加载地图
function initMap(){
// 百度地图API功能
    var map = new BMap.Map("map_div");    // 创建Map实例
    map.centerAndZoom(new BMap.Point(106.713478, 26.578343), 8);  // 初始化地图,设置中心点坐标和地图级别

    var disProvince = new BMap.DistrictLayer.Province({
        adcode: [520000],
        opacity :0.8,
        depth: 1,
        styles: {
            fill: function (properties) {
              // properties为可用于做样式映射的字段，包含
              // NAME_CHN:中文名称
              // adcode_pro
              // adcode_cit
              // adcode
              var adcode = properties.adcode;
              return getColorByAdcode(adcode);
            },
            "province-stroke": "cornflowerblue",
            "city-stroke": "white", // 中国地级市边界
            "county-stroke": "rgba(255,255,255,0.5)", // 中国区县边界
          },
    });
    // 设置图层对应的map对象
    disProvince.setMap(map);

    // 颜色辅助方法 为了是改变各个版块的颜色 方便区分
    var colors = {};
    var getColorByAdcode = function (adcode) {
      if (!colors[adcode]) {
        var gb = Math.random() * 155 + 50;
        colors[adcode] = "rgb(" + gb + "," + gb + ",255)";
      }

      return colors[adcode];
    };

    // //添加地图类型控件
    // var size1 = new BMap.Size(10, 50);
    // map.addControl(new BMap.MapTypeControl({
    //     offset: size1,
    //     mapTypes:[
    //         BMAP_NORMAL_MAP,
    //         BMAP_HYBRID_MAP,

    //     ]}));
    
    // //设备地图颜色
    // var mapStyle={
    //     style:"midnight"
    // };
    // map.setMapStyle(mapStyle);





// //加载城市控件
//     var size = new BMap.Size(10, 50);
//     map.addControl(new BMap.CityListControl({
//         anchor: BMAP_ANCHOR_TOP_LEFT,
//         offset: size,


//     }));
}

