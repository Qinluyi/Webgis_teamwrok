var my_switch = false;
var id;
var is_class;
var lng;
var lat;
var executeLinkworks;
var worksname;


window.onload = function(){
    id = localStorage.getItem("item_id"); //获取指定key本地存储的值
    is_class = localStorage.getItem("item_type");
    //console.log(id);
    show_product(id,is_class);
}


function show_product(item_id,is_class){
    id = item_id;
    var type;
    if(my_switch == true){
        if(is_class ==0){ //如果不是class的数据
            $.ajax({
                url: 'http://localhost:5500/search_id',
                type: 'get',
                dataType: 'json',
                data: {//传进去的值
                    object_id:id
                }, // Pass the parameter here
                success: function (data) {//返回结果在data里 数据返回成功之后要干什么
                    $.each(data, function (index, item) {
                                    console.log(item.objectid)
                                    $("#item_name").text(item.名字);
                                    $("#DianZan").text(item.点赞数);
                                    $("#XiaoLiang").text(item.销量);
                                    var srcpath="../MiaoXiu_Image/"+item.图片;
                                    $("#item_picture").attr("src", srcpath);
                                    $("#item_picture").attr("class","col_up_img");
                                    $("#description").text(item.描述);
                                    
                                    type=item.类别;
                                    var map = new BMapGL.Map("map");                // 创建地图实例
                                    var point = new BMapGL.Point(item.经度, item.纬度);     // 设置中心点坐标
                                    lng = item.经度;
                                    lat = item.纬度;
                                    worksname = item.名字;
                                    var marker = new BMapGL.Marker(point);        // 创建标注   
                                    map.addOverlay(marker);   
                                    map.centerAndZoom(point, 14);                      // 设置地图级别
                                    map.enableScrollWheelZoom(); 
                                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                                    console.log('地图完成');
                                    //找相同商品
                                    Find_the_same(type);    
                                });      
                }
            });
        }else{
            $.ajax({
                url: 'http://localhost:5500/get_class',
                type: 'get',
                dataType: 'json',
                data: {//传进去的值
                    class_id:id
                }, // Pass the parameter here
                success: function (data) {//返回结果在data里 数据返回成功之后要干什么
                    $.each(data, function (index, item) {
                                    console.log(item.objectid)
                                    $("#item_name").text(item.课程名);
                                    $("#DianZan").text(item.点赞数);
                                    $("#XiaoLiang").text(item.销量);
                                    var srcpath="../MiaoXiu_Image/"+item.课程id+".jpg";
                                    $("#item_picture").attr("src", srcpath);
                                    $("#item_picture").attr("class","col_up_img");
                                    $("#description").text(item.介绍);
                                    $("#map_text").text('查看上课地点');
                                    var map = new BMapGL.Map("map");                // 创建地图实例
                                    var point = new BMapGL.Point(item.经度, item.纬度);     // 设置中心点坐标
                                    lng = item.经度;
                                    lat = item.纬度;
                                    worksname = item.名字;
                                    var marker = new BMapGL.Marker(point);        // 创建标注   
                                    map.addOverlay(marker);   
                                    map.centerAndZoom(point, 10);                      // 设置地图级别
                                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                                    console.log('地图完成');
                                    //找相同商品
                                    Find_the_same(0);    
                                });      
                }
            });

        }
    }else{
        if(is_class ==0){
            fetch('../json/绣品.json')
            .then(response => response.json()) // 解析JSON数据
            .then(data => {
            // 在data中查找id为8的记录
                var num_item_id = parseInt(item_id);//转换id的数据类型
                const item = data.find(item => item.OBJECTID === num_item_id);
                console.log(item);
                $("#item_name").text(item.名字);
                type=item.类别;                
                var srcpath="../MiaoXiu_Image/"+item.图片;
                $("#item_picture").attr("src", srcpath);
                $("#item_picture").attr("class","col_up_img");
                $("#description").text(item.描述);
                $("#map_text").text('查看绣品产地');
                var map = new BMapGL.Map("map");                // 创建地图实例
                var point = new BMapGL.Point(item.经度, item.纬度);     // 设置中心点坐标
                lng = item.经度;
                lat = item.纬度;
                worksname = item.名字;
                var marker = new BMapGL.Marker(point);        // 创建标注   
                map.addOverlay(marker);   
                map.centerAndZoom(point, 10);                      // 设置地图级别
                map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                console.log('地图完成');
                Find_the_same(type); 

            // 如果找到记录，则输出到控制台
                
            })
            .catch(error => console.error('加载JSON文件时出错：', error));
        }else{
            // 使用fetch加载JSON文件
            fetch('../json/课程.json')
            .then(response => response.json()) // 解析JSON数据
            .then(data => {
            // 在data中查找id为8的记录
                var num_item_id = parseInt(item_id);
                const item = data.find(item => item.课程ID === num_item_id);
                
                
                $("#item_name").text(item.课程名);
                                    
                                    var srcpath="../MiaoXiu_Image/"+item.课程ID+".jpg";
                                    $("#item_picture").attr("src", srcpath);
                                    $("#item_picture").attr("class","col_up_img");
                                    $("#description").text(item.介绍);
                                    $("#map_text").text('查看上课地点');
                                    var map = new BMapGL.Map("map");                // 创建地图实例
                                    var point = new BMapGL.Point(item.经度, item.纬度);     // 设置中心点坐标
                                    lng = item.经度;
                                    lat = item.纬度;
                                    worksname = item.名字;
                                    var marker = new BMapGL.Marker(point);        // 创建标注   
                                    map.addOverlay(marker);   
                                    map.centerAndZoom(point, 10);                      // 设置地图级别
                                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                                    console.log('地图完成');
                                    Find_the_same(0); 

            // 如果找到记录，则输出到控制台
                
            })
            .catch(error => console.error('加载JSON文件时出错：', error));
        }
    }
}
function Find_the_same(type){
    tbodydata='';
    if(my_switch==true){
        if(type !=0){
            console.log('找相同');
            
            $.ajax({
                url: 'http://localhost:5500/find_the_same',
                type: 'get',
                dataType: 'json',
                data: {//传进去的值
                    type: type,
                }, // Pass the parameter here
                success: function (data) {//返回结果在data里 数据返回成功之后要干什么
                    console.log('找到相同');
                    tbodydata=DivData(data,type);//给tbodydata赋值
                    $("#same_items").html(tbodydata);  //给相同的商品赋值
                    // tbodydata = "<div class='box_contain'>";
                    // $.each(data, function (index, item) {
                    //     if(type==1){
                    //                 tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.objectid+",0)'>"+
                    //                 "<div class = 'name_img'><p>"+item.非遗种+"</p>"+
                    //                 "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                    //                 "<hr/><p>"+item.名字+"</p>"+"</div>";
                    //                 if(index == 2){
                    //                     tbodydata+="</div>";
                    //                 }
                    //     }
                    // if(type == 2){
                        
                    //                 tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.objectid+",0)'>"+
                    //                 "<div class = 'name_img'><p>"+item.品牌+"</p>"+
                    //                 "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                    //                 "<hr/><p>"+item.名字+"</p>"+"</div>";
                    //                 if(index == 2){
                    //                     tbodydata+="</div>";
                    //                 }      
                    // }
                    // if(type == 3){
                        
                    //                 tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.objectid+",0)'>"+
                    //                 "<div class = 'name_img'><p>"+item.寓意+"</p>"+
                    //                 "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                    //                 "<hr/><p>"+item.名字+"</p>"+"</div>";
                    //                 if(index == 2){
                    //                     tbodydata+="</div>";
                    //                 }
                    // }        
                    // });  
                    // $("#same_items").html(tbodydata);    
                }
            });
        }else{
            console.log('找课程相同');
            $.ajax({
                url: 'http://localhost:5500/get_same_classes',
                type: 'get',
                dataType: 'json',
                data: {//传进去的值
                    
                }, // Pass the parameter here
                success: function (data) {//返回结果在data里 数据返回成功之后要干什么
                    tbodydata = "<div class='box_contain'>";
                    $.each(data, function (index, item) {
                        tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.课程id+".jpg' alt='"+item.课程id+".jpg' onclick='show_product("+item.课程id+",1)'>"+
                        "<div class = 'name_img'><p>"+item.课程名+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.课程id+"' onclick='add_product("+item.课程id+")'></div></div>";
                        if(index == 2){
                            tbodydata+="</div>";
                        }           
                    });  
                    $("#same_items").html(tbodydata);     
                }
            });
        } 
    }else{
        if(type !=0){
            fetch('../json/绣品.json')
            .then(response => response.json())
            .then(jsonData => {
                // 筛选出 type 为 1 的记录
                const type1Records = jsonData.filter(item => item.类别 === type);
                // 随机选取 3 条记录
                const randomType1Records = getRandomRecords(type1Records, 3);

                $.each(randomType1Records, function (index, item) {
                    console.log(item.价格);
                });

                tbodydata=DivData(randomType1Records,type);//给tbodydata赋值
                $("#same_items").html(tbodydata);  //给相同的商品赋值
                //console.log(randomType1Records);
            })
            .catch(error => console.error('Error fetching data:', error));
        }
        if(type==0){//如果是课程
            fetch('../json/课程.json')
            .then(response => response.json()) // 2. 解析 JSON 数据
            .then(data => {
                // 3. 随机选择三条记录
                const items = getRandomRecords(data, 3);
                tbodydata = "<div class='box_contain'>";
                    for(var i=0;i<3;i++){
                        tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+items[i]["课程ID"]+".jpg' alt='"+items[i]["课程ID"]+".jpg' onclick='show_product("+items[i]["课程ID"]+",1)'>"+
                        "<div class = 'name_img'><p>"+items[i]["课程名"]+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+items[i]["课程ID"]+"' onclick='add_product("+items[i]["课程ID"]+")'></div></div>";
                        if(i == 2){
                            tbodydata+="</div>";
                        }           
                    }  
                    $("#same_items").html(tbodydata);  
            })
            .catch(error => console.error('Error fetching JSON:', error));
        }
    }
}


