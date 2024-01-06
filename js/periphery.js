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

var opt = {
    anchor: BMAP_ANCHOR_TOP_RIGHT,
};
map.addControl(new BMap.NavigationControl(opt));
// 启用滚轮缩放
map.enableScrollWheelZoom(true);

//自动定位
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
    // anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    anchor:new BMap.Size(50, 50),
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
                    // 清除之前的覆盖物
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

function searchWalkingRoute() {
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
                    // 清除之前的覆盖物
                    map.clearOverlays();

                    var walking = new BMap.WalkingRoute(map, {
                        renderOptions: { map: map, autoViewport: true },
                        onSearchComplete: function (results) {
                            if (walking.getStatus() == BMAP_STATUS_SUCCESS) {
                                var plan = results.getPlan(0);
                                var route = plan.getRoute(0);
                                var path = route.getPath();
                                var polyline = new BMap.Polyline(path);
                                map.addOverlay(polyline);
                            }
                        }
                    });
                    walking.search(startPoint, endPoint);
                }
            });
            endSearch.search(endPointName);
        }
    });
    startSearch.search(startPointName);
}
document.getElementById("routewalkButton").addEventListener("click", searchWalkingRoute);

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
                // 清除之前的覆盖物
                map.clearOverlays();
                // 获取检索结果
                var points = [];
                for (var i = 0; i < results.getCurrentNumPois(); i++) {
                    var poi = results.getPoi(i);
                    console.log(poi);
                    var point = poi.point;
                    points.push(point);
                    // 在地图上添加标记
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
            local.searchNearby("酒店", point, 5000);
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
                // 清除之前的覆盖物
                map.clearOverlays();
                // 获取检索结果
                var points = [];
                for (var i = 0; i < results.getCurrentNumPois(); i++) {
                    var poi = results.getPoi(i);
                    var point = poi.point;
                    points.push(point);
                    // 在地图上添加标记
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
            local.searchNearby("饭店", point, 5000);
        } else {
            alert("无法获取中心点坐标，请检查输入地址是否正确");
        }
    }, "中国");
}
document.getElementById("restaurantButton").addEventListener("click", searchRestaurant);

function addInfoWindow(marker, content, point, poi) {
    // 创建信息窗口
    var infoWindow = new BMap.InfoWindow(content);

    // 创建查看详情按钮
    var openLinkButton = document.createElement("button");
    openLinkButton.appendChild(document.createTextNode("查看详情"));
    openLinkButton.className = "info-window-button"; // 添加样式类

    // 绑定点击事件，打开链接
    openLinkButton.addEventListener("click", function () {
        window.open(poi.url, "_blank");
    });

    // 创建到这去的按钮
    var goToButton = document.createElement("button");
    goToButton.appendChild(document.createTextNode("到这去"));
    goToButton.className = "info-window-button";

    // 绑定点击事件，路径规划
    goToButton.addEventListener("click", function () {
        document.getElementById("endPoint").value = poi.title;
    });

    // 创建从这出发的按钮
    var fromButton = document.createElement("button");
    fromButton.appendChild(document.createTextNode("从这出发"));
    fromButton.className = "info-window-button";

    // 绑定点击事件，路径规划
    fromButton.addEventListener("click", function () {
        document.getElementById("startPoint").value = poi.title;
    });

    // 创建周边推荐的按钮
    var roundrecommButton = document.createElement("button");
    roundrecommButton.appendChild(document.createTextNode("周边推荐"));
    roundrecommButton.className = "info-window-button";

    // 绑定点击事件，周边推荐
    roundrecommButton.addEventListener("click", function () {
        document.getElementById("centerPoint").value = poi.title;
    });
    // 创建 div 包含所有按钮
    var contentDiv = document.createElement('div');
    contentDiv.innerHTML = content + "<br>";
    contentDiv.appendChild(openLinkButton);
    contentDiv.appendChild(goToButton);
    contentDiv.appendChild(fromButton);
    contentDiv.appendChild(roundrecommButton);

    // 将按钮添加到信息窗口内容中
    infoWindow.setContent(contentDiv);

    // 绑定标记点击事件，打开信息窗口
    marker.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point);
    });
}

function addInfoWindow1(marker, content, point, isback) {
    var address;
    var geocoder = new BMap.Geocoder();
    geocoder.getLocation(point, function (result) {
        if (result) {
            var addressComponents = result.addressComponents;
            address = addressComponents.province + addressComponents.city + addressComponents.district +
                addressComponents.street + addressComponents.streetNumber;

            console.log(address);
        }
    });
    // 创建信息窗口
    var infoWindow = new BMap.InfoWindow(content);
    var contentDiv = document.createElement('div');
    contentDiv.innerHTML = content + "<br>";
    if (isback == 1) {
        // 创建查看详情的按钮
        var openLinkButton = document.createElement("button");
        openLinkButton.appendChild(document.createTextNode("查看详情"));
        openLinkButton.className = "info-window-button"; 

        openLinkButton.addEventListener("click", function () {
            map.openInfoWindow(infoWindow, point);
            window.history.back();
        });
        contentDiv.appendChild(openLinkButton);
    }
    // 创建到这去的按钮
    var goToButton = document.createElement("button");
    goToButton.appendChild(document.createTextNode("到这去"));
    goToButton.className = "info-window-button"; 

    // 绑定点击事件，路径规划
    goToButton.addEventListener("click", function () {
        document.getElementById("endPoint").value = address;
    });

    // 创建从这出发的按钮
    var fromButton = document.createElement("button");
    fromButton.appendChild(document.createTextNode("从这出发"));
    fromButton.className = "info-window-button"; 

    // 绑定点击事件，路径规划
    fromButton.addEventListener("click", function () {
        document.getElementById("startPoint").value = address;
    });

    // 创建周边推荐的按钮
    var roundrecommButton = document.createElement("button");
    roundrecommButton.appendChild(document.createTextNode("周边推荐"));
    roundrecommButton.className = "info-window-button"; // 添加样式类

    // 绑定点击事件，周边推荐
    roundrecommButton.addEventListener("click", function () {
        document.getElementById("centerPoint").value = address;
    });

    contentDiv.appendChild(goToButton);
    contentDiv.appendChild(fromButton);
    contentDiv.appendChild(roundrecommButton);

    // 将按钮添加到信息窗口内容中
    infoWindow.setContent(contentDiv);

    // 绑定标记点击事件，打开信息窗口
    marker.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point);
    });
}

