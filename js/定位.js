 // 创建定位控件
 var locationControl = new BMapGL.LocationControl({
    // 控件的停靠位置（可选，默认左上角）
    anchor: BMAP_ANCHOR_TOP_RIGHT,
    // 控件基于停靠位置的偏移量（可选）
    offset: new BMapGL.Size(100, 20)
});
// 将控件添加到地图上
map.addControl(locationControl);

// 添加定位事件
locationControl.addEventListener("locationSuccess", function(e){
    var address = '';
    address += e.addressComponent.province;
    address += e.addressComponent.city;
    address += e.addressComponent.district;
    address += e.addressComponent.street;
    address += e.addressComponent.streetNumber;
    alert("当前定位地址为：" + address);
});
locationControl.addEventListener("locationError",function(e){
    alert(e.message);
});