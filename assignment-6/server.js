const net = require("net")
const crypto = require("crypto")
const SEVEN_BIT_INTEGER_MARKER = 125
const connections = []
let clientID = 0

const wsServer = net.createServer(
    (connection) => {
        console.log('\nClient connected')
        connections.push({
            connection: connection,
            clientID: clientID
        })
        clientID++
        connection.on('data', (data) => {
            if (data.toString().includes("Sec-WebSocket-Key:")){
                const id = connections.find(obj => obj.connection == connection).clientID
                const header = onSocketConnecting(data)
                connection.write(header)
                
                const clientID = prepareMessage(id.toString())
                connection.write(clientID)
                connections.push(connection)
            } else {
                const message = onSocketRead(data)
                try{
                    JSON.parse(message);
                    const messageToClient = prepareMessage(message)
                    for (let i = 0; i < connections.length; i++){
                        const con = connections[i].connection
                        if (con !== connection){
                            con.write(messageToClient)
                        }
                    }
                } catch (error){
                    //When JSON can't parse the message, it means the client has disconnected.
                    connections.splice(connections.indexOf(connection), 1)
                }
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

function onSocketConnecting(data){
    const dataString = data.toString()
    const keyIndex = dataString.indexOf("Sec-WebSocket-Key: ")
    const endOfLineIndex = dataString.indexOf("\r\n", keyIndex)
    const key = dataString.substring(keyIndex + "Sec-WebSocket-Key: ".length, endOfLineIndex)
    
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
        ''
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
    let maskOffset
    if (payloadLength <= SEVEN_BIT_INTEGER_MARKER){
        maskOffset = 2
    } else {
        throw new Error("Message too long!")
    }
    //The masking key consists of 4 bytes, and is located immediately after the payload length byte in the WebSocket frame header.
    //2 is the index of the first byte of the mask
    const maskLength = 4
    const maskKey = getMaskKey(bytes, maskOffset, maskLength)
    const encodedMessage = getEncodedMessage(bytes, maskOffset, maskLength)
    const decodedMessage = unmaskData(encodedMessage, maskKey)
    return decodedMessage
}
function getMaskKey(bytes, maskStartValue, maskLength){
    let mask = []
    for (let i = maskStartValue; i < (maskStartValue + maskLength); i++){
        mask[i-maskStartValue] = bytes[i]
    }
    return mask
}

function getEncodedMessage(bytes, maskStartValue, maskLength){
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

function prepareMessage(message){
    const msg = Buffer.from(message)
    const msgSize = msg.length

    let dataFrameBuffer
    const firstByte = 0x80 | 0x01

    if (msgSize <= SEVEN_BIT_INTEGER_MARKER){
        const bytes = [firstByte]
        dataFrameBuffer = Buffer.from(bytes.concat(msgSize))
    } else {
        throw new Error("Message too long.")
    }

    const totalLength = dataFrameBuffer.byteLength + msgSize
    const dataFrameResponse = Buffer.allocUnsafe(totalLength)
    let offset = 0
    
    for (const buffer of [dataFrameBuffer, msg]){
        dataFrameResponse.set(buffer, offset)
        offset += buffer.length
    }
    return dataFrameResponse
}