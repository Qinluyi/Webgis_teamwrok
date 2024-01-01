
//var cartItems = JSON.parse(localStorage.getItem('cartItems'));
    //var cartItemsTable = document.getElementById('cart-items');
    //var totalAmountDisplay = document.getElementById('total-amount');
    //var checkoutBtn = document.getElementById('checkout-btn');

    var cartItems = JSON.parse(localStorage.getItem('productData'));
    //var item_type = JSON.parse(localStorage.getItem('item_type'));

    

var filePath1 = '../json/绣品.json';
var filePath2 = '../json/课程.json';

// 使用 Promise.all 来等待两个异步操作完成
Promise.all([
    $.getJSON(filePath1),
    $.getJSON(filePath2)
]).then(function (results) {
    // 获取两个 JSON 文件的数据
    var json_x = results[0];
    var json_k = results[1];
    console.log('json_x:', json_x);
    
    if (cartItems && cartItems.length > 0) {
        function createProductItem(id,name, price,miaoshu) {
            // 创建商品元素
            var productItem = document.createElement('div');
            productItem.classList.add('info', 'warp');
    
            var ulElement = document.createElement('ul');
    
            // 创建 li 元素
          var liContent = [
    '<li class="info_1"><input type="checkbox" name="fav" onclick="checkTest2()"/> </li>',
    '<li class="info_2"> <img src="../MiaoXiu_Image/' + id + '.jpg" width="100px" height = "80px"/> </li>',
    '<li class="info_3"><a>' + name + '</a></li>',
    '<li class="info_4"><a>'+ miaoshu +'</a> </li>',
    '<li class="info_5">￥' + price + '</li>',
    '<li class="info_6"><button onclick="checkTest3(this,1),checkTest2()" >-</button><input type="text" name="" id="" value="1" /><button class="bot" onclick="checkTest3(this,2),checkTest2()" >+</button></li>',
    '<li class="info_7">￥' + price + '</li>',
    '<li>',
    '   <a href="javascript:void(0)" onclick="checkTest4(this),checkTest2()">删除</a><br />',
    '   <a>已到我的关注</a>',
    '</li>'
];

var liElement = document.createElement('li');
liElement.innerHTML = liContent.join('');
ulElement.appendChild(liElement);

    
            // 将 ul 元素添加到商品元素
            productItem.appendChild(ulElement);
    
            return productItem;
        }
    
    
        for (var i = 0; i < cartItems.length; i++) {
            var item = cartItems[i];
            var id = item.id;
            console.log('id:', id);
            var type = item.class;
            var productElement;

            if (type == 0){
                var match = json_x.find(function(item) {
                    return item.OBJECTID === id;
                    
                });
                console.log('Match:', match);
                
                var name2 = match['名字'];
                var band = match['品牌'];
                var yuyi = match['寓意'];
                var combinedString = band + ' ' + yuyi;

                var price = match['价格']
                productElement = createProductItem(id,name2,price,combinedString);

            }
            else if(type ==1 ){
                var match = json_k.find(function(item) {
                    return item.课程ID === id;
                });

                var name2 = match['课程名'];
                var band = match['时间'];
                var price = match['价格']
                productElement = createProductItem(id,name2,price, band);

            }


            
    
            // 将商品元素添加到页面中的某个容器
            var container = document.getElementById('commodity');
            console.log(productElement);

            container.appendChild(productElement);
        

        
	}

}

// 从数组中随机选择八个数据项
var randomData = [];
while (randomData.length < 8) {
  var randomIndex = Math.floor(Math.random() * json_x.length);
  var randomItem = json_x[randomIndex];
  if (!randomData.includes(randomItem)) {
    randomData.push(randomItem);
  }
}

// 获取产品容器元素
var productContainer = document.getElementById('product');

// 遍历随机选择的数据项，并创建产品元素
randomData.forEach(function (item, index) {
  // 创建产品元素
  var productElement = document.createElement('div');
  productElement.className = 'pic_box';
  productElement.innerHTML = "<img src='../MiaoXiu_Image/" + item.OBJECTID+".jpg" + "' alt='" + item.图片 + "' onclick='show_product(" + item.OBJECTID + ", 0)'>" +
    "<div class='name_img'>" +
    "<p>" + item.品牌 + "</p>" +
    "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='" + item.OBJECTID + "' onclick='add_product(" + item.OBJECTID + ", 0)'>" +
    "</div>" +
    "<hr/>" +
    "<p>" + item.名字 + "</p>";

  // 添加产品元素到父容器
  productContainer.appendChild(productElement);

  // 在每第四个产品后添加一个包含类的 div
  if ((index + 1) % 4 === 0) {
    var boxContainElement = document.createElement('div');
    boxContainElement.className = 'box_contain';
    productContainer.appendChild(boxContainElement);
  }
});


})

//获得所有多选框的对象
	var fav=document.getElementsByName("fav");

//判断是否是全选操作
function checkTest1(th){

	//判断选项是否被勾选
	var flag=th.checked;
	//alert(flag);
	
	
	//通过forech的方法遍历名为fav的有序列表
	for (var i in fav) {
		fav[i].checked=flag;
	}
}

