
document.getElementById("toggleSidebar").addEventListener("click", function () {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("sidebar-hidden");
});
document.getElementById("toggleSidebar1").addEventListener("click", function () {
    var sidebar = document.getElementById("sidebar1");
    sidebar.classList.toggle("sidebar-hidden");
});


// 初始化地图
var map = new BMap.Map("map");
// 设置地图中心点和缩放级别
var point = new BMap.Point(107.98228, 26.58356);
map.centerAndZoom(point, 15);

// 添加默认缩放平移控件
map.addControl(new BMap.NavigationControl());
// 启用滚轮缩放
map.enableScrollWheelZoom(true);

// var geolocation = new BMap.Geolocation();
// geolocation.getCurrentPosition(function (r) {
//     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
//         var mk = new BMap.Marker(r.point);
//         map.addOverlay(mk);
//         map.panTo(r.point);
//     } else {
//         alert('定位失败：' + this.getStatus());
//     }
// }, { enableHighAccuracy: true });

// 添加定位控件
var geolocationControl = new BMap.GeolocationControl({
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    showAddressBar: true,
    enableAutoLocation: true
});
map.addControl(geolocationControl);

// 获取当前位置并设置为起点输入框的值
var startInput = document.getElementById("startPoint");
geolocationControl.addEventListener("locationSuccess", function (e) {
    var address = e.addressComponent;
    startInput.value = address.province + address.city + address.district + address.street + address.streetNumber;
});

// 初始化搜索框
var startAutocomplete = new BMap.Autocomplete({
    "input": "startPoint",
    "location": map
});
var endAutocomplete = new BMap.Autocomplete({
    "input": "endPoint",
    "location": map
});

// 路径规划地点列表点击事件
var locationList = document.getElementById("locationList");
locationList.addEventListener("click", function (e) {
    if (e.target.classList.contains("locationItem")) {
        var locationName = e.target.dataset.location;
        console.log(locationName);
        document.getElementById("endPoint").value = locationName;
    }
});

// 路径规划
function searchRoute() {
    var startPointName = document.getElementById("startPoint").value;
    var endPointName = document.getElementById("endPoint").value;

    if (!startPointName || !endPointName) {
        alert("请输入起点和终点");
        return;
    }

    // 使用百度地图的getPoint方法获取经纬度坐标
    var startSearch = new BMap.LocalSearch(map, {
        onSearchComplete: function (results) {
            var startPoint = results.getPoi(0).point;
            var endSearch = new BMap.LocalSearch(map, {
                onSearchComplete: function (results) {
                    var endPoint = results.getPoi(0).point;
                    // 清除之前的覆盖物（折线）
                    map.clearOverlays();

                    var driving = new BMap.DrivingRoute(map, {
                        renderOptions: { map: map, autoViewport: true },
                        onSearchComplete: function (results) {
                            if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                                var plan = results.getPlan(0);
                                var route = plan.getRoute(0);
                                var path = route.getPath();
                                var polyline = new BMap.Polyline(path);
                                map.addOverlay(polyline);
                            }
                        }
                    });
                    driving.search(startPoint, endPoint);
                }
            });
            endSearch.search(endPointName);
        }
    });
    startSearch.search(startPointName);
}
document.getElementById("routeButton").addEventListener("click", searchRoute);


// 初始化搜索框
var startAutocomplete1 = new BMap.Autocomplete({
    "input": "centerPoint",
    "location": map
});
// 周边推荐地点列表点击事件
var locationList1 = document.getElementById("locationList1");
locationList1.addEventListener("click", function (e) {
    if (e.target.classList.contains("locationItem1")) {
        var locationName1 = e.target.dataset.location;
        document.getElementById("centerPoint").value = locationName1;
    }
});

