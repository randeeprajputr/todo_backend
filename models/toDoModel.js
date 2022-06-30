const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
        title: {
            type: String,
        },
        description: {
            type: String
        },
        time: {
            type: String,
        },
        date: {
            type: String,
        }
    },{
        timestamps: true
    }
)

module.exports = mongoose.model("ToDo", todoSchema)