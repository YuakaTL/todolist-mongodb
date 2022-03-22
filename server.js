const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Todo = require('./models/todolist');
const { errorHandle, successHandle } = require('./base/responseHandler');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB)
    .then(() => console.log('資料庫連接成功'));

const requestListener = async (req, res) => {

    let body = "";
    req.on('data', chunk => {
        body += chunk;
    })

    if (req.url == "/todos" && req.method == "GET") {
        const data = await Todo.find();
        successHandle(res, data);
    } else if (req.url == "/todos" && req.method == "POST") {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                if (data.title !== undefined) {
                    const newTodo = await Todo.create(
                        {
                            title: data.title,
                        }
                    );
                    successHandle(res, newTodo);
                } else {
                    errorHandle(res, 400, 40002);
                }
            } catch (error) {
                errorHandle(res, 400, 40001);
            }
        })
    } else if (req.url == "/todos" && req.method == "DELETE") {
        const data = await Todo.deleteMany({});
        successHandle(res, data);
    } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
        const id = req.url.split('/').pop();
        async function deleteTodo(id) {
            try {
                const result = await Todo.findByIdAndDelete(id);
                if (result === null) errorHandle(res, 400, 40003);
                else successHandle(res, result);
            } catch (err) {
                errorHandle(res, 400, 40003);
            }
        }
        if (id) {
            deleteTodo(id);
        } else {
            errorHandle(res, 400, 40001);
        }
    } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const id = req.url.split('/').pop();
                if (data.title !== undefined) {
                    const editTitle = {
                        title: data.title,
                    };
                    const editTodo = await Todo.findByIdAndUpdate(id, editTitle);
                    if (editTodo === null) errorHandle(res, 400, 40003);
                    else successHandle(res, editTodo);
                } else {
                    errorHandle(res, 400, 40003);
                }
            } catch (error) {
                errorHandle(res, 400, 40001);
            }
        })
    } else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        errorHandle(res, 404);
    }
}
const server = http.createServer(requestListener);
server.listen(process.env.PORT);