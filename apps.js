const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const { name } = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pertemuan5",
});

connection.connect((err) => {
    if(err){
        console.error("terjadi kesalahan pada koneksi database", err.stack);
        return;
    } 
    console.log("terhubung ke database"+connection.threadId);   
})

app.set('view engine', 'ejs');

//routing(CRUD)


//read 
app.get("/", (req, res) =>{
    const query = "SELECT * FROM user"
    connection.query(query,(err, result) => {
        res.render("index", {user: result});
    });
    
    
});
//create
app.get('/create', (req, res) => {
    res.render('create');
});
app.post('/create', (req, res) => {
    const {name, email, phone} = req.body;
    const query = 'insert into user (name, email, phone) values (?, ?, ?)';
    connection.query(query, [name, email, phone], (err, result) => {
        if(err) throw err;
        res.redirect('/');
    })
});


//update
app.get('/edit/:id', (req, res)=>{
    const query = "SELECT * FROM user where id = ?";
    connection.query(query, [req.params.id],(err, result) => {
        if(err) throw err;
        res.render('edit', {user: result[0]});
    });
})

app.post ('/update/:id', (req, res)=>{
    const {name, email, phone} = req.body;
    const query = 'UPDATE user SET name = ?, email = ?, phone = ? where id = ?';
    connection.query(query, [name, email, phone, req.params.id],  (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
})


//hapus
app.get('/delete/:id', (req, res)=>{
    const query = "DELETE FROM user where id = ?";
    connection.query(query, [req.params.id],(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
})






app.listen(3000, () => {
    console.log(`server berjalan di http://localhost:3000`);
});


