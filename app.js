const { Client } = require('pg')
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
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//Employee
app.get('/employee', async function (req, res) {
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
//Employee pillar por id
app.get('/employee/:id', async function (req, res) {
    const id = req.params.id;
    try {
        let db = await getDbConnection();
        const query = await db.query("SELECT e1.employee_id, e1.last_name, e1.first_name, e1.title, e1.reports_to, e1.birth_date, e1.hire_date, e1.address, e1.city, e1.state, e1.country, e1.postal_code, e1.phone, e1.fax, e1.email FROM employee e1 LEFT JOIN employee e2 ON e1.reports_to = e2.employee_id WHERE e1.employee_id = $1;", [id]);
        res.json(query.rows);
        await db.end();
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Employee añadir
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
        const query = await db.query("INSERT INTO employee(employee_id, last_name, first_name, title, reports_to, birth_date, hire_date, address, city, state, country, postal_code, phone, fax, email) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", [id, lastName, firstName, title, reports_to, birth_date, hire_date, address, city, state, country, postal_code, phone, fax, email]);
        res.json({ message: 'Employee added successfully' })
        await db.end();
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
//Employee borrar mediante id
app.delete('/employee/:id', async function (req, res) {
    const { id } = req.params;
    try {
        let db = await getDbConnection();
        const query = await db.query("DELETE FROM employee where employee_id = $1", [id]);
        res.json(query.rows);
        await db.end();
    } catch (error) {
        console.error('Error delete employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//Employee editar por id
app.put('/employee/:id', async function (req, res) {
    const id = req.params.id;
    try {
        let db = await getDbConnection();
        const {
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
        const query = await db.query("UPDATE employee SET last_name = $1, first_name = $2, title = $3, reports_to = $4, birth_date = $5, hire_date = $6, address = $7, city = $8, state = $9, country = $10, postal_code = $11, phone = $12, fax = $13, email = $14 WHERE employee_id = $15", [lastName, firstName, title, reports_to, birth_date, hire_date, address, city, state, country, postal_code, phone, fax, email, id]);
        res.json({ message: 'Employee updated successfully' });
        await db.end();
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//track
app.get('/track', async function (req, res) {
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


//ADD
app.post("/track", async function (req, res) {
    try {
        let db = await getDbConnection();
        const {
            id,
            name,
            album,
            media,
            genre,
            composer,
            milliseconds,
            byte,
            unite_price
        } = req.body;
        const query = await db.query("INSERT INTO track(track_id, name, album_id, media_type_id, genre_id, composer, milliseconds, bytes, unit_price) values($1, $2, $3, $4, $5, $6, $7, $8, $9)", [id, name, album, media, genre, composer, milliseconds, byte, unite_price]);
        res.json({ message: 'Track added successfully' })
        await db.end();
    } catch (error) {
        console.error('Error adding track:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//EDIT
app.get('/track/:track_id', async function (req, res) {
    let track_id = parseInt(req.params.track_id)
    let db = await getDbConnection()
    const query = await db.query('SELECT track.track_id, track.name, album.title as album, media_type.name as media, genre.name as genre, track.composer, track.milliseconds, track.bytes, track.unit_price FROM track INNER JOIN album ON track.album_id = album.album_id INNER JOIN media_type ON track.media_type_id = media_type.media_type_id INNER JOIN genre ON track.genre_id = genre.genre_id where track.track_id = $1;', [track_id])
    res.json(query.rows)
    await db.end()
})

//Album
app.get('/album', async function (req, res) {
    try {
        let db = await getDbConnection();
        const query = await db.query("SELECT album.album_id, album.title, album.artist_id FROM album");
        res.json(query.rows);
        await db.end();
    } catch (error) {
        console.error('Error fetching album:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//media_type
app.get('/media_type', async function (req, res) {
    try {
        let db = await getDbConnection();
        const query = await db.query("SELECT media_type.media_type_id, media_type.name FROM media_type");
        res.json(query.rows);
        await db.end();
    } catch (error) {
        console.error('Error fetching media_type:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//genre
app.get('/genre', async function (req, res) {
    try {
        let db = await getDbConnection();
        const query = await db.query("SELECT genre.genre_id, genre.name FROM genre");
        res.json(query.rows);
        await db.end();
    } catch (error) {
        console.error('Error fetching genre:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//invoice
app.get('/invoice', async function (req, res) {
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


app.listen(3000, function () {
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