// 酒店推荐按钮点击事件
function searchHotel() {
    var centerPointName = document.getElementById("centerPoint").value;
    // 将地图缩小
    var nationalCenter = new BMap.Point(104.1954, 35.8617);
    map.centerAndZoom(nationalCenter, 5);

    if (!centerPointName) {
        alert("请输入中心点");
        return;
    }

    // 使用百度地图的Place Search API进行周边检索
    var local = new BMap.LocalSearch(map, {

        onSearchComplete: function (results) {
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                // 清除之前的覆盖物（标记）
                map.clearOverlays();
                // 获取检索结果
                var points = [];
                for (var i = 0; i < results.getCurrentNumPois(); i++) {
                    var poi = results.getPoi(i);
                    console.log(poi);
                    var point = poi.point;
                    points.push(point);
                    // 在地图上添加一个标记
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker);
                    // 添加信息窗口
                    var content = poi.title;
                    addInfoWindow(marker, content, point, poi);
                }
                // 将地图中心设置为检索结果的位置
                map.setViewport(points);
            }
        }
    });

    // 将中心点的地址转换为坐标
    var geo = new BMap.Geocoder();
    geo.getPoint(centerPointName, function (point) {
        if (point) {
            // 开始进行周边检索，以1000米为半径
            local.searchNearby("酒店", point, 5000);
            // local.searchNearby("酒店", centerPointName, 1000);
        } else {
            alert("无法获取中心点坐标，请检查输入地址是否正确");
        }
    }, "中国");
}
document.getElementById("hotelButton").addEventListener("click", searchHotel);

//饭店推荐
// 饭店推荐按钮点击事件
function searchRestaurant() {
    var centerPointName = document.getElementById("centerPoint").value;
    var nationalCenter = new BMap.Point(104.1954, 35.8617);
    map.centerAndZoom(nationalCenter, 5);

    if (!centerPointName) {
        alert("请输入中心点");
        return;
    }

    // 使用百度地图的Place Search API进行周边检索
    var local = new BMap.LocalSearch(map, {

        onSearchComplete: function (results) {
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                // 清除之前的覆盖物（标记）
                map.clearOverlays();
                // 获取检索结果
                var points = [];
                for (var i = 0; i < results.getCurrentNumPois(); i++) {
                    var poi = results.getPoi(i);
                    var point = poi.point;
                    points.push(point);
                    // 在地图上添加一个标记
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker);
                    // 添加信息窗口
                    var content = poi.title;
                    addInfoWindow(marker, content, point, poi);
                }
                // 将地图中心设置为检索结果的位置
                map.setViewport(points);
            }
        }
    });

    // 将中心点的地址转换为坐标
    var geo = new BMap.Geocoder();
    geo.getPoint(centerPointName, function (point) {
        if (point) {
            // 开始进行周边检索，以1000米为半径
            local.searchNearby("饭店", point, 3000);
            // local.searchNearby("酒店", centerPointName, 1000);
        } else {
            alert("无法获取中心点坐标，请检查输入地址是否正确");
        }
    }, "中国");
}
document.getElementById("restaurantButton").addEventListener("click", searchRestaurant);

function addInfoWindow(marker, content, point, poi) {
    // 创建信息窗口
    var infoWindow = new BMap.InfoWindow(content);

    // 创建一个查看详情的按钮
    var openLinkButton = document.createElement("button");
    openLinkButton.appendChild(document.createTextNode("查看详情"));
    openLinkButton.className = "info-window-button"; // 添加样式类

    // 绑定点击事件，打开链接
    openLinkButton.addEventListener("click", function () {
        window.open(poi.url, "_blank"); // 在新窗口中打开链接
    });

    // 创建一个到这去的按钮
    var goToButton = document.createElement("button");
    goToButton.appendChild(document.createTextNode("到这去"));
    goToButton.className = "info-window-button"; // 添加样式类

    // 绑定点击事件，路径规划，并将 poi.title 设置为终点搜索框的值
    goToButton.addEventListener("click", function () {
        document.getElementById("endPoint").value = poi.title;
        searchRoute(); // 触发路径规划
    });

    // 创建一个 div 包含两个按钮
    var contentDiv = document.createElement('div');
    contentDiv.innerHTML = content + "<br>";
    contentDiv.appendChild(openLinkButton);
    contentDiv.appendChild(goToButton);

    // 将按钮添加到信息窗口内容中
    infoWindow.setContent(contentDiv);

    // 绑定标记点击事件，打开信息窗口
    marker.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point);
    });
}

