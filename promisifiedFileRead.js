
const fs = require("fs")

function fsPromisified(filePath, encoding) {
    return new Promise(
        (resolve, reject) => {
            fs.readFile(filePath, encoding, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data)
                }
            })
        }
    );
}
fsPromisified("a.txt", "utf-8").
    then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log(error);
    });