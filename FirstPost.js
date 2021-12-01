const mongoose = require("mongoose")

const FirstPost = mongoose.model("FirstPost",
    mongoose.Schema({
        content: String,
        image: String,
        link: String
    })
)

module.exports = FirstPost