var my_switch = false;
var id;
var is_class;
var lng_product;
var lat_product;
var lng_person;
var lat_person;
var executeLinkworks;
var worksname;
var personsname;


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
                                    
                        show_type(item,is_class);
                        show_person(item.发布者I);
                        $("#item_name").text(item.名字);
                        type=item.类别;              
                        var srcpath="../MiaoXiu_Image/"+item.objectid+".jpg";
                        $("#DianZan").text(item.点赞数);
                        $("#XiaoLiang").text(item.销量);
                        $("#price").text(item.价格);
                        $("#item_picture").attr("src", srcpath);
                        $("#item_picture").attr("class","col_up_img");
                        $("#product_introduction").text(item.描述);
                        $("#map_text").text('查看绣品产地');
                        var map = new BMapGL.Map("map");                // 创建地图实例
                        var point = new BMapGL.Point(item.经度, item.纬度);     // 设置中心点坐标
                        lng_product = item.经度;
                        lat_product = item.纬度;
                        worksname = item.名字;
                        var marker = new BMapGL.Marker(point);        // 创建标注   
                        map.addOverlay(marker);   
                        map.centerAndZoom(point, 10);                      // 设置地图级别
                        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                        console.log('地图完成');
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
                                    var date_body ='<img src="../imgs/日期.png" alt="点赞数"></img><p>上课时间：'+item.时间+'</p>';
                show_person(item.授课老师id);
                $("#date").html(date_body); 
                show_type(item,is_class);
                $("#product_introduction_title").text("课程详情");
                $("#price").text(item.价格);
                $("#check_location").text('查看上课地点');
                $("#person_introduction_title").text('授课老师简介')
                $("#person_location").text('查看授课老师所在地');
                $("#item_name").text(item.课程名);
                                    var srcpath="../MiaoXiu_Image/"+item.课程id+".jpg";
                                    $("#item_picture").attr("src", srcpath);
                                    $("#item_picture").attr("class","col_up_img");
                                    $("#product_introduction").text(item.介绍);
                                    $("#map_text").text('查看上课地点');
                                    var map = new BMapGL.Map("map");                // 创建地图实例
                                    var point = new BMapGL.Point(item.经度, item.纬度);     // 设置中心点坐标
                                    lng_product = item.经度;
                                    lat_product = item.纬度;
                                    worksname = item.课程名;
                                    var marker = new BMapGL.Marker(point);        // 创建标注   
                                    map.addOverlay(marker);   
                                    map.centerAndZoom(point, 10);                      // 设置地图级别
                                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                                    console.log('地图完成');
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
                show_type(item,is_class);
                show_person(item.发布者I);
                $("#item_name").text(item.名字);
                type=item.类别;              
                var srcpath="../MiaoXiu_Image/"+item.OBJECTID+".jpg";
                $("#DianZan").text(item.点赞数);
                $("#XiaoLiang").text(item.销量);
                $("#price").text(item.价格);
                $("#item_picture").attr("src", srcpath);
                $("#item_picture").attr("class","col_up_img");
                $("#product_introduction").text(item.描述);
                $("#map_text").text('查看绣品产地');
                var map = new BMapGL.Map("map");                // 创建地图实例
                var point = new BMapGL.Point(item.经度, item.纬度);     // 设置中心点坐标
                lng_product = item.经度;
                lat_product = item.纬度;
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
                var date_body ='<img src="../imgs/日期.png" alt="点赞数"></img><p>上课时间：'+item.时间+'</p>';
                show_person(item.授课老师ID);
                $("#date").html(date_body); 
                show_type(item,is_class);
                $("#product_introduction_title").text("课程详情");
                $("#price").text(item.价格);
                $("#check_location").text('查看上课地点');
                $("#person_introduction_title").text('授课老师简介')
                $("#person_location").text('查看授课老师所在地');
                $("#item_name").text(item.课程名);
                                    var srcpath="../MiaoXiu_Image/"+item.课程ID+".jpg";
                                    $("#item_picture").attr("src", srcpath);
                                    $("#item_picture").attr("class","col_up_img");
                                    $("#product_introduction").text(item.介绍);
                                    $("#map_text").text('查看上课地点');
                                    var map = new BMapGL.Map("map");                // 创建地图实例
                                    var point = new BMapGL.Point(item.经度, item.纬度);     // 设置中心点坐标
                                    lng_product = item.经度;
                                    lat_product = item.纬度;
                                    worksname = item.课程名;
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
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.课程id+"' onclick='add_product("+item.课程id+",1)'></div></div>";
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
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+items[i]["课程ID"]+"' onclick='add_product("+items[i]["课程ID"]+",1)'></div></div>";
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
                                    tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.objectid+".jpg' alt='"+item.objectid+"' onclick='show_product("+item.objectid+",0)'>"+
                                    "<div class = 'name_img'><p>"+item.非遗种+"</p>"+
                                    "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+",0)'></div>"+
                                    "<hr/><p>"+item.名字+"</p>"+"</div>";
                                    if(index == 2){
                                        tbodydata+="</div>";
                                    }
                        }
                    if(type == 2){
                        
                                    tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.objectid+".jpg' alt='"+item.objectid+"' onclick='show_product("+item.objectid+",0)'>"+
                                    "<div class = 'name_img'><p>"+item.品牌+"</p>"+
                                    "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                                    "<hr/><p>"+item.名字+"</p>"+"</div>";
                                    if(index == 2){
                                        tbodydata+="</div>";
                                    }      
                    }
                    if(type == 3){
                        
                                    tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.objectid+".jpg' alt='"+item.objectid+"' onclick='show_product("+item.objectid+",0)'>"+
                                    "<div class = 'name_img'><p>"+item.寓意+"</p>"+
                                    "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+",0)'></div>"+
                                    "<hr/><p>"+item.名字+"</p>"+"</div>";
                                    if(index == 2){
                                        tbodydata+="</div>";
                                    }
                    }        
                    });  
           
    }else{
        $.each(data, function (index, item) {
            if(type==1){
                            tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.OBJECTID+".jpg' alt='"+item.OBJECTID+"' onclick='show_product("+item.OBJECTID+",0)'>"+
                            "<div class = 'name_img'><p>"+item.非遗种+"</p>"+
                            "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.OBJECTID+"' onclick='add_product("+item.OBJECTID+",0)'></div>"+
                            "<hr/><p>"+item.名字+"</p>"+"</div>";
                            if(index == 2){
                                tbodydata+="</div>";
                            }
                }
            if(type == 2){
                
                            tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.OBJECTID+".jpg' alt='"+item.OBJECTID+"' onclick='show_product("+item.OBJECTID+",0)'>"+
                            "<div class = 'name_img'><p>"+item.品牌+"</p>"+
                            "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.OBJECTID+"' onclick='add_product("+item.OBJECTID+",0)'></div>"+
                            "<hr/><p>"+item.名字+"</p>"+"</div>";
                            if(index == 2){
                                tbodydata+="</div>";
                            }      
            }
            if(type == 3){
                
                            tbodydata +="<div class='pic_box'>"+"<img class='box_img' src='../MiaoXiu_Image/"+item.OBJECTID+".jpg' alt='"+item.OBJECTID+"' onclick='show_product("+item.OBJECTID+",0)'>"+
                            "<div class = 'name_img'><p>"+item.寓意+"</p>"+
                            "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.OBJECTID+"' onclick='add_product("+item.OBJECTID+",0)'></div>"+
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

function show_type(item,is_class){
    var type_item;
    fetch('../json/介绍.json')
            .then(response => response.json()) // 解析JSON数据
            .then(data => {
                if(is_class ==0){
                    if(item.类别==1){
                        type_item = data.find(type_item => type_item.种类 === item.非遗种);
                        console.log(type_item.介绍);
                    }
                    if(item.类别==2){
                        type_item = data.find(type_item => type_item.种类 === item.品牌);
                    }
                    if(item.类别==3){
                        type_item = data.find(type_item => type_item.种类 === item.寓意);
                    }
                
                }else{
                    type_item = data.find(type_item => type_item.种类 === "体验苗绣");
                }
                $("#type").text(type_item.种类);
                $("#type_introduction").text(type_item.介绍); 
            })
            .catch(error => console.error('加载JSON文件时出错：', error));
}

function show_person(person_id){
    fetch('../json/绣娘.json')
            .then(response => response.json()) // 解析JSON数据
            .then(data => {
                var num_person_id = parseInt(person_id);
                var item = data.find(item => item.ID === num_person_id);
                $("#person_introduction").text(item.介绍);
                lng_person = item.经度;
                lat_person = item.纬度;
            })
            .catch(error => console.error('加载JSON文件时出错：', error));
             
}
//和购物车有关功能
var cartItems = [];
var cartCount = 0;
var is_add = false;

function add_the_product(){
    var num_item_id = parseInt(id);
    var the_is_class = parseInt(is_class);
    add_product(num_item_id, the_is_class);
}

function add_product(the_id, the_is_class){
        
    var item = {
        id: the_id,
        class: the_is_class
      };
      cartItems.push(item);

    // 将对象存储为 JSON 字符串
    localStorage.setItem('productData', JSON.stringify(cartItems));
}

//传递经纬度给周边推荐并跳转页面
function To_Map(is_product){
    if(is_product==1){
    localStorage.setItem('lng', lng_product);
    localStorage.setItem('lat', lat_product);
    }else{
    localStorage.setItem('lng', lng_person);
    localStorage.setItem('lat', lat_person);
    console.log(lng_person);
    console.log(lat_person);
    console.log("person");
    }
    localStorage.setItem('worksname', worksname);
    localStorage.setItem('executeLinkworks', 'true');
    window.location.href = 'periphery.html';
}