function DivData(data,type){

    var tbodydata = "<div class='box_contain'>";
    if(my_switch==true){
                    $.each(data, function (index, item) {
                        if(type==1){
                                    tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.objectid+",0)'>"+
                                    "<div class = 'name_img'><p>"+item.非遗种+"</p>"+
                                    "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                                    "<hr/><p>"+item.名字+"</p>"+"</div>";
                                    if(index == 2){
                                        tbodydata+="</div>";
                                    }
                        }
                    if(type == 2){
                        
                                    tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.objectid+",0)'>"+
                                    "<div class = 'name_img'><p>"+item.品牌+"</p>"+
                                    "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                                    "<hr/><p>"+item.名字+"</p>"+"</div>";
                                    if(index == 2){
                                        tbodydata+="</div>";
                                    }      
                    }
                    if(type == 3){
                        
                                    tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.objectid+",0)'>"+
                                    "<div class = 'name_img'><p>"+item.寓意+"</p>"+
                                    "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                                    "<hr/><p>"+item.名字+"</p>"+"</div>";
                                    if(index == 2){
                                        tbodydata+="</div>";
                                    }
                    }        
                    });  
           
    }else{
        $.each(data, function (index, item) {
            if(type==1){
                            tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.OBJECTID+",0)'>"+
                            "<div class = 'name_img'><p>"+item.非遗种+"</p>"+
                            "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.OBJECTID+"' onclick='add_product("+item.OBJECTID+")'></div>"+
                            "<hr/><p>"+item.名字+"</p>"+"</div>";
                            if(index == 2){
                                tbodydata+="</div>";
                            }
                }
            if(type == 2){
                
                            tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.OBJECTID+",0)'>"+
                            "<div class = 'name_img'><p>"+item.品牌+"</p>"+
                            "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.OBJECTID+"' onclick='add_product("+item.OBJECTID+")'></div>"+
                            "<hr/><p>"+item.名字+"</p>"+"</div>";
                            if(index == 2){
                                tbodydata+="</div>";
                            }      
            }
            if(type == 3){
                
                            tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.OBJECTID+",0)'>"+
                            "<div class = 'name_img'><p>"+item.寓意+"</p>"+
                            "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.OBJECTID+"' onclick='add_product("+item.OBJECTID+")'></div>"+
                            "<hr/><p>"+item.名字+"</p>"+"</div>";
                            if(index == 2){
                                tbodydata+="</div>";
                            }
            }        
        });  
    } 
    return tbodydata;  
}


function getRandomRecords(data, count) {
    const shuffled = data.sort(() => 0.5 - Math.random()); // 随机排序
    return shuffled.slice(0, count); // 截取前 count 条记录
}

//和购物车有关功能
var cartItems = [];
var cartCount = 0;
var is_add = false;

function add_product(id){
    console.log(id);  
}

//传递经纬度给周边推荐并跳转页面
function To_Map(){
    localStorage.setItem('lng', lng);
    localStorage.setItem('lat', lat);
    localStorage.setItem('worksname', worksname);
    localStorage.setItem('executeLinkworks', 'true');
    window.location.href = '周边推荐2.html';
}