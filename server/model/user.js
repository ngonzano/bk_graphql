const mongoose = require("mongoose")
const MSchema = mongoose.Schema

// mongoose.set('keyFindAndModify', false) // es una llave keyFindAndModify

const  userSchema = MSchema({
    name: String,
    age: Number,
    profession: String,
})

module.exports = mongoose.model("User", userSchema)