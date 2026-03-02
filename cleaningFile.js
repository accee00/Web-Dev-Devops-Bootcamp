const { rejects } = require("assert");
const { error } = require("console");
const fs = require("fs");
const { resolve } = require("path");

/// Callback based Sync function call.
// function cleanFile(filePath) {
//     const data = fs.readFileSync(filePath, "utf-8");

//     const cleanedData = data.trim();

//     fs.writeFileSync(filePath, cleanedData);

//     console.log("Write done.");
// }

// cleanFile("a.txt")


/// Callback based async function call.
// function cleanFile(filePath, cb) {
//     fs.readFile(filePath, "utf-8", (error, data) => {
//         if (error) {
//             console.log(`Error while reading file: ${error}`)
//         } else {
//             const cleanedData = data.trim()
//             fs.writeFile(filePath, cleanedData, function () {
//                 cb()
//             })
//         }
//     })
// }

// cleanFile("a.txt", () => {
//     console.log("Done cleaning file.")
// })

///Promise based no async await
// function cleanFile(filePath) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(filePath, "utf-8", (error, data) => {
//             if (error) {
//                 reject()
//             } else {
//                 const cleanedData = data.trim()
//                 fs.writeFile(filePath, cleanedData, (error) => {
//                     if (error) {
//                         reject()
//                     } else {
//                         resolve()
//                     }
//                 })
//             }
//         })
//     })
// }

// cleanFile("a.txt")
//     .then(() => {
//         console.log("Done cleaning file.")
//     })
//     .catch((error) => {
//         console.log(`Error while reading file: ${error}.`)
//     })
//     .finally(() => {
//         console.log("Done with either error or success.")
//     })

/// Promise based does use async await.
function cleanFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (error, data) => {
            if (error) {
                reject()
            } else {
                const cleanedData = data.trim()
                fs.writeFile(filePath, cleanedData, (error) => {
                    if (error) {
                        reject()
                    } else {
                        resolve()
                    }
                })
            }
        })
    })
}

// async function main() {
//     try {
//         await cleanFile("a.txt")
//         console.log("Done cleaning file.")
//     } catch (error) {
//         console.log(`Error while reading file: ${error}.`)
//     }
// }

// main()

// function cleanManyFiles(prefix) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             await cleanFile(prefix + "1.txt")
//             await cleanFile(prefix + "2.txt")
//             await cleanFile(prefix + "3.txt")
//             resolve()
//         } catch (error) {
//             reject()
//         }
//     })
// }

async function cleanManyFiles(prefix) {

    await cleanFile(prefix + "1.txt")
    await cleanFile(prefix + "2.txt")
    await cleanFile(prefix + "3.txt")
    resolve()

}
cleanManyFiles("a")
    .then(() => {
        console.log("all files cleared")
    })
    .catch((error) => {
        console.log(`error while cleaning 3 files: ${error}`);
    })