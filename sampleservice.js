
exports.RouteGetSomething = function(req,res)
{
    res.status(200).json({"value":"hello world", "params":req.params});
}
exports.RoutePostSomething = function(req,res)
{
    res.status(200).json({"params=":req.params,"body":req.body});
}

exports.getLoginPage =function(req, res) {
    
    res.render('login.ejs', {
        title: "Welcome to CRM Application"
        ,message: ''
        
    });
};
exports.validateLogin=function (req, res){
    
    mysql=require("mysql");
    let psno = req.body.psno;
    let pwd = req.body.pwd;
    console.log(psno);

    let usernameQuery = "SELECT count(*) as numcount FROM `login` WHERE username = '" + psno + "'and password='" + pwd + "'" ;
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log(usernameQuery,"query");
    });
    db.query(usernameQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log(result[0].numcount,"value");
        if (result[0].numcount> 0) {
            message = 'Login successful';
            res.redirect('/home');
           
        } else {
            res.redirect('/');
            message = 'Incorrect Credentials';
        }

    });
};

exports.getHomePage =function(req, res) {
    mysql=require("mysql");
    let query = "SELECT * FROM `players` ORDER BY id ASC"; // query database to get all the players
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    //global.db = db;
    // execute query
    db.query(query, (err, result) => {
        
        if (err) {
            res.redirect('/');
            console.log("errorrr");
        }
        res.render('index.ejs', {
            title: "Welcome to CRM Application"
            ,players: result
            
        });
      
    });
};

exports.addLeadPage=function (req, res) {
    res.render('add-player.ejs', {
        title: "Welcome to Socka | Add a new player"
        ,message: ''
    });
};
exports.addLead=function (req, res){
    console.log(req);
    if (!req.files==0) {
        return res.status(400).send("No files were uploaded.");
    }

    let message = '';
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;
    let username = req.body.username;
   
    let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    db.query(usernameQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length > 0) {
            message = 'Username already exists';
            res.render('add-player.ejs', {
                message,
                title: "Welcome to Socka | Add a new player"
            });
        } else {
            // check the filetype before uploading it
         
                    let query = "INSERT INTO `players` (first_name, last_name, position, number, user_name) VALUES ('" +
                        first_name + "', '" + last_name + "', '" + position + "', '" + number + "',  '" + username + "')";
                    console.log(query);
                        db.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/home');
                    });
        }
    });
};
exports.editLeadPage= function(req, res){
    let playerId = req.params.id;
    let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('edit-player.ejs', {
            title: "Edit Lead"
            ,player: result[0]
            ,message: ''
        });
    });
},
exports.editLead=function(req, res){
    let playerId = req.params.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;

    let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/home');
    });
};
exports.deleteLead= function (req, res){
    mysql=require("mysql");
    let playerId = req.params.id;
    let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
        db.query(deleteUserQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/home');
            });
    
  
}
exports.getBackPage=function (req, res) {
    res.render('login.ejs', {
        title: "Welcome to Crm Application"
        ,message: ''
    });
};