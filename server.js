const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

//connect to MongoDB

mongo.connect('mongodb://localhost/login', function(error, db){
    if (error) throw err;

    console.log("Connected to the database")

    client.on('connection', function(socket){
        let login = db.collection('login');
        //the index.html sends the 'submit' when submit button is pressed
        socket.on('submit', function(data){
            let user = data.name;
            let password = data.password;
            if(user == '' || password == ''){
                console.log("Need to enter username or password")
            } else{
                //hash the password
                bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
                    if (err) throw err;
                    bcrypt.hash(password, salt, function(err, hash){
                        if (err) throw err;
                        password = hash;
                        login.insert({username: user, password: password}, function(){
                            console.log("new user signed up " + user);
                        });
                    });
                });
            }
        });

    });



});

