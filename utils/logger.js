/** 
* Disable logging if mode = test mode
*/
const info = (...params) => {
    if(process.env.NODE_ENV !== 'test'){
        console.log(...params)
    }
}

/** 
* Displays error logging and will print in test mode. 
*/
const error = (...params) => {
    console.log(...params)
}

module.exports = {
    info,error
}