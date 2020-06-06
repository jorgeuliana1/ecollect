const express = require("express")
const server = express()
const db = require("./database/db")

// Setting up the public folder
server.use(express.static("public"))
server.use(express.urlencoded({ extended: true }))

// Using template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,    
    noCache : false
})


// Setting up the application's paths
// Home page
server.get("/", (req, res) => {
    res.render("search.html")
})

// Point creation page
server.get("/create-point", (req, res) => {
    return res.render("create-point.html", { created: false, error: false })
})

server.post("/savepoint", (req, res) => {
    console.log(req.body)

    // Inserting data at database
    const query = 
    `
    INSERT INTO places(
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            return res.render("create-point.html", { created: false, error: true })
        }

        console.log("Data successfully registered")
        console.log(this)

        return res.render("create-point.html", { created: true, error: false })
    }

    db.run(query, values, afterInsertData)

})

// Search results page
server.get("/search", (req, res) => {

    const search = req.query.search

    if (search == "") {
        // Empty search
        return res.render("search-results.html", { places: [], total: 0 })
    }

    db.all(`SELECT * FROM places WHERE city LIKE '${search}'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length
        return res.render("search-results.html", { places: rows, total: total })
    })

    
})

// Turn the server on
server.listen(3000)