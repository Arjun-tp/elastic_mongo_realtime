var req = require("express");
var express = req();
var mongoose = require('mongoose');
var router = req.Router();
var config    = require('./config/development');
var db = config.db;
const elasticSearch = require('elasticsearch');
const client = new elasticSearch.Client({
    hosts: ['http://localhost:9200']
})
// var routes = require('./routes');
var models = require('./config/api/models/check')

client.ping({
    requestTimeout:30000,
},function(error){
    if(error){
        console.error("DOWN");
    }else{
        console.log('DONE')
    }
})
console.log(config);

var app = {
    config : config
}

function endProcess() {
    console.log(new Date() + ' @ endProcess is invoked... ');
    process.exit();
}

mongoose.connection.on('connected', function () {
    console.log('channel connected -----');
    var port = process.env.PORT || 6060;
//    routes.register(router);
    express.use('/api', router);
    express.listen(port);
    console.log('Server started successfully.. !!! Times- PORT - ' + port + '\n\n\n');
checkMongo();


});

mongoose.connection.on('error', function (mongoError) {
    console.log(new Date() + ' @ MongoDB: ERROR connecting to: ' + 'mongodb://' + db.mongo.host + '/' + db.mongo.db + ' - ' + mongoError);
    endProcess();
});

mongoose.connection.on('close', function () {
    console.log(new Date() + ' @ MongoDB: Connection Closed');
    console.log('DataBase down!! Please restart your DB and Server!!');
    // endProcess();
});


console.log('db.mongo : '+JSON.stringify(db.mongo));
mongoose.connect('mongodb://' + db.mongo.host + ':' + db.mongo.port + '/' + db.mongo.db);




function checkMongo(){
var query = {
    firstName: 'AJ',
    lastName: 'T' 
}
    models.create(query).then(function(data,err){

        if(!err){
            client.index({
                index : 'users',
                id :data._id.toString(),
                type : "users",
                body : {
                    firstName : data.firstName,
                    lastName : data.lastName
                }
            },function(err,resp,status){

                console.log("Response",resp);
                console.log("Error",err);
                console.log("Status",status);

            })

        }else{
            console.log("Error in else",err);

        }

        
            

    })
}


module.exports.default = app;
