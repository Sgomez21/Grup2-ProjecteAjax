const {Client} = require('pg')
const express = require('express')
const fs = require("fs")
const app = express()
app.use(express.json())
app.use('/', express.static('public'))

async function getDbConnection() {
    const data_connection = JSON.parse(fs.readFileSync('db_config.json'))

    const client = new Client(data_connection)
    await client.connect()
    return client;
}
//Index
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//Employee
app.get('/employee', async function(req, res) {
    try {
        let db = await getDbConnection();
        const query = await db.query('SELECT * FROM employee;');
        res.json(query.rows);
        await db.end();
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//track
app.get('/track', async function(req, res) {
    try {
        let db = await getDbConnection();
        const query = await db.query('SELECT * FROM track;');
        res.json(query.rows);
        await db.end();
    } catch (error) {
        console.error('Error fetching track:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(3000, function() {
    console.log("Listening on http://localhost:3000");
});




// app.get('/', function (req, res) {
//     res.send('Hello World')
// })
/*
app.get('/user', function (req, res) {
    res.json({
        firstname: 'Jaimito',
        lastname: "De los Palotes"
    })
})


app.get('/clients', async function (req, res) {
    let db = await getDbConnection()
    const query = await db.query('Select * from clientes;')
    res.json(query.rows)
    await db.end()
})

app.get('/clients/:codCli', async function (req, res) {
    let codCli = parseInt(req.params.codCli)
    let db = await getDbConnection()
    const query = await db.query('Select * from clientes where codCli = $1;', [codCli])
    res.json(query.rows)
    await db.end()
})



app.post("/clients", async function(req, res){
    let data = req.body
    res.json('ok')
    
})

app.put("/clients/:codCli", async function(req, res){
    let data = req.body
    console.log(data)
    res.json('ok')
})
*/