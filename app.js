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
        const query = await db.query("SELECT e1.employee_id, e1.last_name, e1.first_name, e1.title, CONCAT(e2.last_name, ' ',e2.first_name ) AS reports_to, e1.birth_date, e1.hire_date, e1.address, e1.city, e1.state, e1.country, e1.postal_code, e1.phone, e1.fax, e1.email FROM employee e1 LEFT JOIN employee e2 ON e1.reports_to = e2.employee_id;;");
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
        const query = await db.query("SELECT track.track_id, track.name, album.title as album, media_type.name as media, genre.name as genre, track.composer, track.milliseconds, track.bytes, track.unit_price FROM track INNER JOIN album ON track.album_id = album.album_id INNER JOIN media_type ON track.media_type_id = media_type.media_type_id INNER JOIN genre ON track.genre_id = genre.genre_id;");
        res.json(query.rows);
        await db.end();
    } catch (error) {
        console.error('Error fetching track:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//invoice
app.get('/invoice', async function(req, res) {
    try {
        let db = await getDbConnection();
        const query = await db.query('SELECT * FROM invoice;');
        res.json(query.rows);
        await db.end();
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, function() {
    console.log("Listening on http://localhost:3000");
});

//------------------------- Editar ----------------------------------

app.get('/track/:track_id', async function (req, res) {
    let track_id = parseInt(req.params.track_id)
    let db = await getDbConnection()
    const query = await db.query('SELECT track.track_id, track.name, album.title as album, media_type.name as media, genre.name as genre, track.composer, track.milliseconds, track.bytes, track.unit_price FROM track INNER JOIN album ON track.album_id = album.album_id INNER JOIN media_type ON track.media_type_id = media_type.media_type_id INNER JOIN genre ON track.genre_id = genre.genre_id where track.track_id = $1;', [track_id])
    res.json(query.rows)
    await db.end()
})


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