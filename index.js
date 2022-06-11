const mysql = require('mysql');  
const express = require('express');  
var app = express();  
const bodyparser = require('body-parser');  
const cors = require('cors');
app.use(cors({
    origin: '*'
}));
  
// Used for sending the Json Data to Node API  
app.use(bodyparser.json());  
  
// Connection String to Database  
var mysqlConnection = mysql.createConnection({  
    host: '127.0.0.1',  
    user : 'monty',  
    password : 'Welcome2024@',   
    database : 'erp_general',  
    multipleStatements : true  
}); 
// To check whether the connection is succeed for Failed while running the project in console.  
mysqlConnection.connect((err) => {  
    if(!err) {  
        console.log("Db Connection Succeed");  
    }  
    else{  
        console.log("Db connect Failed \n Error :" + JSON.stringify(err,undefined,2));  
    }  
});  
  
// To Run the server with Port Number  
app.listen(3000,()=> console.log("Express server is running at port no : 3000"));  
  
// CRUD Methods  

//Login


//Insert a brand through the Stored Procedure  
app.post('/login',(req,res)=>{  
  
    let item=req.body;    
    let sql=`select u.id as user_id, u.name ,u.email,u.client_id,u.role_id,r.name as role_name,u.gender,c.logo_title  from user u join role r on u.role_id=r.id join client c on c.id=u.client_id  where u.email='${item.email}' and u.pwd='${item.password}' and u.is_active=1`;
     mysqlConnection.query(sql,[item.email],(err,rows,fields)=>{  
        if(!err) 
        {         
        res.send(rows);  
        }
        else  
        {
        console.log(err);  
        }
          
    })  
});  

//Get all Brands  
app.get('/brands',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM brand WHERE is_deleted=0 order by name',(err,rows,fields)=>{  
    if(!err)   
    {
  
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  

//Get the Employee Data based on Id  
app.get('/brands/:id',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM brand WHERE is_deleted=0 and client_id = ? order by name',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send(rows);  
    else  
        console.log(err);  
      
})  
});  


//Insert a brand through the Stored Procedure  
app.post('/brands',(req,res)=>{  
    let brand = req.body;
    console.log(brand);
    var sql = "SET @id = ?;SET @name = ?;SET @manufacturer = ?; SET @user_id= ?; SET @flag= ?; \ CALL manage_brand(@id,@name,@manufacturer,@user_id,@flag);"  
    console.log(sql);
    mysqlConnection.query(sql,[brand.id,brand.name,brand.manufacturer,brand.user_id,brand.flag],(err,rows,fields)=>{  
    if(!err) 
    {  
   
    res.send("Insertion Completed");  
    }
    else  
    {
        console.log(err);  
    }
})  
});  

//Delete the Employee Data based on Id  
app.put('/brands/:id',(req,res)=>{  

    let brand = req.body;  
    var sql = "SET @id = ?;SET @name = ?;SET @manufacturer = ?;SET @user_id= ?;SET @flag= ?; \ CALL manage_brand(@id,@name,@manufacturer,@user_id,@flag);"  
    console.log(sql);
    mysqlConnection.query(sql,[brand.id,brand.name,brand.manufacturer,brand.user_id,brand.flag],(err,rows,fields)=>{  
    if(!err)    
    res.send("Data Deletion Successful");  
    else  
        console.log(err);  
      
})  
});  


  
//Update an Employee through the Stored Procedure  
app.put('/brands',(req,res)=>{  
    let brand = req.body;  
    var sql = "SET @id = ?;SET @name = ?;SET @manufacturer = ?;SET @user_id= ?; SET @flag= ?; \ CALL manage_brand(@id,@name,@manufacturer,@user_id,@flag);"  
    console.log(sql);
    mysqlConnection.query(sql,[brand.id,brand.name,brand.manufacturer,brand.user_id,brand.flag],(err,rows,fields)=>{  
    if(!err)  
    res.send("Updation Done");  
    else  
        console.log(err);  
})  
});  



//End Section Brand


//For item management

