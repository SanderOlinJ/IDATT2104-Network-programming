const net = require("net")
const crypto = require("crypto")

let connections = []
const wsServer = net.createServer(
    (connection) => {
        console.log('\nClient connected')
        connection.on('data', (data) => {
            if (data.toString().includes("Sec-WebSocket-Key:")){
                connection.write(onSocketUpgrade(data));
                connections.push(connection)
            } else {
                onSocketRead(data)
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

function onSocketRead(data){
    let bytes = data;
    const payloadLengthByte = bytes[1]
    //Extracts the payload length value from the second byte of the WebSocket frame header.
    //The first bit is a marker, which is always 1 in web socket protocol.
    const payloadLength = payloadLengthByte & 0x7f
    let messageLength = 0

    if (payloadLength <= 125){
        messageLength = payloadLength
        maskOffset = 2
    } else {
        throw new Error("Message too long!")
    }

    //The masking key consists of 4 bytes, and is located immediately after the payload length byte in the WebSocket frame header.
    //2 is the index of the first byte of the mask
    const maskStartValue = 2
    const maskLength = 4
    const maskKey = getMaskKey(bytes, maskStartValue, maskLength)
    const encodedMessage = getEncodedMessage(bytes, maskStartValue, maskLength, messageLength)
    const decodedMessage = unmaskData(encodedMessage, maskKey)
    console.log(decodedMessage.toString("utf-8"))
    console.log()
}
function getMaskKey(bytes, maskStartValue, maskLength){
    let mask = []
    for (let i = maskStartValue; i < (maskStartValue + maskLength); i++){
        mask[i-maskStartValue] = bytes[i]
    }
    return mask
}

function getEncodedMessage(bytes, maskStartValue, maskLength, messageLength){
    let encodedMessage = []
    let messageStartIndex = maskStartValue + maskLength
    let i = messageStartIndex
    while (i < bytes.length){
        encodedMessage[i-messageStartIndex] = bytes[i]
        i++
    }
    return encodedMessage
}

function unmaskData(encodedData, maskKey){
    let buffer = Buffer.from(encodedData)

    for (let i = 0; i < encodedData.length; i++){
        buffer[i] = (encodedData[i] ^ maskKey[i % 4])
    }
    return buffer
}