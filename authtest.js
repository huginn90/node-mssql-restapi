var express = require('express');
var bodyParser = require('body-parser');
var sql = require('mssql');
var basicAuth = require('basic-auth');

var config = {
    server: '192.168.78.1',
    database: 'diaper',
    user: 'DiaperUser',
    password: '0000',
    port: 1433
};

var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
 
var auth = function (req, res, next) {

    var user = basicAuth(req);

    var pool = new sql.ConnectionPool(config, err => {
    var request = pool.request();

    request.input('babyid', sql.NVarChar, user.name);
    request.input('password', sql.NVarChar, user.pass);

    request.execute('Select_Baby',
        (err, result, returnValue) => {
            if (result.recordset.length == 1) {
                res.status(200).json(result.recordset);
                // next();
            }
            else
               res.status(404).json({
                        Error: `id ${user.name} does not exist,`
                });    
        });
    });

//   if (!user || !user.name || !user.pass) {
//     res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//     res.sendStatus(401);
//     return;
//   }
//   if (user.name === 'amy' && user.pass === 'passwd123') {
//     next();
//   } 
//   else {
//     res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//     res.sendStatus(401);
//     return;
//   }

}

app.get("/auth", auth, function (req, res) {
    // res.send("This page is authenticated!")
});
 
var port=3000;
app.listen(port);
console.log("app running on localhost:"+port);