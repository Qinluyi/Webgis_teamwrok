const express = require('express');
const { Client } = require('pg');
const connectionString = 'postgres://postgres:123456@localhost:5432/MiaoXiu';

const client = new Client({
    connectionString: connectionString
});

client.connect();

var app = express();

app.set('port', process.env.PORT || 5500);



//查询语句  翻页查询
app.get('/search_items', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var name=req.query.name;
    var num=req.query.num;
    var start=req.query.start;
    client.query('SELECT * FROM xiupin1 where 类别  = $1 ORDER BY objectid LIMIT $2 OFFSET $3;', [name,num,start], function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const xiupinData = result.rows;
        console.log("yes");
        // 以 JSON 格式返回数据给前端
        res.status(200).json(xiupinData);
    });
});


//查询语句 单个商品信息查询
app.get('/search_id', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var object_id=req.query.object_id;
    
    client.query('SELECT * FROM xiupin1 where objectid  = $1;', [object_id],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        console.log("yes1");
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
    });
});

//查询语句，查询任意3个同类商品
app.get('/find_the_same', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    
    client.query('SELECT * FROM xiupin1 where 类别  = $1 ORDER BY RANDOM() LIMIT 3;', [type],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
    });
});
//查询语句，查询8个课程
app.get('/classes', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var start=req.query.start;
    var num=req.query.num;
    client.query('SELECT * FROM classes OFFSET $1 LIMIT $2;', [start,num],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
        console.log("已请求");
        
    });
});


//查询语句，查询1个课程
app.get('/get_class', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var class_id=req.query.class_id;
    
    client.query('SELECT * FROM classes where 课程id = $1;', [class_id],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
    });
});

//查询语句，查询3个同类课程
app.get('/get_same_classes', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    
    
    client.query('SELECT * FROM classes ORDER BY RANDOM() LIMIT 3;', function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
    });
});





//增加语句
app.get('/list3', function(req, res) {
	const id3 = req.query.id3;
    const name3 = req.query.name3;
    const code3 = req.query.code3;
    const depart3 = req.query.depart3;
    const city3 = req.query.city3;
    const level3 = req.query.level3;
    const type3 = req.query.type3;
    const less3 = req.query.less3;
    const remark  = "111";
          const query = 'INSERT INTO edu_school_edu_school (id, school_name, school_code, admin_depart, localtion, school_level, edu_type, type, remark) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
          const values = [id3, name3, code3, depart3, city3, level3, type3, less3, remark];
      
          client.query(query, values, function(error, results)  {
      
            if (error) {
              return console.error('Error executing query', error.stack);
            }
      
            res.send(results.rows);
            // Your callback logic here
          });
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



app.listen(5500, function () {
    console.log('Server is running.. on Port 5500');
});




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
