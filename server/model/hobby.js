const mongoose = require("mongoose")
const MSchema = mongoose.Schema

// mongoose.set('keyFindAndModify', false) // es una llave keyFindAndModify

const  hobbySchema = new MSchema({
    title: String,
    description: String,
    userId: String,
})

module.exports = mongoose.model("Hobby", hobbySchema)