//链接部分
// function linkworks() {
//     var lng = localStorage.getItem("lng");
//     var lat = localStorage.getItem("lat");
//     console.log(lng, lat)

//     var map = new BMap.Map("map");
//     var point = new BMap.Point(parseFloat(lng), parseFloat(lat));
//     map.centerAndZoom(point, 15);

//     var geocoder = new BMap.Geocoder();
//     geocoder.getLocation(point, function (result) {
//         if (result) {
//             var address = result.address;
//             document.getElementById("centerPoint").value = address;  // 设置起点搜索框
//             document.getElementById("endPoint").value = address;  // 设置中心点搜索框
//         }
//     });
// }

function linkworks() {
    var lng = localStorage.getItem("lng");
    var lat = localStorage.getItem("lat");
    var worksname= localStorage.getItem('worksname');
    console.log(lng, lat,worksname);

    // var map = new BMap.Map("map");
    var point = new BMap.Point(parseFloat(lng), parseFloat(lat));
    map.centerAndZoom(point, 15);
    // document.getElementById("centerPoint").value = worksname;  // 设置起点搜索框
    //         document.getElementById("endPoint").value = worksname;  // 设置中心点搜索框
    var geocoder = new BMap.Geocoder();
    geocoder.getLocation(point, function (result) {
        if (result) {
            var address = result.address;
            document.getElementById("centerPoint").value = address;  // 设置起点搜索框
            document.getElementById("endPoint").value = address;  // 设置中心点搜索框
        }
    });
}
// 在页面加载完成时执行 linkworks 函数的标志
var executeLinkworks = localStorage.getItem("executeLinkworks");

// 如果标志存在并且为 "true"，则执行 linkworks 函数
if (executeLinkworks === "true") {
    linkworks();
}

// 清除标志，确保不会在单独打开时执行 linkworks
localStorage.removeItem("executeLinkworks");


// document.getElementById("toggleSidebar").addEventListener("click", function () {
//     var sidebar = document.getElementById("sidebar");
//     sidebar.classList.toggle("sidebar-hidden");
// });

// document.getElementById("toggleSidebar1").addEventListener("click", function () {
//     var sidebar = document.getElementById("sidebar1");
//     sidebar.classList.toggle("sidebar-hidden");
// });

// // 初始化地图
// var map = new BMap.Map("map");
// // 设置地图中心点和缩放级别
// var point = new BMap.Point(107.98228, 26.58356);
// map.centerAndZoom(point, 15);

// // 添加默认缩放平移控件
// map.addControl(new BMap.NavigationControl());
// // 启用滚轮缩放
// map.enableScrollWheelZoom(true);

// // 添加定位控件
// var geolocationControl = new BMap.GeolocationControl({
//     anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
//     showAddressBar: true,
//     enableAutoLocation: true
// });
// map.addControl(geolocationControl);

// // 获取当前位置并设置为起点输入框的值
// var startInput = document.getElementById("startPoint");
// geolocationControl.addEventListener("locationSuccess", function (e) {
//     var address = e.addressComponent;
//     startInput.value = address.province + address.city + address.district + address.street + address.streetNumber;
// });

// // 初始化搜索框
// var startAutocomplete = new BMap.Autocomplete({
//     "input": "startPoint",
//     "location": map
// });
// var endAutocomplete = new BMap.Autocomplete({
//     "input": "endPoint",
//     "location": map
// });

