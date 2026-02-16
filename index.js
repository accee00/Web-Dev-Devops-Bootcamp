const fs = require("fs")

function fsReadFilePromisified(filePath, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, encoding, (error, data) => {
            if (error) {
                reject(error)
            } else {
                resolve(data);
            }
        });
    });
}

fsReadFilePromisified("dummy.txt", "utf-8")
    /// sab shi rha toh .then call hoga.
    .then((data) => console.log(data))
    /// aur by chance kuch hoga toh .catch call hoga..
    .catch((error) => console.log(error))
    .finally(() => console.log("Reading done."))