//单选决定全选操作
function checkTest2(){
	
	var flag=true;
	
	/*遍历出去第一个和最后一个fav，后来再处理*/
	for (var i=1;i<fav.length-1;i++) {
		if (!fav[i].checked) {
			flag=false;
			break;
		}
	}
	/*决定是否被勾选，fav[0]代表第一个全选框，fav[1]代表第二个多选框*/
	fav[0].checked=flag;
	fav[fav.length-1].checked=flag;
	//alert(flag);
	
	
	
	//商品的总价格
	var zong=0;
	//统计被勾选对象的数量
	var num=0;
	//统计商品数量
	var spNum=0;
	
	//价格是否统计,遍历第2、3、4个fav
	for (var i=1;i<fav.length-1;i++) {
		//如果被勾选
		if (fav[i].checked) {
			num++;
			
			//获得ul父节点
			var par =fav[i].parentNode.parentNode;
			//获得指定ul下的所有li
			var li= par.getElementsByTagName("li");
			
			//单个商品的总价格:将得到的数据通过￥分开，并取第二个元素
			var z=li[6].innerText.split("￥")[1];
			//获得所有商品的总结格
			zong+=Number(z);
			document.getElementById("zongz").innerText=zong;
			
			//获得商品的数量
			var z2=li[5].getElementsByTagName("input");
			var num2=z2[0].value;
			spNum+=Number(num2);
			//获得商品数量统计对象
			document.getElementById("snum").innerText=spNum;
		}
	}
	if(num==0){
	 	document.getElementById("zongz").innerText=0;	
	 	document.getElementById("snum").innerText=0;
	}
	
}

/*控制数量的增加或减少，注意括号问题*/
function checkTest3(th, sig) {
    // 就是 th，即传入的 this 值
    var pre;
    if (sig == "1") {
        // 获得下一个节点对象
        pre = th.nextElementSibling;
        if (Number(pre.value) > 0) {
            // 获得节点的 value 的值
            pre.value = Number(pre.value) - 1;
        }
    } else {
        // 获得上个节点的对象
        pre = th.previousElementSibling;
        // 获得下一个节点对象
        pre.value = Number(pre.value) + 1;
    }

    // 计算每个商品的价格
    // 获取当前节点的父节点的上一个节点的内容，即每个商品的单价 innerText
    var val = pre.parentNode.previousElementSibling.innerText;
    // 提取商品价格，去掉货币符号
    var price = parseFloat(val.replace('￥', ''));
    // 计算总价格
    var zong = price * Number(pre.value);

    // 把总价赋值给指定对象
    pre.parentNode.nextElementSibling.innerText = "￥" + zong;
}


//删除指定节点
function checkTest4(th){
	//获得父节点div(<a>的父节点（li）的父节点（ul）的父节点div)
	var div=th.parentNode.parentNode.parentNode.parentNode;
	div.remove();
	
}



document.getElementById('getAddressBtn').addEventListener('click', function() {
    // 检查 BMap 对象是否已经定义
    if (typeof BMapGL !== 'undefined') {
        // 创建地理位置实例
        var geolocation = new BMapGL.Geolocation();

        // 获取当前位置
        geolocation.getCurrentPosition(function(r) {
            // 检查 BMAP_STATUS_SUCCESS 是否已经定义
            if (typeof BMAP_STATUS_SUCCESS !== 'undefined' && this.getStatus() == BMAP_STATUS_SUCCESS) {
                var myGeo = new BMapGL.Geocoder();

                // 根据坐标得到地址描述
                myGeo.getLocation(r.point, function(result) {
                    if (result) {
                        document.getElementById('addressInput').value = result.address;
                    }
                });
            } else {
                alert('failed' + this.getStatus());
            }
        });
    } else {
        alert('BMapGL is not defined. 百度地图 API 未加载成功。');
    }
});

var filePath1 = '../json/绣品.json';
function add_product(id){
        
    Promise.all([
        $.getJSON(filePath1)
    ]).then(function (results) {
        // 获取两个 JSON 文件的数据
        var json_x = results[0];
        console.log('json_x:', json_x);
        
        if (id) {
            function createProductItem(id,name, price,miaoshu) {
                // 创建商品元素
                var productItem = document.createElement('div');
                productItem.classList.add('info', 'warp');
        
                var ulElement = document.createElement('ul');
        
                // 创建 li 元素
              var liContent = [
        '<li class="info_1"><input type="checkbox" name="fav" onclick="checkTest2()"/> </li>',
        '<li class="info_2"> <img src="../MiaoXiu_Image/' + id + '.jpg" width="100px" height = "80px"/> </li>',
        '<li class="info_3"><a>' + name + '</a></li>',
        '<li class="info_4"><a>'+ miaoshu +'</a> </li>',
        '<li class="info_5">￥' + price + '</li>',
        '<li class="info_6"><button onclick="checkTest3(this,1),checkTest2()" >-</button><input type="text" name="" id="" value="1" /><button class="bot" onclick="checkTest3(this,2),checkTest2()" >+</button></li>',
        '<li class="info_7">￥' + price + '</li>',
        '<li>',
        '   <a href="javascript:void(0)" onclick="checkTest4(this),checkTest2()">删除</a><br />',
        '   <a>已到我的关注</a>',
        '</li>'
    ];
    
    var liElement = document.createElement('li');
    liElement.innerHTML = liContent.join('');
    ulElement.appendChild(liElement);
    
        
                // 将 ul 元素添加到商品元素
                productItem.appendChild(ulElement);
        
                return productItem;
            }
                var productElement;

                    var match = json_x.find(function(item) {
                        return item.OBJECTID === id;
                        
                    });
                    console.log('Match:', match);
                    
                    var name2 = match['名字'];
                    var band = match['品牌'];
                    var yuyi = match['寓意'];
                    var combinedString = band + ' ' + yuyi;
    
                    var price = match['价格']
                    productElement = createProductItem(id,name2,price,combinedString);
    
                // 将商品元素添加到页面中的某个容器
                var container = document.getElementById('commodity');
                console.log(productElement);
    
                container.appendChild(productElement);
    } 

})
}

function refreshProduct() {
    location.reload();
}