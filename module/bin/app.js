#!/usr/bin/env node

const http = require('http')
const watch = require("node-watch");
const cors = require('http-cors')

let path = '.'
if (process.argv[2] && !process.argv[2].startsWith('-'))
    path = process.argv[2]

// noinspection JSUnresolvedFunction
const argv = require('yargs')
    .command(' [path] [options]', '', (yargs) => {
        yargs
            .positional('path', {
                describe: 'File/directory to watch and trigger reload',
                default: '.'
            })
    })
    .option('port', {alias: 'p', type: 'number', description: "Port number to use"})
    .option('delay', {alias: 'd', type: 'number', description: "Delay to reload in ms. Useful in-case backend server takes some time to restart"})
    .argv

let changes = []
changes.push({
    event: 'init',
    filename: '.',
    timestamp: Date.now()
})

watch(path, {recursive: true}, (event, filename) => {
    let timestamp = Date.now();
    if (Math.abs(changes[changes.length - 1].timestamp - timestamp) > 99) {
        if(argv.delay && argv.delay > 0)
            setTimeout(()=>{
                changes.push({event, filename, timestamp})
            }, argv.delay)
        else
            changes.push({event, filename, timestamp})
        console.log(event, filename, timestamp)
    }
})

const defaultPort = 12589
let port = argv.port || defaultPort

http.createServer((req, res) => {
    if (cors(req, res)) return // Allow CORS requests

    res.end(JSON.stringify(changes))
}).listen(port, () => {
    console.log("Watching for filechanges...\nMake sure the chrome extension is active and using port %s\n(Press ctrl+C to stop)", port)
}).on('error', err => {
    if (err.toString().includes('EADDRINUSE')) {
        if (port === defaultPort)
            console.log("Default port %s already in use, please provide another available port using --port argument", port)
        else
            console.log("Port %s already in use!", port)
        process.exit()
    }
})