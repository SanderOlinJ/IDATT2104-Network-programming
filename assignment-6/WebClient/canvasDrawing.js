const ws = new WebSocket("ws://localhost:3027")
ws.onopen = () => {
    console.log("WebSocket is connected")
}
ws.onmessage = (event) => {
    console.log(event.data)
    let message = JSON.parse(event.data)
    receiveMessage(message)
}
ws.onerror = (event) => console.log("WebSocket Error", event)
ws.onclose = console.log("Disconnected from WebSocket server")

const canvas = document.getElementById("drawing-board")
const toolbar = document.getElementById("toolbar")
let colorPicker = document.getElementById("stroke")
let lineWidthPicker = document.getElementById("lineWidth")
const ctx = canvas.getContext("2d")
let isDrawing = false

const canvasOffsetX = canvas.offsetLeft
const canvasOffsetY = canvas.offsetTop

canvas.width = window.innerWidth - canvasOffsetX
canvas.height = window.innerHeight - canvasOffsetY

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
            x: event.clientX,
            y: event.clientY,
            color: colorPicker.value,
            lineWidth: lineWidthPicker.value,
            clear: false
        }))
    }
}

//TODO: Implement a way to draw complete lines, while receiving messages,
//      while the lines don't jump around randomly.

function receiveMessage(message) {
    if (message.clear){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    ctx.strokeStyle = message.color
    ctx.lineWidth = message.lineWidth
    drawLine(message.x, message.y)
    ctx.beginPath()
}

function drawLine(x, y){
    ctx.lineCap = 'round'
    ctx.lineTo(x - canvasOffsetX, y)
    ctx.stroke()
}

canvas.addEventListener('mousedown', () => {
    isDrawing = true
})

canvas.addEventListener('mouseup', () => {
    isDrawing = false
    ctx.beginPath()
})

canvas.addEventListener('mousemove', drawAndSend)

