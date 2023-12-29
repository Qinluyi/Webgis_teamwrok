
var start1 = 0;//从第 start1+1 个商品开始
var start2 = 0;
var start3 = 0;
var start4 = 0;
var num1 = 8;
var num2 = 8;
var num3 = 8;
var num4 = 8;
var name1=1;
var name2=2;
var name3=3;
var name4 = 4;
var my_switch = false;//默认是连不上数据库的
//my_switch = localStorage.getItem("switch"); 



var element = '';


// document.addEventListener('DOMContentLoaded', function () {
//     // 获取滚动按钮和内容容器
//       var scrollBtn = document.getElementById('scrollBtn');
//       var content = document.getElementById('content');
      
//       // 点击图片时触发滑动事件
//       scrollBtn.addEventListener('click', function () {
//           scrollToContent(content);
//       });
//   });

    // 滑动到指定容器的函数
    function scrollToContent(element) {
        window.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth' ,// 平滑滚动
            duration: 3000
        });
    }
 
    function myscroll(element) {
        var content = document.getElementById(element);
        scrollToContent(content);
    }
    
    window.onload = function() {
        // 页面加载完毕后执行的代码 
             
            console.log(my_switch);
            element='#type1';
            LoadItems(name1,start1,num1,element);
            element='#type2';
            LoadItems(name2,start2,num2,element);
            element='#type3';
            LoadItems(name3,start3,num3,element);
            LoadClasses();
    };

    function LoadClasses(){
        if(my_switch==true){
            $.ajax({
                url: 'http://localhost:5500/classes',
                type: 'get',
                dataType: 'json',
                data: {//传进去的
                    start:start4,//课程的起始
                    num:8
                }, // Pass the parameter here
                success: function (data) {//返回结果在data里 数据返回成功之后要干什么
                tbodydata ='';
                tbodydata=DivData(data,4);
                $("#type4").html(tbodydata); 
                }
            }); 
        }else{
            tbodydata ='';
            $.get('../json/课程.json',{},function(data){
                creatTable(data);
                console.log(data[0]["课程名"]);
                function creatTable(data){
                 //这个函数的参数data是字符串数组，可以是从后台传过来的也可以是从其他任何地方传过来的
                tbodydata = "<div class='box_contain'>";
                for (var i=0;i<8;i++) {	
                    tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+data[i]["课程ID"]+".jpg' alt='"+data[i]["课程ID"]+".jpg' onclick='show_product("+data[i]["课程ID"]+",1)'>"+
                      "<div class = 'name_img'><p>"+data[i]["课程名"]+"</p>"+
                       	"<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+data[i]["objectid"]+"' onclick='add_product("+data[i]["课程ID"]+")'></div></div>";
                      if(i == 3){
                        tbodydata+="</div>";
                        tbodydata+="<div class='box_contain'>";
                    }
                    if(i == 7){
                        tbodydata+="</div>";
                    }
                }
                  //现在tableData已经生成好了，把他赋值给上面的tbody
                  $("#type4").html(tbodydata);
                }		
            });
        }
    }

    function LoadItems(name,start,num,element){
        if(my_switch){
            $.ajax({
                url: 'http://localhost:5500/search_items',
                type: 'get',
                dataType: 'json',
                data: {//传进去的值
                    name:name,
                    num:num,
                    start:start
                }, // Pass the parameter here
                success: function (data) {//返回结果在data里 数据返回成功之后要干什么
                tbodydata ='';
                tbodydata=DivData(data,name);
                
                $(element).html(tbodydata); 
                
                }
            }); 
        }else{

            fetch('../json/绣品.json')
            .then(response => response.json())
            .then(jsonData => {
                // 使用 filter 方法筛选出 type 为 1 的前 8 条记录
                var type1Records = jsonData.filter(function(item) {
                return item.类别 === name; //返回类别和name值相同的第0-7条记录
                }).slice(0, 8);
                console.log(type1Records);
                tbodydata ='';
                tbodydata=DivData(type1Records,name);
                $(element).html(tbodydata);
            })
            .catch(error => console.error('Error fetching data:', error));
           
        }
    }
   
    var bodydata='';
    function NextItems(type,is_next) {
        // 获取图片元素
        console.log(222);
        if(is_next =='next'){
            
            if(type==1){
                start1+=num1;
                getdata(name1,num1,start1,type); //bodydata的值会变
                $("#type1").fadeTo(1000,0,function(){
                    $("#type1").html(bodydata).fadeTo(1000,1);
                });
            }
            if(type==2){
                start2+=num2;
                getdata(name2,num2,start2,type); //bodydata的值会变
                $("#type2").fadeTo(1000,0,function(){
                    $("#type2").html(bodydata).fadeTo(1000,1);
                });
            }
            if(type==3){
                start3+=num3;
                getdata(name3,num3,start3,type); //bodydata的值会变
                $("#type3").fadeTo(1000,0,function(){
                    $("#type3").html(bodydata).fadeTo(1000,1);
                });
            }
            if(type==4){
                start4+=num4;
                getclasses_data(); //bodydata的值会变
                $("#type4").fadeTo(1000,0,function(){
                    $("#type4").html(bodydata).fadeTo(1000,1);
                });
            }

        }else if(is_next!='next'){
            if(type==1){
                if((start1-num1)<0){
                    console.log("当前是第一页");
                }else{
                    start1=start1-num1;
                    getdata(name1,num1,start1,type);
                    $("#type1").fadeTo(1000,0,function(){
                        $("#type1").html(bodydata).fadeTo(1000,1);
                    });
                }
            }
            if(type==2){
                if((start2-num2)<0){
                    console.log("当前是第一页");
                }else{
                    start2=start2-num2;
                    getdata(name2,num2,start2,type);
                    $("#type2").fadeTo(1000,0,function(){
                        $("#type2").html(bodydata).fadeTo(1000,1);
                    });
                }
            }
            if(type==3){
                if((start3-num3)<0){
                    console.log("当前是第一页");
                }else{
                    start3=start3-num3;
                    getdata(name3,num3,start3,type);
                    $("#type3").fadeTo(1000,0,function(){
                        $("#type3").html(bodydata).fadeTo(1000,1);
                    });
                }
            }
            if(type==4){
                if((start4-num4)<0){
                    console.log("当前是第一页");
                }else{
                    start4=start4-num4;
                    getclasses_data(); //bodydata的值会变
                    $("#type4").fadeTo(1000,0,function(){
                        $("#type4").html(bodydata).fadeTo(1000,1);
                    });
                }

            }
    }
}

    function getdata(name,num,start,type){
        if(my_switch){
            $.ajax({
                            url: 'http://localhost:5500/search_items',
                            type: 'get',
                            dataType: 'json',
                            data: {//传进去的值
                                name: name,
                                num:num,
                                start:start
                            }, // Pass the parameter here
                            success: function (data) {//返回结果在data里 数据返回成功之后要干什么
                            bodydata=DivData(data,type);
                            }
                    }); 
        }else{
            fetch('../json/绣品.json')
            .then(response => response.json())
            .then(jsonData => {
                // 使用 filter 方法筛选出 type 为 1 的前 8 条记录
                var type1Records = jsonData.filter(function(item) {
                return item.类别 === name; //返回类别和name值相同的第0-7条记录
                }).slice(start, start+8);
                
                bodydata=DivData(type1Records,type);
            })
            .catch(error => console.error('Error fetching data:', error));

        }
    }
    function getclasses_data(){
        if(my_switch==true){
            $.ajax({
                url: 'http://localhost:5500/classes',
                type: 'get',
                dataType: 'json',
                data: {//传进去的值
                    start:start4,
                    num:8
                }, // Pass the parameter here
                success: function (data) {//返回结果在data里 数据返回成功之后要干什么
                bodydata=DivData(data,4);
                }
            });
        }else{

            fetch('../json/课程.json')
            .then(response => response.json())
            .then(jsonData => {
                // 选择前 8 条记录
                const data = jsonData.slice(start4, start4+8);
                bodydata=DivData(data,4);
            })
            .catch(error => console.error('Error fetching data:', error));
            // $.get('../json/课程.json',{},function(data){
            //     creatTable(data);
            //     console.log(data[0]["课程名"]);
            //     function creatTable(data){
                    
            //      //这个函数的参数data是字符串数组，可以是从后台传过来的也可以是从其他任何地方传过来的
            //         bodydata = "<div class='box_contain'>";
            //         for (var i=start4;i<start4+8;i++) {	
            //             bodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+data[i]["课程ID"]+".jpg' alt='"+data[i]["课程ID"]+".jpg' onclick='show_product("+data[i]["课程ID"]+",1)'>"+
            //             "<div class = 'name_img'><p>"+data[i]["课程名"]+"</p>"+
            //              	"<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+data[i]["课程ID"]+"' onclick='add_product("+data[i]["课程ID"]+")'></div></div>";
            //             if(i == start4+3){
            //                 bodydata+="</div>";
            //                 bodydata+="<div class='box_contain'>";
            //             }
            //             if(i == start4+7){
            //                 bodydata+="</div>";
            //             }
            //         }
            //     }		
            // });
        }
    }

    function DivData(data,type){
        console.log(333);
        var tbodydata = '';
        if(my_switch==true){
            if(type==1){
                tbodydata = "<div class='box_contain'>";
                    $.each(data, function (index, item) {
                        tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.objectid+",0)'>"+
                        "<div class = 'name_img'><p>"+item.非遗种+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                        "<hr/><p>"+item.名字+"</p>"+"</div>";
                        if(index == 3){
                            tbodydata+="</div>";
                            tbodydata+="<div class='box_contain'>";
                        }
                        if(index == 7){
                            tbodydata+="</div>";
                        }
                    });
            }
            if(type == 2){
                tbodydata = "<div class='box_contain'>";
                    $.each(data, function (index, item) {
                        tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.objectid+",0)'>"+
                        "<div class = 'name_img'><p>"+item.品牌+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                        "<hr/><p>"+item.名字+"</p>"+"</div>";
                        if(index == 3){
                            tbodydata+="</div>";
                            tbodydata+="<div class='box_contain'>";
                        }
                        if(index == 7){
                            tbodydata+="</div>";
                        }
                    });
            }
            if(type == 3){
                tbodydata = "<div class='box_contain'>";
                    $.each(data, function (index, item) {
                        tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.objectid+",0)'>"+
                        "<div class = 'name_img'><p>"+item.寓意+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.objectid+")'></div>"+
                        "<hr/><p>"+item.名字+"</p>"+"</div>";
                        if(index == 3){
                            tbodydata+="</div>";
                            tbodydata+="<div class='box_contain'>";
                        }
                        if(index == 7){
                            tbodydata+="</div>";
                        }
                    });
            }
            if(type == 4){
                tbodydata = "<div class='box_contain'>";
                    $.each(data, function (index, item) {
                        tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.课程id+".jpg' alt='"+item.课程id+".jpg' onclick='show_product("+item.课程id+",1)'>"+
                        "<div class = 'name_img'><p>"+item.课程名+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.课程id+")'></div></div>";
                        if(index == 3){
                            tbodydata+="</div>";
                            tbodydata+="<div class='box_contain'>";
                        }
                        if(index == 7){
                            tbodydata+="</div>";
                        }
                    });
            }
        }else{
            if(type==1){
                tbodydata = "<div class='box_contain'>";
                    $.each(data, function (index, item) {
                        tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.OBJECTID+",0)'>"+
                        "<div class = 'name_img'><p>"+item.非遗种+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.OBJECTID+"' onclick='add_product("+item.OBJECTID+")'></div>"+
                        "<hr/><p>"+item.名字+"</p>"+"</div>";
                        if(index == 3){
                            tbodydata+="</div>";
                            tbodydata+="<div class='box_contain'>";
                        }
                        if(index == 7){
                            tbodydata+="</div>";
                        }
                    });
            }
            if(type == 2){
                tbodydata = "<div class='box_contain'>";
                    $.each(data, function (index, item) {
                        tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.OBJECTID+",0)'>"+
                        "<div class = 'name_img'><p>"+item.品牌+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.OBJECTID+"' onclick='add_product("+item.OBJECTID+")'></div>"+
                        "<hr/><p>"+item.名字+"</p>"+"</div>";
                        if(index == 3){
                            tbodydata+="</div>";
                            tbodydata+="<div class='box_contain'>";
                        }
                        if(index == 7){
                            tbodydata+="</div>";
                        }
                    });
            }
            if(type == 3){
                tbodydata = "<div class='box_contain'>";
                    $.each(data, function (index, item) {
                        tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.图片+"' alt='"+item.图片+"' onclick='show_product("+item.OBJECTID+",0)'>"+
                        "<div class = 'name_img'><p>"+item.寓意+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.OBJECTID+"' onclick='add_product("+item.OBJECTID+")'></div>"+
                        "<hr/><p>"+item.名字+"</p>"+"</div>";
                        if(index == 3){
                            tbodydata+="</div>";
                            tbodydata+="<div class='box_contain'>";
                        }
                        if(index == 7){
                            tbodydata+="</div>";
                        }
                    });
            }
            if(type == 4){
                tbodydata = "<div class='box_contain'>";
                    $.each(data, function (index, item) {
                        tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.课程ID+".jpg' alt='"+item.课程ID+".jpg' onclick='show_product("+item.课程ID+",1)'>"+
                        "<div class = 'name_img'><p>"+item.课程名+"</p>"+
                        "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.课程ID+")'></div></div>";
                        if(index == 3){
                            tbodydata+="</div>";
                            tbodydata+="<div class='box_contain'>";
                        }
                        if(index == 7){
                            tbodydata+="</div>";
                        }
                    });
            }


        }

        return tbodydata;
    }



    function show_product(id,is_class){
        localStorage.setItem('item_id', id);
        localStorage.setItem('item_type', is_class);
		window.location.href = 'product.html';
    }
//和购物车有关功能
    var cartItems = [];
    var cartCount = 0;
    var is_add = false;
    
    function add_product(id){
        console.log(id);  
    }