// // 路径规划地点列表点击事件
// var locationList = document.getElementById("locationList");
// locationList.addEventListener("click", function (e) {
//     if (e.target.classList.contains("locationItem")) {
//         var locationName = e.target.dataset.location;
//         console.log(locationName);
//         document.getElementById("endPoint").value = locationName;
//     }
// });

// // 路径规划
// function searchRoute(lng, lat) {
//     var startPoint = new BMap.Point(lng, lat);
//     var endPointName = document.getElementById("endPoint").value;

//     if (!endPointName) {
//         alert("请输入终点");
//         return;
//     }

//     var endSearch = new BMap.LocalSearch(map, {
//         onSearchComplete: function (results) {
//             var endPoint = results.getPoi(0).point;
//             // 清除之前的覆盖物（折线）
//             map.clearOverlays();

//             var driving = new BMap.DrivingRoute(map, {
//                 renderOptions: { map: map, autoViewport: true },
//                 onSearchComplete: function (results) {
//                     if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
//                         var plan = results.getPlan(0);
//                         var route = plan.getRoute(0);
//                         var path = route.getPath();
//                         var polyline = new BMap.Polyline(path);
//                         map.addOverlay(polyline);
//                     }
//                 }
//             });
//             driving.search(startPoint, endPoint);
//         }
//     });
//     endSearch.search(endPointName);
// }

// document.getElementById("routeButton").addEventListener("click", function () {
//     var lng = localStorage.getItem("lng");
//     var lat = localStorage.getItem("lat");
//     searchRoute(parseFloat(lng), parseFloat(lat));
// });

// // 初始化搜索框
// var startAutocomplete1 = new BMap.Autocomplete({
//     "input": "centerPoint",
//     "location": map
// });

// // 周边推荐地点列表点击事件
// var locationList1 = document.getElementById("locationList1");
// locationList1.addEventListener("click", function (e) {
//     if (e.target.classList.contains("locationItem1")) {
//         var locationName1 = e.target.dataset.location;
//         document.getElementById("centerPoint").value = locationName1;
//     }
// });

// // 酒店推荐按钮点击事件
// function searchHotel(lng, lat) {
//     var centerPoint = new BMap.Point(lng, lat);
//     // 将地图缩小
//     var nationalCenter = new BMap.Point(104.1954, 35.8617);
//     map.centerAndZoom(nationalCenter, 5);

//     var local = new BMap.LocalSearch(map, {
//         onSearchComplete: function (results) {
//             if (local.getStatus() == BMAP_STATUS_SUCCESS) {
//                 // 清除之前的覆盖物（标记）
//                 map.clearOverlays();
//                 // 获取检索结果
//                 var points = [];
//                 for (var i = 0; i < results.getCurrentNumPois(); i++) {
//                     var poi = results.getPoi(i);
//                     console.log(poi);
//                     var point = poi.point;
//                     points.push(point);
//                     // 在地图上添加一个标记
//                     var marker = new BMap.Marker(point);
//                     map.addOverlay(marker);
//                     // 添加信息窗口
//                     var content = poi.title;
//                     addInfoWindow(marker, content, point, poi);
//                 }
//                 // 将地图中心设置为检索结果的位置
//                 map.setViewport(points);
//             }
//         }
//     });

//     // 开始进行周边检索，以1000米为半径
//     local.searchNearby("酒店", centerPoint, 1000);
// }

// document.getElementById("hotelButton").addEventListener("click", function () {
//     var lng = localStorage.getItem("lng");
//     var lat = localStorage.getItem("lat");
//     searchHotel(parseFloat(lng), parseFloat(lat));
// });

// // 饭店推荐按钮点击事件
// function searchRestaurant(lng, lat) {
//     var centerPoint = new BMap.Point(lng, lat);
//     var nationalCenter = new BMap.Point(104.1954, 35.8617);
//     map.centerAndZoom(nationalCenter, 5);

