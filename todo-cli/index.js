const { program } = require("commander");
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
        todos.push({ todo: todo });
        fs.writeFileSync(file, JSON.stringify(todos, null, 2));
        console.log("Todo added.");
    });


program.parse(process.argv);