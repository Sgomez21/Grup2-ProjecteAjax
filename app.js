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

app.post("/employee", async function (req, res) {
    try {
        let db = await getDbConnection();
        const {
            id,
            lastName,
            firstName,
            title,
            reports_to,
            birth_date,
            hire_date,
            address,
            city,
            state,
            country,
            postal_code,
            phone,
            fax,
            email
        } = req.body;
        const query = await db.query("INSERT INTO employee(employee_id, last_name, first_name, title, reports_to, birth_date, hire_date, address, city, state, country, postal_code, phone, fax, email) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", [id,lastName, firstName, title, reports_to, birth_date, hire_date, address, city, state, country, postal_code, phone, fax, email]);
        res.json({message: 'Employee added successfully'})
        await db.end();
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
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
/*
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