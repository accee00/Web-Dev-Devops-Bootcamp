const { program } = require("commander");
const fs = require("fs");

program
    .name("counter")
    .description("CLI to do file based task.")
    .version("0.9.9");

program
    .command("count-words")
    .description("Count the number of words in a file.")
    .argument("<file>", "file to count")
    .action((file) => {
        fs.readFile(file, "utf-8", (error, data) => {
            if (error) {
                console.log(error);
                return;
            }
            const words = data.split(" ");
            let count = 0;

            words.forEach(word => {
                if (word.trim() !== "") {
                    count++;
                }
            });
            console.log(`There are ${count} words in ${file}`);
        });
    });


program
    .command("count-lines")
    .description("Count the no of lines in a file.")
    .argument("<file>", "file to count no of lines")
    .action((file) => {
        fs.readFile(file, "utf-8", (error, data) => {
            if (error) {
                console.log(error);
                return;
            }
            const words = data.split("\n");
            let count = 0;

            words.forEach(word => {
                if (word.trim() !== "") {
                    count++;
                }
            });
            console.log(`There are ${count} lines in ${file}`);
        });
    });

program
    .command("count-vowels")
    .description("Count the no of vowels in a file.")
    .argument("<file>", "file to check for vowels")
    .action((file) => {
        fs.readFile(file, "utf-8", (error, data) => {
            if (error) {
                console.log(error);
                return;
            }

            let count = 0;

            for (const char of data.toLowerCase()) {
                if (
                    char === "a" ||
                    char === "e" ||
                    char === "i" ||
                    char === "o" ||
                    char === "u"
                ) {
                    count++;
                }
            }

            console.log(`There are ${count} vowels in ${file}`);
        });
    });

program.parse(process.argv);