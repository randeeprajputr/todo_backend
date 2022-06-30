const ToDo = require('../models/toDoModel')
const mongoose = require('mongoose');

const todoController = {

    //Create Todo

    createTodo: async (req, res) => {
        try {
            const {title, description, time, date} = req.body

            const newToDo = new ToDo({
                title: title,
                description: description,
                time: time,
                date: date
            });
            await newToDo.save()
            res.status(200).send({message: "Todo Succesfully created!", todo: newToDo})
        } catch (err) {
            res.status(400).send({message: err.message})
        }
    },

    //Get Todo

    getTodo: async (req, res) => {
        try {
            const {page, count} = req.body
            const todos = await ToDo.find()
                .skip((page - 1) * count)
                .limit(count)
                .sort({createdAt: -1})
                .exec()
            res.status(200).send({todos})
        } catch (err) {
            res.status(400).send({message: err.message})
        }
    },

    //Get Todo By Id

    getTodoById: async (req, res) => {
        try {
            const {todoId}=req.params
            const todo = await ToDo.findById({_id: mongoose.Types.ObjectId(todoId)}).exec()
            res.status(200).send({todo})
        } catch (err) {
            res.status(400).send({message: err.message})
        }
    },

    //Update Todo

    updateToDo: async (req, res) => {
        try {
            const {todoId,title,description,time,date} = req.body
            const updateTodo = await ToDo.update({_id: mongoose.Types.ObjectId(todoId)},
                {title:title,description:description,time:time,date:date}).exec()
            res.status(200).send({updateTodo})
        } catch (err) {
            res.status(400).send({message: err.message})
        }
    },

    //Delete Todo By Id

    deleteTodo: async (req, res) => {
        try {
            const {todoId} = req.params
            const deletedTodo = await ToDo.deleteOne({_id: mongoose.Types.ObjectId(todoId)}).exec();
            res.status(200).send({message: deletedTodo})
        } catch (err) {
            res.status(400).send({message: err.message})
        }
    },

    // Search Todo

    searchTodo: async (req, res) => {
        try {
            const date=req.params.date
            const result = await ToDo.find({
                "$and": [
                    {"date": {$regex: date}}]
            })
            res.status(200).send({result})
        } catch (err) {
            res.status(400).send({message: err.message})
        }
    },

}

module.exports = todoController