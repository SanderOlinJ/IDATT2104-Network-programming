const canvas = document.getElementById("drawing-board")
const toolbar = document.getElementById("toolbar")
let colorPicker = document.getElementById("stroke")
let lineWidthPicker = document.getElementById("lineWidth")
const ctx = canvas.getContext("2d")
let isDrawing = false
let clientID
let lastX = null
let lastY = null
let packetEnd = false
const clients = []
const canvasOffsetX = canvas.offsetLeft - 20
const canvasOffsetY = canvas.offsetTop - 20
canvas.width = window.innerWidth - canvasOffsetX
canvas.height = window.innerHeight - canvasOffsetY

const ws = new WebSocket("ws://localhost:3027")
ws.onopen = () => {
    /*
    const dataString = event.data
    const idIndex = dataString.indexOf("ClientID: ");
    const endOfLineIndex = dataString.indexOf("\r\n", idIndex);
    const id = dataString.substring(idIndex + "ClientID: ".length, endOfLineIndex);
    console.log(`Received clientID: ${id}`);
    console.log(id)
    */
    console.log("WebSocket is connected")
}

ws.onmessage = (event) => {
    if (Number.isInteger(JSON.parse(event.data))){
        clientID = event.data
        return
    }
    let message = JSON.parse(event.data)
    receiveMessage(message)
}
ws.onerror = (event) => console.log("WebSocket Error", event)
ws.onclose = console.log("Disconnected from WebSocket server")

toolbar.addEventListener('click', event => {
    if (event.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ws.send(JSON.stringify({
            x: event.clientX,
            y: event.clientY,
            color: colorPicker.value,
            lineWidth: lineWidthPicker.value,
            clear: true
        }))
    }
})

const drawAndSend = (event) => {
    if(isDrawing) {
        ctx.strokeStyle = colorPicker.value
        ctx.lineWidth = lineWidthPicker.value
        drawLine(event.clientX, event.clientY)
        ws.send(JSON.stringify({
            clientID: clientID,
            packetEnd: packetEnd,
            x: event.clientX,
            y: event.clientY,
            color: colorPicker.value,
            lineWidth: lineWidthPicker.value,
            clear: false
        }))
    }
}

//TODO: Draw based on previous messages
// Continue drawing, from the last message of a Client

function receiveMessage(message) {
    let startX
    let startY
    let object = {
        clientID: message.clientID,
        x: message.x,
        y: message.y
    }
    let client 
    if (client = clients.find(client => client.clientID == message.clientID)){
        console.log("yo")
        let index = clients.indexOf(message)
        startX = client.x
        startY = client.y
        ctx.strokeStyle = message.color
        ctx.lineWidth = message.lineWidth
        drawLine(startX, startY, message.x, message.y)
        clients[index] = object
        ctx.beginPath()
    } else {
        clients.push(object)
    }
    if (message.clear){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
    }
}

function drawLine(startX, startY, x, y){
    ctx.lineCap = 'round'
    ctx.moveTo(startX - canvasOffsetX, startY)
    ctx.lineTo(x - canvasOffsetX, y)
    ctx.stroke()
    lastX = x
    lastY = y
}

canvas.addEventListener('mousedown', (event) => {
    isDrawing = true
    lastX = event.clientX
    lastY = event.clientY
    ctx.beginPath()
    packetEnd = false
})

canvas.addEventListener('mouseup', () => {
    isDrawing = false
    lastX = null
    lastY = null
    packetEnd = true
})

canvas.addEventListener('mousemove', drawAndSend)
