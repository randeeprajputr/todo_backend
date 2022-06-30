const router=require('express').Router()
const todoController=require("../controllers/todoController")
const auth = require('../middlewares/auth')

router.post('/create-todo',auth,todoController.createTodo)
router.post('/get-todo',auth,todoController.getTodo)
router.get('/get-todo-by-id/:todoId',auth,todoController.getTodoById)
router.patch('/update-todo',auth,todoController.updateToDo)
router.delete('/delete-todo-by-id/:todoId',auth,todoController.deleteTodo)
router.get('/search-todo/:date',auth,todoController.searchTodo);
module.exports=router