//     var local = new BMap.LocalSearch(map, {
//         onSearchComplete: function (results) {
//             if (local.getStatus() == BMAP_STATUS_SUCCESS) {
//                 // 清除之前的覆盖物（标记）
//                 map.clearOverlays();
//                 // 获取检索结果
//                 var points = [];
//                 for (var i = 0; i < results.getCurrentNumPois(); i++) {
//                     var poi = results.getPoi(i);
//                     var point = poi.point;
//                     points.push(point);
//                     // 在地图上添加一个标记
//                     var marker = new BMap.Marker(point);
//                     map.addOverlay(marker);
//                     // 添加信息窗口
//                     var content = poi.title;
//                     addInfoWindow(marker, content, point, poi);
//                 }
//                 // 将地图中心设置为检索结果的位置
//                 map.setViewport(points);
//             }
//         }
//     });

//     // 开始进行周边检索，以3000米为半径
//     local.searchNearby("饭店", centerPoint, 1000);
// }

// document.getElementById("restaurantButton").addEventListener("click", function () {
//     var lng = localStorage.getItem("lng");
//     var lat = localStorage.getItem("lat");
//     searchRestaurant(parseFloat(lng), parseFloat(lat));
// });

// function addInfoWindow(marker, content, point, poi) {
//     // 创建信息窗口
//     var infoWindow = new BMap.InfoWindow(content);

//     // 创建一个查看详情的按钮
//     var openLinkButton = document.createElement("button");
//     openLinkButton.appendChild(document.createTextNode("查看详情"));
//     openLinkButton.className = "info-window-button"; // 添加样式类

//     // 绑定点击事件，打开链接
//     openLinkButton.addEventListener("click", function () {
//         window.open(poi.url, "_blank"); // 在新窗口中打开链接
//     });

//     // 创建一个到这去的按钮
//     var goToButton = document.createElement("button");
//     goToButton.appendChild(document.createTextNode("到这去"));
//     goToButton.className = "info-window-button"; // 添加样式类

//     // 绑定点击事件，路径规划，并将 poi.title 设置为终点搜索框的值
//     goToButton.addEventListener("click", function () {
//         document.getElementById("endPoint").value = poi.title;
//         searchRoute(parseFloat(lng), parseFloat(lat)); // 触发路径规划
//     });

//     // 创建一个 div 包含两个按钮
//     var contentDiv = document.createElement('div');
//     contentDiv.innerHTML = content + "<br>";
//     contentDiv.appendChild(openLinkButton);
//     contentDiv.appendChild(goToButton);

//     // 将按钮添加到信息窗口内容中
//     infoWindow.setContent(contentDiv);

//     // 绑定标记点击事件，打开信息窗口
//     marker.addEventListener("click", function () {
//         map.openInfoWindow(infoWindow, point);
//     });
// }


// function linkworks() {
//     var lng = localStorage.getItem("lng");
//     var lat = localStorage.getItem("lat");

//     searchRoute(parseFloat(lng), parseFloat(lat));
//     searchHotel(parseFloat(lng), parseFloat(lat));
//     searchRestaurant(parseFloat(lng), parseFloat(lat));

//     var worksname = localStorage.getItem('worksname');
//     console.log(lng, lat);

//     var point = new BMap.Point(parseFloat(lng), parseFloat(lat));
//     map.centerAndZoom(point, 15);

//     var geocoder = new BMap.Geocoder();
//     geocoder.getLocation(point, function (result) {
//         if (result) {
//             var address = result.address;
//             document.getElementById("centerPoint").value = address;  // 设置起点搜索框
//             document.getElementById("endPoint").value = address;  // 设置中心点搜索框
//         }
//     });
// }

// // 在页面加载完成时执行 linkworks 函数的标志
// var executeLinkworks = localStorage.getItem("executeLinkworks");

// // 如果标志存在并且为 "true"，则执行 linkworks 函数
// if (executeLinkworks === "true") {
//     linkworks();
// }

// // 清除标志，确保不会在单独打开时执行 linkworks
// localStorage.removeItem("executeLinkworks");