//Get all Brands  
app.get('/items/:id',(req,res)=>{  
    mysqlConnection.query(`SELECT i.*,u.name as uom FROM item_master i JOIN unit_of_measure u on i.unit_id=u.id WHERE i.client_id=${req.params.id} and i.is_deleted=0 order by i.created_on desc`,(err,rows,fields)=>{  
    if(!err)   
    {
    
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  

//Get all Brands  
app.get('/itemlist',(req,res)=>{  
    mysqlConnection.query('SELECT id,item_name as name FROM item_master WHERE is_deleted=0',(err,rows,fields)=>{  
    if(!err)   
    {
  
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  


app.get('/allitems/:id',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM item_master WHERE id = ?',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send(rows);  
    else  
        console.log(err);  
      
})  
});  


//Insert a brand through the Stored Procedure  
app.post('/items',(req,res)=>{  
    let item = req.body;    
    console.log(item);
    var sql = "SET @id =?;SET @description = ?;SET @itemName = ?;SET @groupId = ?;SET @unitId = ?;SET @image = ?;SET @brandId = ?;SET @unitPrice = ?;SET @sellingPrice = ?;SET @isEnabled = ?;SET @maintainStock = ?;SET @minimumStock = ?;SET @lastModifiedBy = ?;SET @gst= ?;SET @flag= ?; \ CALL manage_item(@id,@description,@itemName, @groupId,@unitId,@image,@brandId,@unitPrice,@sellingPrice,@isEnabled,@maintainStock,@minimumStock,@lastModifiedBy,@gst,@flag);"  
  
    mysqlConnection.query(sql,[item.id,item.description,item.item_name,item.group_id,item.unit_id,item.item_image, item.brand_id,item.unit_price,item.selling_price,item.is_enabled,item.maintain_stock,item.minimum_stock_quantity,item.last_modified_by,item.gst,item.flag],(err,rows,fields)=>{  
    if(!err) 
    {     
    res.send("Insertion Completed");  
    }
    else  
    {
        console.log(err);  
    }
})  
});  

//Delete the Employee Data based on Id  
app.put('/items/:id',(req,res)=>{  

    let item = req.body;  
    var sql = "SET @id =?;SET @description = ?;SET @itemName = ?;SET @groupId = ?;SET @unitId = ?;SET @image = ?;SET @brandId = ?;SET @unitPrice = ?;SET @sellingPrice = ?;SET @isEnabled = ?;SET @maintainStock = ?;SET @minimumStock = ?;SET @lastModifiedBy = ?;SET @flag= ?; \ CALL manage_item(@id,@description,@itemName, @groupId,@unitId,@image,@brandId,@unitPrice,@sellingPrice,@isEnabled,@maintainStock,@minimumStock,@lastModifiedBy,@flag);"  
    console.log(sql);
    mysqlConnection.query(sql,[item.id,item.description,item.item_name,item.group_id,item.unit_id,item.item_image, item.brand_id,item.unit_price,item.selling_price,item.is_enabled,item.maintain_stock,item.minimum_stock_quantity,item.last_modified_by,item.flag],(err,rows,fields)=>{   
    if(!err)    
    res.send("Data Deletion Successful");  
    else  
        console.log(err);  
      
})  
});  


  
//Update an Employee through the Stored Procedure  
app.put('/items',(req,res)=>{  
    let item = req.body; 
    var sql = "SET @id =?;SET @description = ?;SET @itemName = ?;SET @groupId = ?;SET @unitId = ?;SET @image = ?;SET @brandId = ?;SET @unitPrice = ?;SET @sellingPrice = ?;SET @isEnabled = ?;SET @maintainStock = ?;SET @minimumStock = ?;SET @lastModifiedBy = ?;SET @gst=?; SET @flag= ?; \ CALL manage_item(@id,@description,@itemName, @groupId,@unitId,@image,@brandId,@unitPrice,@sellingPrice,@isEnabled,@maintainStock,@minimumStock,@lastModifiedBy,@gst,@flag);"  
    console.log(sql);
    mysqlConnection.query(sql,[item.id,item.description,item.item_name,item.group_id,item.unit_id,item.item_image, item.brand_id,item.unit_price,item.selling_price,item.is_enabled,item.maintain_stock,item.minimum_stock_quantity,item.last_modified_by,item.gst,item.flag],(err,rows,fields)=>{  
    if(!err)  
    res.send("Updation Done");  
    else  
        console.log(err);  
})  
});  

//Enf of item management

//For Med item
app.get('/meditems',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM item_master_med WHERE is_deleted=0',(err,rows,fields)=>{  
    if(!err)   
    {
  
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  


app.get('/meditems/:id',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM item_master_med WHERE id = ?',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send(rows);  
    else  
        console.log(err);  
      
})  
});  


//Insert a brand through the Stored Procedure  
app.post('/meditems',(req,res)=>{  
    let item = req.body;    
    console.log(item);
    var sql = "SET @id =?;SET @description = ?;SET @itemName = ?;SET @unitId = ?;SET @image = ?;SET @brandId = ?;SET @unitPrice = ?;SET @isEnabled = ?;SET @minimumStock = ?;SET @lastModifiedBy = ?;SET @flag= ?; \ CALL manage_item_med(@id,@description,@itemName,@unitId,@image,@brandId,@unitPrice,@isEnabled,@minimumStock,@lastModifiedBy,@flag);"  
  
    mysqlConnection.query(sql,[item.id,item.description,item.item_name,item.unit_id,item.item_image, item.brand_id,item.unit_price,item.is_enabled,item.minimum_stock_quantity,item.last_modified_by,item.flag],(err,rows,fields)=>{  
    if(!err) 
    {     
    res.send("Insertion Completed");  
    }
    else  
    {
        console.log(err);  
    }
})  
});  

//Delete the Employee Data based on Id  
app.put('/meditems/:id',(req,res)=>{  

    let item = req.body;  
    var sql = "SET @id =?;SET @description = ?;SET @itemName = ?;SET @unitId = ?;SET @image = ?;SET @brandId = ?;SET @unitPrice = ?;SET @isEnabled = ?;SET @minimumStock = ?;SET @lastModifiedBy = ?;SET @flag= ?; \ CALL manage_item_med(@id,@description,@itemName,@unitId,@image,@brandId,@unitPrice,@isEnabled,@minimumStock,@lastModifiedBy,@flag);"  
  
    mysqlConnection.query(sql,[item.id,item.description,item.item_name,item.unit_id,item.item_image, item.brand_id,item.unit_price,item.is_enabled,item.minimum_stock_quantity,item.last_modified_by,item.flag],(err,rows,fields)=>{  
    if(!err)    
    res.send("Data Deletion Successful");  
    else  
        console.log(err);  
      
})  
});  


  
//Update an Employee through the Stored Procedure  
app.put('/meditems',(req,res)=>{  
    let item = req.body; 
    var sql = "SET @id =?;SET @description = ?;SET @itemName = ?;SET @unitId = ?;SET @image = ?;SET @brandId = ?;SET @unitPrice = ?;SET @isEnabled = ?;SET @minimumStock = ?;SET @lastModifiedBy = ?;SET @flag= ?; \ CALL manage_item_med(@id,@description,@itemName,@unitId,@image,@brandId,@unitPrice,@isEnabled,@minimumStock,@lastModifiedBy,@flag);"  
  
    mysqlConnection.query(sql,[item.id,item.description,item.item_name,item.unit_id,item.item_image, item.brand_id,item.unit_price,item.is_enabled,item.minimum_stock_quantity,item.last_modified_by,item.flag],(err,rows,fields)=>{ 
    if(!err)  
    res.send("Updation Done");  
    else  
        console.log(err);  
})  
});  


//End Med Item

//Dashboard




app.get('/dashboard/:id',(req,res)=>{  

    let sql='SET @user_id =?; \ CALL dashboard_data(@user_id);'
    mysqlConnection.query(sql,[req.params.id],(err,rows,fields)=>{  
        if(!err)  
        { 
            let returnArray=[];
            if(rows !==null)
            {
                  rows.map(element=>{
                    if(Array.isArray(element))
                    {
                        returnArray.push(element)
                    }

                });
             res.send(returnArray);
            
            }
            else
            {
                res.send("No data found");
            }
        
        }
        else  
        {
        console.log(err);  
        }
         
})  
});  

//Dashboard

//Batch

app.get('/batch/:id',(req,res)=>{  
  

    var sql = "SET @in_client_id =?; \ CALL GetBatch(@in_client_id);"  
    mysqlConnection.query(sql,[req.params.id],(err,rows,fields)=>{  
    if(!err) 
    {     
       console.log(rows[1])
    res.send(rows[1]);  
    }
    else  
    {
        console.log(err);  
    }    
      
})  
});  


//Get all Brands  
app.get('/batchlist/:id',(req,res)=>{  
    mysqlConnection.query(`SELECT * FROM batch WHERE client_id=${req.params.id} and is_deleted=0 and exp_date >= now()  and id not in (select batch_id from stock where is_deleted=0 and client_id=${req.params.id});`,(err,rows,fields)=>{  
    if(!err)   
    {
  
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  



app.get('/batches/:id',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM batch WHERE id = ?',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send(rows);  
    else  
        console.log(err);  
      
})  
});  



app.post('/batch',(req,res)=>{  
    let item = req.body;    
    console.log(item);
    var sql = "SET @id =?;SET @name = ?;SET @mfd_date = ?;SET @exp_date = ?;SET @user_id = ?;SET @flag= ?; \ CALL manage_batch(@id,@name,@mfd_date,@exp_date,@user_id,@flag);"  
    mysqlConnection.query(sql,[item.id,item.name,item.mfd_date,item.exp_date,item.user_id,item.flag],(err,rows,fields)=>{  
    if(!err) 
    {     
    res.send("Insertion Completed");  
    }
    else  
    {
        console.log(err);  
    }
})  
});  
 
app.put('/batch/:id',(req,res)=>{  

    let item = req.body;  
    var sql = "SET @id =?;SET @name = ?;SET @mfd_date = ?;SET @exp_date = ?;SET @user_id = ?;SET @flag= ?; \ CALL manage_batch(@id,@name,@mfd_date,@exp_date,@user_id,@flag);"  
    mysqlConnection.query(sql,[item.id,item.name,item.mfd_date,item.exp_date,item.user_id,item.flag],(err,rows,fields)=>{    
    if(!err)    
    res.send("Data Deletion Successful");  
    else  
        console.log(err);  
      
})  
});  


  

app.put('/batch',(req,res)=>{  
    let item = req.body; 
    var sql = "SET @id =?;SET @name = ?;SET @mfd_date = ?;SET @exp_date = ?;SET @user_id = ?;SET @flag= ?; \ CALL manage_batch(@id,@name,@mfd_date,@exp_date,@user_id,@flag);"  
    mysqlConnection.query(sql,[item.id,item.name,item.mfd_date,item.exp_date,item.user_id,item.flag],(err,rows,fields)=>{  
    if(!err)  
    res.send("Updation Done");  
    else  
        console.log(err);  
})  
});  


//End Batch


//Stock


app.get('/stock',(req,res)=>{  
    mysqlConnection.query('SELECT s.id,s.quantity,u.name as unit_of_measure,s.batch_id,i.item_name,i.id as item_id, b.name as batch_name FROM stock s LEFT JOIN item_master i on s.item_id=i.id LEFT JOIN batch b on s.batch_id=b.id JOIN unit_of_measure u on u.id=i.unit_id WHERE s.is_deleted=0',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  


app.get('/getstockitems/:id',(req,res)=>{  
    mysqlConnection.query(`select s.id as stock_id,i.id,s.batch_id,CONCAT(i.item_name,"-",b.name) as item_name,i.item_name as item_for_grid, s.quantity,i.unit_price, u.name as unit_of_measure,b.name as batch_name,DATE_FORMAT(b.exp_date,'%d/%m/%Y') as exp_date, DATE_FORMAT(b.mfd_date,'%d/%m/%Y') as mfd_date from stock s JOIN item_master i on s.item_id=i.id JOIN batch b on b.id=s.batch_id JOIN unit_of_measure u on i.unit_id=u.id where s.client_id=? &&  b.exp_date > now() && s.is_deleted =0 && s.quantity>0 order by b.exp_date`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  

app.get('/consumedstock/:id',(req,res)=>{  
    mysqlConnection.query(`select s.id as stock_id,i.id,s.batch_id,CONCAT(s.registered_quantity, " ", u.name) as registered_quantity,(CONCAT (s.registered_quantity-quantity," ",u.name)) as consumed_quantity,CONCAT(i.item_name,"-",b.name) as item_name,i.item_name as item_for_grid, s.quantity,i.unit_price, u.name as unit_of_measure,b.name as batch_name,DATE_FORMAT(b.exp_date,'%d/%m/%Y') as exp_date, DATE_FORMAT(b.mfd_date,'%d/%m/%Y') as mfd_date from stock s JOIN item_master i on s.item_id=i.id JOIN batch b on b.id=s.batch_id JOIN unit_of_measure u on i.unit_id=u.id where s.client_id=? AND s.is_deleted =0  order by  s.last_modified_date desc`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  

app.get('/disposedstock/:id',(req,res)=>{  
    mysqlConnection.query(`select s.id as stock_id,i.id,s.batch_id,DATE_FORMAT(s.last_modified_date,'%d/%m/%Y') as disposed_date,CONCAT(s.registered_quantity, " ", u.name) as registered_quantity,CONCAT(s.disposed_quantity," ", u.name) as quantity_text ,CONCAT(i.item_name,"-",b.name) as item_name,i.item_name as item_for_grid, s.quantity,i.unit_price, u.name as unit_of_measure,b.name as batch_name,DATE_FORMAT(b.exp_date,'%d/%m/%Y') as exp_date, DATE_FORMAT(b.mfd_date,'%d/%m/%Y') as mfd_date from stock s JOIN item_master i on s.item_id=i.id JOIN batch b on b.id=s.batch_id JOIN unit_of_measure u on i.unit_id=u.id where s.client_id=? && s.is_disposed=1  order by b.exp_date`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }      
})  
});  




app.get('/getgroupedstock/:id',(req,res)=>{  
    mysqlConnection.query(`select i.id,i.minimum_stock_quantity,CONCAT(i.minimum_stock_quantity,' ',u.name) as minimum_stock_quantity_text,  s.batch_id,i.item_name,SUM(s.quantity) as quantity, CONCAT(SUM(s.quantity), ' ' ,u.name) as quantity_text,i.unit_price, u.name as unit_of_measure,  GROUP_CONCAT(b.name,'-',DATE_FORMAT(b.exp_date,'%d/%m/%Y')) as batch_details, DATE_FORMAT(b.mfd_date,'%d/%m/%Y') as mfd_date from stock s JOIN item_master i on s.item_id=i.id JOIN batch b on b.id=s.batch_id JOIN unit_of_measure u on i.unit_id=u.id where s.client_id=? &&  b.exp_date > now() && s.quantity >0 && s.is_deleted =0  GROUP by id`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  

app.get('/expiredstock/:id',(req,res)=>{  
    mysqlConnection.query(`SELECT s.id,s.quantity,u.name as unit_of_measure,s.batch_id,i.item_name,i.id as item_id, b.name as batch_name,DATE_FORMAT(b.exp_date,'%d/%m/%Y') as exp_date, b.exp_date as exp_date_not_formated, DATE_FORMAT(b.mfd_date,'%d/%m/%Y') as mfd_date,CONCAT(s.quantity, ' ', u.name) as quantity_text FROM stock s LEFT JOIN item_master i on s.item_id=i.id LEFT JOIN batch b on s.batch_id=b.id JOIN unit_of_measure u on u.id=i.unit_id WHERE s.client_id=? and s.quantity>0 and   s.is_deleted=0  and  DATE_FORMAT(b.exp_date,'%Y/%m/%d') <= DATE_FORMAT(now(),'%Y/%m/%d')`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  



app.get('/stock/:id',(req,res)=>{  
    mysqlConnection.query(`SELECT s.id,s.quantity,u.name as unit_of_measure,s.batch_id,i.item_name,i.id as item_id, b.name as batch_name,DATE_FORMAT(b.exp_date,'%d/%m/%Y') as exp_date, DATE_FORMAT(b.mfd_date,'%d/%m/%Y') as mfd_date,CONCAT(s.quantity, ' ', u.name) as quantity_text FROM stock s LEFT JOIN item_master i on s.item_id=i.id LEFT JOIN batch b on s.batch_id=b.id JOIN unit_of_measure u on u.id=i.unit_id WHERE s.client_id=? and s.quantity>0 and   s.is_deleted=0`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send(rows);  
    else  
        console.log(err);  
      
})  
});  





app.post('/stock',(req,res)=>{  
    let item = req.body;    
    console.log(item);
    var sql = "SET @stock_id =?;SET @batch_id = ?;SET @item_id = ?;SET @quantity = ?;SET @user_id = ?;SET @flag= ?; \ CALL manage_stock(@stock_id,@batch_id,@item_id,@quantity,@user_id,@flag);"  
    mysqlConnection.query(sql,[item.stock_id,item.batch_id,item.item_id,item.quantity,item.user_id,item.flag],(err,rows,fields)=>{  
    if(!err) 
    {     
    res.send("Insertion Completed");  
    }
    else  
    {
        console.log(err);  
    }
})  
});  
 
app.put('/stock/:id',(req,res)=>{  

    let item = req.body;  
    var sql = "SET @stock_id =?;SET @batch_id = ?;SET @item_id = ?;SET @quantity = ?;SET @user_id = ?;SET @flag= ?; \ CALL manage_stock(@stock_id,@batch_id,@item_id,@quantity,@user_id,@flag);"  
    mysqlConnection.query(sql,[item.stock_id,item.batch_id,item.item_id,item.quantity,item.user_id,item.flag],(err,rows,fields)=>{  
    if(!err)    
    res.send("Data Deletion Successful");  
    else  
        console.log(err);  
      
})  
});  


  

app.put('/stock',(req,res)=>{  
    let item = req.body; 
    console.log(item)
    var sql = "SET @stock_id =?;SET @batch_id = ?;SET @item_id = ?;SET @quantity = ?;SET @user_id = ?;SET @flag= ?; \ CALL manage_stock(@stock_id,@batch_id,@item_id,@quantity,@user_id,@flag);"  
    console.log(sql);
    mysqlConnection.query(sql,[item.stock_id,item.batch_id,item.item_id,item.quantity,item.user_id,item.flag],(err,rows,fields)=>{  
    if(!err)  
    res.send("Updation Done");  
    else  
        console.log(err);  
})  
});  




//End stock


//Doctor

app.get('/doctor',(req,res)=>{  
    mysqlConnection.query('SELECT * from doctor',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }      
})  
});  

//End Doctor

//Client


app.get('/client/:id',(req,res)=>{  
    mysqlConnection.query(`select * from client where id=?`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
}); 

app.put('/client',(req,res)=>{  
    let item = req.body; 
    var sql = "SET @user_id =?;SET @bill_title=?;SET @bill_sub_title=?;SET @logo_title=?;SET @pan=?;SET @pin=?;SET @tin=?;SET @d=?;SET @m=?;SET @y=?;SET @phone_number_1=?; SET @phone_number_2=?; SET @note=?; \ CALL manage_client(@user_id,@bill_title,@bill_sub_title,@logo_title,@pan,@pin,@tin,@d,@m,@y,@phone_number_1,@phone_number_2,@note);"  
    mysqlConnection.query(sql,[item.user_id,item.bill_title,item.bill_sub_title,item.logo_title,item.pan,item.pin,item.tin,item.daily_target_amount,item.monthly_target_amount,item.yearly_target_amount,item.phone_number_1,item.phone_number_2,item.note],(err,rows,fields)=>{   
    if(!err)  
    res.send("Updation Done");  
    else  
        console.log(err);  
})  
});  

//Client


//Invoice


app.get('/invoicebyclient/:id',(req,res)=>{  
    mysqlConnection.query(`select i.*,id.*,DATE_FORMAT(exp_date,'%d/%m/%Y') as exp_date,DATE_FORMAT(b.mfd_date,'%d/%m/%Y') as mfd_date, im.unit_price, u.name as unit from invoice i JOIN invoice_details id on i.invoice_id=id.invoice_id JOIN batch b on id.batch_id=b.id JOIN item_master im on id.item_id=im.id JOIN unit_of_measure u on im.unit_id=u.id where i.client_id=?`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  

app.get('/invoice/:id',(req,res)=>{  
    mysqlConnection.query(`select i.id as main_id,i.invoice_id, i.patient_name,i.doctor_name,i.mobile_number,i.final_discount,DATE_FORMAT(i.invoice_date,'%d/%m/%Y') as invoice_date,im.item_name,id.id as invoice_details_id,id.quantity as quantity, DATE_FORMAT(exp_date,'%d/%m/%Y') as exp_date,DATE_FORMAT(b.mfd_date,'%d/%m/%Y') as mfd_date, im.unit_price, u.name as unit,b.name as batch_name from invoice i JOIN invoice_details id on i.invoice_id=id.invoice_id JOIN batch b on id.batch_id=b.id JOIN item_master im on id.item_id=im.id JOIN unit_of_measure u on im.unit_id=u.id where i.invoice_id=? and id.is_cancelled !=1 and i.is_cancelled=0`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});   
app.get('/invoiceall/:id',(req,res)=>{  
    mysqlConnection.query(`select i.id as main_id,i.invoice_id,i.invoice_date, i.patient_name,i.doctor_name,i.mobile_number,i.final_discount,DATE_FORMAT(i.invoice_date,'%d/%m/%Y') as invoice_date,im.item_name,id.id as invoice_details_id,id.quantity as quantity, DATE_FORMAT(exp_date,'%d/%m/%Y') as exp_date,DATE_FORMAT(b.mfd_date,'%d/%m/%Y') as mfd_date, im.unit_price, u.name as unit,b.name as batch_name,sum(id.total_amount) as total_amount,IF(i.is_cancelled=1,'Cancelled','Created') as is_cancelled from invoice i JOIN invoice_details id on i.invoice_id=id.invoice_id JOIN batch b on id.batch_id=b.id JOIN item_master im on id.item_id=im.id JOIN unit_of_measure u on im.unit_id=u.id where i.client_id= ? group by i.invoice_id order by i.invoice_date desc`,[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    {
    console.log(rows);
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});   

app.put('/disposeitem',(req,res)=>{  
    let item = req.body; 
    var sql = "SET @stock_id =?;SET @qty=?;SET @user_id= ?; \ CALL manage_dispose(@stock_id,@qty,@user_id);"  
    mysqlConnection.query(sql,[item.stock_id,+item.quantity,item.user_id],(err,rows,fields)=>{   
    if(!err)  
    res.send("Updation Done");  
    else  
        console.log(err);  
})  
});  

app.post('/invoice',(req,res)=>{  
    let item = req.body;    
    console.log(item);
    var sql = "SET @id =?;SET @user_id = ?;SET @patient_name = ?;SET @doctor_name = ?;SET @mobile_number = ?;SET @discount = ?;SET @gst = ?;SET @item_details = ?;SET @flag= ?; \ CALL manage_invoice(@id,@user_id,@patient_name,@doctor_name,@mobile_number,@discount,@gst,@item_details, @flag);"  
    mysqlConnection.query(sql,[item.id,item.user_id,item.patient_name,item.doctor_name,item.mobile_number,item.discount,item.gst,item.item_details,item.flag],(err,rows,fields)=>{  
    if(!err) 
    {     
     var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
     console.log(resultArray);
     const arr=resultArray.filter(element=>{        
         if(Array.isArray(element))
         {
             return element;
         }
     }) 
     
      console.log(arr);

    if(arr !==undefined)
    {
        const data=arr[0][0];
        
        res.send(data); 
       
    }
    else
    {
     
        res.send({"new_invoice_id": ""})

    } 
    }
    else  
    {
        console.log(err);  
    }
})  
});  
  
 
app.put('/invoice',(req,res)=>{  

    let item = req.body;  
    console.log(item);
    var sql = "SET @invoice_id =?;SET @user_id =?;SET @flag= ?; \ CALL cancel_invoice(@invoice_id,@user_id,@flag);"  
    mysqlConnection.query(sql,[item.invoice_id,item.user_id,item.flag],(err,rows,fields)=>{  
    if(!err)    
    res.send("Data Deletion Successful");  
    else  
        console.log(err); 
      
})  
});  

app.get('/invoicebyguid/:id',(req,res)=>{  
    let item = req.body; 
    var sql = "SET @guid =?;SET @client_id=?; \ CALL get_invoice_by_guid(@guid,@client_id);"  
    let guid=req.params.id.split('__')[0];
    let client_id=req.params.id.split('__')[1];
    mysqlConnection.query(sql,[guid,+client_id],(err,rows,fields)=>{   
    if(!err)  
    {
        
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
})  
});  


  
//End invoice




//UOM
app.get('/units',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM unit_of_measure',(err,rows,fields)=>{  
    if(!err)   
    {
  
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  

//END UOM

//UOM
app.get('/groups',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM item_group',(err,rows,fields)=>{  
    if(!err)   
    {
  
    res.send(rows);  
    }
    else  
    {
        console.log(err);  
    }
      
})  
});  

//END UOM



//Get all Employees  
app.get('/employees',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM Employee',(err,rows,fields)=>{  
    if(!err)   
    res.send(rows);  
    else  
        console.log(err);  
      
})  
});  
  
//Get the Employee Data based on Id  
app.get('/employees/:id',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM Employee WHERE id = ?',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send(rows);  
    else  
        console.log(err);  
      
})  
});  
  
//Delete the Employee Data based on Id  
app.delete('/employees/:id',(req,res)=>{  
    mysqlConnection.query('DELETE FROM Employee WHERE id = ?',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send("Data Deletion Successful");  
    else  
        console.log(err);  
      
})  
});  
  
  
//Insert an Employee through the Stored Procedure  
app.post('/employees',(req,res)=>{  
    let emp = req.body;  
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @Designation = ?;SET @City = ?;SET @ContactNo = ?; \ CALL AddorUpdateEmployee(@EmpID,@Name,@Designation,@City,@ContactNo);"  
    console.log(sql);
    mysqlConnection.query(sql,[emp.EmpID,emp.Name,emp.Designation,emp.City,emp.ContactNo],(err,rows,fields)=>{  
    if(!err)   
    res.send("Insertion Completed");  
    else  
        console.log(err);  
})  
});  
  
//Update an Employee through the Stored Procedurnpm i cors express nodemonnpm i cors express nodemonnpm i cors express nodemonnpm i cors express nodemonnpm i cors express nodemonnpm i cors express nodemonnpm i cors express nodemonnpm i cors express nodemone  
app.put('/employees',(req,res)=>{  
    let emp = req.body;  
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @Designation = ?;SET @City = ?;SET @ContactNo = ?; \ CALL AddorUpdateEmployee(@EmpID,@Name,@Designation,@City,@ContactNo);"  
    mysqlConnection.query(sql,[emp.EmpID,emp.Name,emp.Designation,emp.City,emp.ContactNo],(err,rows,fields)=>{  
    if(!err)   
    res.send("Updation Done");  
    else  
        console.log(err);  
})  
});  
