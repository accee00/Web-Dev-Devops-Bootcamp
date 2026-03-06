const { program } = require("commander");
const { randomUUID } = require("crypto");
const fs = require("fs");


program
    .command("read-todo")
    .description("Read todos from json file.")
    .argument("<file>", "file to read todos from")
    .action((file) => {
        fs.readFile(file, "utf-8", (error, data) => {
            if (error) {
                console.log(error);
            }
            const jsonData = JSON.parse(data);
            console.log(jsonData);
        })
    });

program
    .command("update-todo")
    .description("Update todo requires id and content.")
    .argument("<file>", "json file")
    .argument("<id>", "todo id")
    .argument("<updated-todo>", "updated todo")
    .action((file, id, updatedTodo) => {
        let todos = [];
        const data = fs.readFileSync(file, "utf-8");
        if (data) {
            todos = JSON.parse(data);
        } else {
            console.log("No todo found");
            return;
        }
        todos.forEach(todo => {
            if (todo.id === id) {
                todo.todo = updatedTodo
            }
        });
        fs.writeFileSync(file, JSON.stringify(todos, null, 2));
        console.log("Todo updated.");
    });

program
    .command("add-todo")
    .description("Add todo to json file.")
    .argument("<file>", "json file")
    .argument("<todo>", "todo text")
    .action((file, todo) => {
        let todos = [];
        const data = fs.readFileSync(file, "utf-8");
        if (data) {
            todos = JSON.parse(data);
        }
        todos.push({ id: randomUUID(), todo: todo });
        fs.writeFileSync(file, JSON.stringify(todos, null, 2));
        console.log("Todo added.");
    });

program
    .command("delete-todo")
    .description("Update todo requires id and content.")
    .argument("<file>", "json file")
    .argument("<id>", "todo id")
    .action((file, id) => {
        let todos = [];
        const data = fs.readFileSync(file, "utf-8");
        if (data) {
            todos = JSON.parse(data);
        } else {
            console.log("No todo found");
            return;
        }
        todos = JSON.parse(data);
        const updatedTodos = todos.filter(todo => todo.id !== id);
        fs.writeFileSync(file, JSON.stringify(updatedTodos, null, 2));
        console.log("Todo removed.");
    });

program.parse(process.argv);