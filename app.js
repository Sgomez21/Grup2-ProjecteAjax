const {Client} = require('pg')
const express = require('express')
const app = express()
app.use(express.json())
app.use('/', express.static('public'))

async function getDbConnection() {
    const data_connection = {
        host: '127.0.0.1',
        port: 5432,
        database: 'Facturas',
        user: 'postgres',
        password: 'nekygo'
    }

    const client = new Client(data_connection)
    await client.connect()
    return client;
}

// app.get('/', function (req, res) {
//     res.send('Hello World')
// })

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

app.listen(3000, 
    () => console.log("listeng in http://localhost:3000"))