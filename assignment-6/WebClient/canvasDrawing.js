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
            clear: true
        }))
    }
})

const drawAndSend = (event) => {
    if(isDrawing) {
        let newX
        let newY
        if(packetEnd) {
            newX = lastX
            newY = lastY
        } else {
            newX = event.clientX
            newY = event.clientY
        }
        ctx.strokeStyle = colorPicker.value
        ctx.lineWidth = lineWidthPicker.value
        drawLine(lastX, lastY, newX, newY)
        ws.send(JSON.stringify({
            clientID: clientID,
            packetEnd: packetEnd,
            x: newX,
            y: newY,
            color: colorPicker.value,
            lineWidth: lineWidthPicker.value,
            clear: false
        }))
    }
}

function receiveMessage(message) {
    if (message.clear){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
    }
    let object = {
        clientID: message.clientID,
        x: message.x,
        y: message.y,
        packetEnd: message.packetEnd
    }
    
    let startX
    let startY
    let client 
    let index

    if (!(clients.find(client => client.clientID == message.clientID))){
        clients.push(object)
        ctx.strokeStyle = message.color
        ctx.lineWidth = message.lineWidth
        drawLine(message.x, message.y, message.x, message.y)
        ctx.beginPath()
        return
    }
    client = clients.find(client => client.clientID == message.clientID)
    index = clients.indexOf(client)
    if (client.packetEnd){
        clients[index] = object
        client = object
    }
    startX = client.x
    startY = client.y
    ctx.strokeStyle = message.color
    ctx.lineWidth = message.lineWidth
    drawLine(startX, startY, message.x, message.y)
    clients[index] = object
    ctx.beginPath()
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
    packetEnd = false
})

canvas.addEventListener('mouseup', () => {
    packetEnd = true
    drawAndSend()
    isDrawing = false
    lastX = null
    lastY = null
    ctx.beginPath()
})

canvas.addEventListener('mousemove', drawAndSend)
