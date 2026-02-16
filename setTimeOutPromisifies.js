

function setTimeOutPromisified(ms) {
    return new Promise((resolve, _) => {
        setTimeout(resolve, ms)
    })
}

setTimeOutPromisified(1000).then(() => console.log("promisfied set Timeout"))
setTimeOutPromisified(2000).then(() => console.log("promisfied after 2 sec"))