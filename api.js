var express = require('express');
var bodyParser = require('body-parser');
var sql = require('mssql');

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

//select baby all test
app.get('/baby', (req, res) => {
    var pool = new sql.ConnectionPool(config, err => {
        var request = pool.request();

        request.execute('Select_BabyAll',
            (err, result, returnValue) => {
                res.status(200).json(result.recordset);
            });
    });
});

// select baby login
app.get('/baby/:babyid&:password', (req, res) => {
    var pool = new sql.ConnectionPool(config, err => {
        var request = pool.request();

        var babyid = req.params.babyid;
        var password = req.params.password;

        request.input('babyid', sql.NVarChar, babyid);
        request.input('password', sql.NVarChar, password);

        request.execute('Select_Baby',
            (err, result, returnValue) => {
                if (result.rowsAffected == 0)
                    res.status(404).json({
                        Error: `id ${babyid} does not exist,`
                    });
                else
                    res.status(200).json(result.recordset);
            });
    });
});

// select babyid only id check
app.get('/baby/:babyid', (req, res) => {
    var pool = new sql.ConnectionPool(config, err => {
        var request = pool.request();

        var babyid = req.params.babyid;

        request.input('babyid', sql.NVarChar, babyid);

        request.execute('Select_BabyId',
            (err, result, returnValue) => {
                if (result.recordset.length == 1)
                    res.status(200).json({count:1});
                else
                    res.status(200).json({count:0});
            });
    });
});

// select status latest alram
app.get('/status/:babyid', (req, res) => {
    var pool = new sql.ConnectionPool(config, err => {
        var request = pool.request();

        var babyid = req.params.babyid;

        request.input('babyid', sql.NVarChar, babyid);

        request.execute('select_status_latest',
            (err, result, returnValue) => {
                if (result.recordset.length == 0)
                    res.status(404).json({
                        Error: `id ${babyid} does not exist,`
                    });
                else
                    res.status(200).json(result.recordset);
            });
    });
});

// select status latest alram
app.get('/count/:babyid', (req, res) => {
    var pool = new sql.ConnectionPool(config, err => {
        var request = pool.request();

        var babyid = req.params.babyid;

        request.input('babyid', sql.NVarChar, babyid);

        request.execute('select_status_wastecount',
            (err, result, returnValue) => {
                if (result.recordset.length == 0)
                    res.status(404).json({
                        Error: `id ${babyid} does not exist,`
                    });
                else
                    res.status(200).json(result.recordset);
            });
    });
});

// insert baby 
app.post('/baby', (req, res) => {
    var pool = new sql.ConnectionPool(config, err => {
        var request = pool.request();

        var babyid = req.body.babyid;
        var password = req.body.password;
        var Name = req.body.Name;

        request.input('BabyId', sql.NVarChar, babyid);
        request.input('password', sql.NVarChar, password);
        request.input('Name', sql.NVarChar, Name);

        request.execute('Insert_Baby',
            (err, result, returnValue) => {
                if (result.rowsAffected == 0)
                    res.status(500).json({
                        Error: `failed to insert baby`
                    });
                else
                    res.status(200).json(result.recordset);
            });
    });
});

// insert device
app.post('/device', (req, res) => {
    var pool = new sql.ConnectionPool(config, err => {
        var request = pool.request();

        var babyid = req.body.babyid;
        var deviceid = req.body.deviceid;

        request.input('deviceid', sql.NVarChar, deviceid);
        request.input('babyid', sql.NVarChar, babyid);

        request.execute('Insert_Device',
            (err, result, returnValue) => {
                if (result.rowsAffected == 0)
                    res.status(500).json({
                        Error: `failed to insert device`
                    });
                else
                    res.status(200).json(result.recordset);
            });
    });
});

// insert status arduino
app.post('/status', (req, res) => {
    var pool = new sql.ConnectionPool(config, err => {
        var request = pool.request();

        var deviceid = req.body.deviceid;
        var amount = req.body.amount;

        request.input('DeviceId', sql.NVarChar, deviceid);
        request.input('amount', sql.NVarChar, amount);

        request.execute('Insert_Status',
            (err, result, returnValue) => {
                if (result.rowsAffected == 0)
                    res.status(500).json({
                        Error: `failed to insert status`
                    });
                else
                    res.status(200).json(result.recordset);
            });
    });
});

var port = 3005;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});