function linkworks() {
    var lng = localStorage.getItem("lng");
    var lat = localStorage.getItem("lat");
    var worksname = localStorage.getItem('worksname');
    console.log(lng, lat);

    var point = new BMap.Point(parseFloat(lng), parseFloat(lat));
    // 在地图上添加标记
    var myPurpleIcon = new BMap.Icon('../imgs/marker.png', new BMap.Size(18, 27), { "imageOffset": new BMap.Size(-72, -22) });
    var newMarker = new BMap.Marker(point, { icon: myPurpleIcon });
    map.addOverlay(newMarker);
    map.centerAndZoom(point, 15);
    addInfoWindow1(newMarker, worksname, point, 1);
}
// 在页面加载完成时执行 linkworks 函数的标志
var executeLinkworks = localStorage.getItem("executeLinkworks");

// 如果标志存在并且为 "true"，则执行 linkworks 函数
if (executeLinkworks === "true") {
    linkworks();
}

// 清除标志，确保不会在单独打开时执行 linkworks
localStorage.removeItem("executeLinkworks");

//显示点位
document.getElementById("showAllLocationsBtn").addEventListener("click", function () {
    // 异步加载 JSON 文件
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var locationsData = JSON.parse(xhr.responseText);
            displayAllLocations(locationsData);
        }
    };
    xhr.open("GET", "../json/合作社.json", true);
    xhr.send();
});

function displayAllLocations(locationsData) {
    // 清除之前的所有覆盖物
    map.clearOverlays();

    // 循环添加所有合作社的标记
    for (var i = 0; i < locationsData.length; i++) {
        var location = locationsData[i];
        var point = new BMap.Point(location.lng, location.lat);
        var myPurpleIcon = new BMap.Icon('../imgs/marker.png', new BMap.Size(18, 27), { "imageOffset": new BMap.Size(-18, -22) });
        var marker = new BMap.Marker(point, { icon: myPurpleIcon });
        map.addOverlay(marker);

        // 添加信息窗口
        addInfoWindow1(marker, location.name, point, 0);
    }

    // 将地图缩放到合适的级别，显示所有点位
    map.setViewport(locationsData.map(function (location) {
        return new BMap.Point(location.lng, location.lat);
    }));
}

document.getElementById("showEmbroideryBtn").addEventListener("click", function () {
    // 异步加载 JSON 文件
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var locationsData = JSON.parse(xhr.responseText);
            showEmbroidery(locationsData);
        }
    };
    xhr.open("GET", "../json/绣品.json", true);
    xhr.send();
});

function showEmbroidery(locationsData) {
    // 清除之前的所有覆盖物
    map.clearOverlays();

    // 循环添加所有合作社的标记
    for (var i = 0; i < locationsData.length; i++) {
        var location = locationsData[i];
        var point = new BMap.Point(location.经度, location.纬度);
        var myPurpleIcon = new BMap.Icon('../imgs/marker.png', new BMap.Size(18, 27), { "imageOffset": new BMap.Size(-54, -22) });
        var marker = new BMap.Marker(point, { icon: myPurpleIcon });
        map.addOverlay(marker);

        // 添加信息窗口
        addInfoWindow1(marker, location.名字, point, 0);
    }

    // 将地图缩放到合适的级别，显示所有点位
    map.setViewport(locationsData.map(function (location) {
        return new BMap.Point(location.经度, location.纬度);
    }));
}

document.getElementById("showCulturalPlacesBtn").addEventListener("click", function () {
    // 异步加载 JSON 文件
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var locationsData = JSON.parse(xhr.responseText);
            showCulturalPlaces(locationsData);
        }
    };
    xhr.open("GET", "../json/MiaoXiu_travel.json", true);
    xhr.send();
});

function showCulturalPlaces(locationsData) {
    // 清除之前的所有覆盖物
    map.clearOverlays();

    // 循环添加所有合作社的标记
    for (var i = 0; i < locationsData.length; i++) {
        var location = locationsData[i];
        var point = new BMap.Point(location.lng, location.lat);
        var myPurpleIcon = new BMap.Icon('../imgs/marker.png', new BMap.Size(18, 27), { "imageOffset": new BMap.Size(-0, -22) });
        var marker = new BMap.Marker(point, { icon: myPurpleIcon });
        map.addOverlay(marker);

        // 添加信息窗口
        addInfoWindow1(marker, location.name, point, 0);
    }

    // 将地图缩放到合适的级别，显示所有点位
    map.setViewport(locationsData.map(function (location) {
        return new BMap.Point(location.lng, location.lat);
    }));
}