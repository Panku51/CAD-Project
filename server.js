//First step npm init -y
//second step npm install express --save

const { response } = require("express");
var express = require("express");
const { url } = require("inspector");
var path = require("path");
var app = express();
var sql = require("mysql");

app.use(express.static("public"));//to import css and js files.


app.listen(5150, function () {
    console.log("server started");
})

//conecting to database these are default values(host,user)
var dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "NODEJS",
}
//to check that connected or not
var dbcon = sql.createConnection(dbConfig);
dbcon.connect(function (err, req, resp) {
    if (err)
        console.log("Nada");
    else
        console.log("Tada");
})


// remember order should be req,resp otherwise it will throw error
app.get("/index", function (req, resp) {
    resp.sendFile(__dirname + "/public/index.html");

})

// before using the function path, install npm install path
app.get("/client", function (req, resp) {
    var filepath = path.join(path.resolve(), "public", 'client.html');
    resp.sendFile(filepath);
})

app.get("/vendor", function (req, resp) {
    var filepath = path.join(path.resolve(), "public", "vendor.html");
    resp.sendFile(filepath);
})

app.use(express.urlencoded({ extended: true }));// for the conversion of binary to json,otherwise it will show undefined.


var fileupload = require("express-fileupload")// to upload file in server install npm install express-fileupload
app.use(fileupload());

//check by filling full form first
app.post("/client-s", function (req, resp) {
    //console.log(req.body.mbl);
    //var name=req.body.user;
    //req.body.user=name;


    if (req.files == null) {
        req.body.picname = "default_profile_avatar.svg"
    }
    else {
        req.body.picname = req.files.pic.name;
        var data = path.join(path.resolve(), "public", "uploads", req.files.pic.name);
        req.files.pic.mv(data);
    }

    //var data=[req.body.txtname,req.body.email,req.body.mbl,req.body.adr,req.body.city];

    var data = [req.body.txtname, req.body.email, req.body.mbl, req.body.adr, req.body.city];
    dbcon.query("insert into client values(1,?,?,?,?,?)", data, function (err) {
        if (err) {
            resp.send(err.message);
        }
        else {
            resp.send("Tada");
        }
    })

    //resp.send(req.body);

})

app.post("/vendor-s", function (req, resp, err) {

    var service = req.body.svr.toString();
    req.body.svr = service;

    if (req.files == null) {
        req.body.prfname = "default_profile_avatar.svg"
    }
    else {
        //for uploading file in server
        req.body.prfname = req.files.prf.name;
        var data = path.join(path.resolve(), "public", "uploads", req.files.prf.name);
        req.files.prf.mv(data);
    }
    //console.log(err.message);
    var data = [req.body.email, req.body.user, req.body.mobile, req.body.fname, req.body.estd, req.body.fadr, req.body.city, req.body.acno, req.files.prf.name, req.body.selsvr, req.body.info];
    dbcon.query("insert into vendor values(?,?,?,?,?,?,?,?,?,?,?)", data, function (err) {
        if (err)
            resp.send(err.message);
        else
            resp.send("Saved");
    })

    //resp.send(req.body);
})

app.get("/search-in-table", function (req, resp) {
    //resp.send("Tada"+ req.query.id);
    dbcon.query("select * from vendor where email=?", [req.query.id], function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })

})

app.post("/signup", function (req, resp) {
    dos;var curd = new Date();
    var dos = curd.getFullYear() + "-" + (curd.getMonth() + 1) + "-" + curd.getDate();
    //req.body.dos = 

    var data = [req.body.email, req.body.pwd, req.body.type, req.body.dos];
    dbcon.query("insert into users values(?,?,?,?)", data, function (err,result) {
        if (err)
            resp.send(err.message);
        else
            resp.send("success");
    })
})

app.get("/check-in-table", function (req, resp) {
    //resp.send("Tada" + req.query.id);
    dbcon.query("select * from users where email=?", [req.query.id], function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })

})

//-------------------------ADMIN SECTION----------------------------------
app.get("/admin", function (req, resp) {
    var filepath = path.join(path.resolve(), "public","dash-admin.html");
    resp.sendFile(filepath);
})

app.get("/vendor-fetch", function (req, resp) {
    //console.log("run");
    dbcon.query("select * from vendor", function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})

app.get("/vendor-del", function (req, resp) {
    var data = req.query.email;
    dbcon.query("delete from vendor where email=?", data, function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result.affectedRows + "Record Deleted");
    })
})

app.get("/client-fetch", function (req, resp) {
    dbcon.query("select * from client", function (err, res) {
        if (err)
            resp.send(err);
        else
            resp.send(res);
    })
})

app.get("/client-del", function (req, resp) {
    var data = req.query.email;
    dbcon.query("delete from client where email=?", data, function (err, res) {
        if (err)
            resp.send(err.message);
        else
            resp.send(res.affectedRows + "Record Deleted");
    })
})
//****************************************END*********************************** */

//------------------------------PLAN A FUNCTION----------------------------------*/
app.get("/plan", (reqKuch, respKuch) => {
    respKuch.sendFile(__dirname + "/public/plan-function.html");
})

app.get("/fetch-city", function (req, resp) {
    //console.log("run");
    dbcon.query("select distinct city from vendor", function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})
app.get("/fetch-service", function (req, resp) {
    //console.log("run");
    dbcon.query("select selservices from vendor", function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})

app.get("/fetch-all",function(req,resp){
    //console.log(req.query.scity);
    //console.log(req.query.service);
    dbcon.query("select * from vendor where city=? and selservices like ?",[req.query.scity,"%"+req.query.service+"%"],function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
   })
})
