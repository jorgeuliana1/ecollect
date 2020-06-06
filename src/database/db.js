const sqlite = require("sqlite3").verbose()
const db = new sqlite.Database("src/database/database.db")

module.exports = db