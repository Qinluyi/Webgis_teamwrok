// const express = require('express');
// const { Client } = require('pg');
// const connectionString = 'postgres://postgres:Xxsht123@localhost:5858/ajaxphp';
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const client = new Client({
//     connectionString: connectionString
// });

// client.connect();

// const app = express(); // 只需声明一次 Express 应用程序

// app.set('port', process.env.PORT || 5000);

// const cors = require('cors');

// // Enable CORS for all routes
// app.use(cors());

// app.options('*', cors()); // Enable preflight for all routes

const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.set('port', process.env.PORT || 5000);

const cors = require('cors');
app.use(cors());
app.options('*', cors());

const connectionString = 'postgres://postgres:Xxsht123@localhost:5858/ajaxphp';
let client = null;
let mySwitch = false; // 默认值为false

// 检查数据库和表是否存在的函数
async function doesDatabaseAndTableExist() {
  const checkClient = new Client({
      connectionString: 'postgres://postgres:Xxsht123@localhost:5858/ajaxphp', // 连接到默认的 'postgres' 数据库
  });

  try {
      await checkClient.connect();

      // 检查数据库是否存在
      const databaseResult = await checkClient.query('SELECT 1 FROM pg_database WHERE datname = $1', ['ajaxphp']);
      if (databaseResult.rows.length === 0) {
          console.log('数据库 "ajaxphp" 不存在。跳过数据库连接。');
          return false;
      }

      // 检查表是否存在
      const tableResult = await checkClient.query('SELECT 1 FROM information_schema.tables WHERE table_name = $1', ['xiupin1']);
      if (tableResult.rows.length === 0) {
          console.log('表 "xiupin1" 不存在。跳过数据库连接。');
          return false;
      }

      // 数据库和表都存在
      return true;
  } catch (error) {
      console.error('连接数据库时出错:', error.message);
      return false; // 返回 false 表示数据库或表不存在
  } finally {
      await checkClient.end();
  }
}

// 在检查数据库存在性后启动应用程序
doesDatabaseAndTableExist().then((databaseExists) => {
    if (databaseExists) {
        mySwitch = true; // 设置 mySwitch 为 true
        client = new Client({
            connectionString: connectionString
        });
        client.connect();
        console.log('已连接到数据库');
    } else {
        console.log('跳过数据库连接，数据直接加入到json文件中');
    }

    // 在这里定义你的路由和其他配置
    // ...

    // 启动 Express 服务器
    app.listen(app.get('port'), () => {
        console.log(`服务器正在运行在端口 ${app.get('port')}`);
        console.log(`mySwitch 的值为: ${mySwitch}`);
    });
}).catch((error) => {
    console.error('检查数据库存在性时出错:', error);
});



// 在这里定义你的路由和其他配置
app.get('/checkConnection', (req, res) => {
  // 在这个示例中，将 mySwitch 的值作为 JSON 对象发送回前端
  res.json({ mySwitch: mySwitch });
});

// app.get('/checkConnection', async (req, res) => {
//   try {
//     // 执行一个简单的查询，例如 SELECT * FROM xiupin WHERE id = 1
//     const result = await client.query('SELECT * FROM xiupin WHERE id = 1');
    
//     // 使用client.end来检查连接状态
//     await client.end();

//     // 如果查询成功且连接正常，返回 true
//     res.json({ my_switch: true });
//   } catch (error) {
//     // 如果发生错误，返回 false
//     res.json({ my_switch: false });
//   }    
// });


  
  



//增加语句
app.get('/list3', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    const id=req.query.id;
    const author = req.query.author;
    const meaning = req.query.meaning;
    const category = req.query.category;
    const categorynum = req.query.categorynum;
    const brand = req.query.brand;
    const name = req.query.name;
    const description = req.query.description;
    const picture = req.query.picture;
    const adcode=req.query.adcode;
    const ename=req.query.ename;
    const longtitude=req.query.longtitude;
    const latitude=req.query.latitude;
    const price=req.query.price;
    const ups=req.query.ups;
    const soldnum=req.query.soldnum;
          const query = 'INSERT INTO xiupin1 (objectid,id,发布者i, 寓意, 非遗种, 类别, 品牌,名字,描述, 图片,adcode,name,经度,纬度,价格,点赞数,销量) VALUES (nextval(\'pk\'),$1, $2, $3, $4, $5, $6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)';
          const values = [id,author, meaning, category, categorynum, brand,name,description, picture,adcode,ename,longtitude,latitude,price,ups,soldnum];
      
          client.query(query, values, function(error, results)  {
      
            if (error) {
              return console.error('Error executing query', error.stack);
            }
      
            res.send(results.rows);
            // Your callback logic here
          });
});

// 使用 body-parser 中间件来解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 处理 POST 请求
app.post('/saveData', (req, res) => {
    const newData = req.body;
  
    // 读取已有数据
    const existingData = fs.readFileSync('xiupin.json', 'utf-8');
    const dataArray = existingData ? JSON.parse(existingData) : [];
  
    // 将新数据追加到数组中
    dataArray.push({
      OBJECTID: dataArray.length + 1,
      ID: newData.id,
      发布者ID: newData.author, // 请根据实际情况替换为真实的发布者ID
      寓意: newData.meaning,
      非遗种: newData.category,
      类别: newData.categorynum,
      品牌: newData.brand,
      名字: newData.name,
      描述: newData.description,
      图片: newData.picture,
      adcode: newData.adcode,
      name: newData.ename,
      经度: newData.longtitude,
      纬度: newData.latitude,
      价格: newData.price,
      点赞数: newData.ups,
      销量: newData.soldnum
    });
  
    // 将更新后的数据写回文件
    fs.writeFileSync('xiupin.json', JSON.stringify(dataArray, null, 2), 'utf-8');
  
    res.json({ success: true, message: 'Data saved successfully' });
  });
  
  

// //删除语句

// app.delete('/', function (req, res, next) {
//     const schoolIdToDelete = 1; // 指定要删除的学校的ID

//     client.query('DELETE FROM edu_school_edu_school WHERE id = $1', [schoolIdToDelete], function (err, result) {      
//         if (err) {
//             console.log(err);
//             res.status(400).send(err);
//         }

//         // 检查是否成功删除了数据
//         if (result.rowCount > 0) {
//             // 成功删除
//             res.status(200).send('School with ID ' + schoolIdToDelete + ' deleted successfully.');
//         } else {
//             // 没有找到要删除的数据
//             res.status(404).send('School with ID ' + schoolIdToDelete + ' not found.');
//         }
//     });
// });


// app.get('/', function (req, res, next) {
//     const newSchool = {
//         id:2957,
//         school_name:"野鸡大学",  // 从请求体中获取学校名称
//         school_code: "13567",  // 从请求体中获取学校位置
//         admin_depart: "江湖市",
//         localtion: "江湖市",
//         school_level: "大专",
//         edu_type:"普通高等学校",
//         type:"综合",
//         remark:"不好"
//     };

//     client.query(
//         'INSERT INTO edu_school_edu_school (id, school_name,school_code,admin_depart,localtion,school_level,edu_type,type,remark) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
//         [newSchool.id, newSchool.school_name,newSchool.school_code,newSchool.admin_depart,newSchool.localtion,newSchool.school_level,newSchool.edu_type,newSchool.type,newSchool.remark],
//         function (err, result) {
//             if (err) {
//                 console.log(err);
//                 res.status(400).send(err);
//             }

//             // 检查是否成功插入了数据
//             if (result.rows.length > 0) {
//                 // 成功插入，返回新插入的学校数据
//                 res.status(200).send(result.rows[0]);
//             } else {
//                 // 插入失败
//                 res.status(500).send('Failed to insert school.');
//             }
//         }
//     );
// });



// app.listen(5000, function () {
//     console.log('Server is running.. on Port 5000');
// });




			// //单击查询按钮后，根据用户在文本框中输入的姓名查询数据库中的特定记录								
            // $("#list").click(function(){
            //     var name1 = $("#name1").val();
            //     $.get(
            //     "http://127.0.0.1:8000/list",
            //     {
            //         name1:name1
            //     },
            //     function(data){
            //         for(var i=0;i<data.length;i++){
            //             console.log(data[i]);
            //             show(data[i]);
            //         }
            //     });
            // });	
