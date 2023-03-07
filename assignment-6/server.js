const net = require("net")
const crypto = require("crypto")

const wsServer = net.createServer(
    (connection) => {
        console.log('\nClient connected')
        connection.on('data', (data) => {
            if (data.toString().includes("Sec-WebSocket-Key:")){
                connection.write(onSocketUpgrade(data));
            }
        })
        connection.on('end', () => {
            console.log('Client disconnected')
        })
    }
)
wsServer.on('error', (error) => {
    console.log('Error: ', error)
})

wsServer.listen(3027, () => {
    console.log('WebSocket server listening on port 3027')
})

function onSocketUpgrade(data){
    const dataString = data.toString()
    const keyIndex = dataString.indexOf("Sec-WebSocket-Key: ");
    const endOfLineIndex = dataString.indexOf("\r\n", keyIndex);
    const key = dataString.substring(keyIndex + "Sec-WebSocket-Key: ".length, endOfLineIndex);
    
    console.log(`${key} connected`)
    const headers = createHandShakeHeaders(key)
    return headers
}

function createHandShakeHeaders(data){
    const acceptKey = createSocketAccept(data)
    const acceptHeader= [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${acceptKey}`,
        ""
    ].map(line => line.concat("\r\n")).join("")
    return acceptHeader
}

function createSocketAccept(key){
    let GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
    return crypto.createHash("sha1").update(key + GUID).digest("base64")
}