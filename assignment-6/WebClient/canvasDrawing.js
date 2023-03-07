const ws = new WebSocket("ws://localhost:3027")
ws.onopen = (event) => {
    console.log("WebSocket is connected")
}
ws.onmessage = (event) => {
    var message = JSON.parse(event.data)
    receiveMessage(message)
}
ws.onerror = (event) => console.log("WebSocket Error", event)
ws.onclose = console.log("Disconnected from WebSocket server")

const canvas = document.getElementById("drawing-board")
const toolbar = document.getElementById("toolbar")
const ctx = canvas.getContext("2d")

const canvasOffsetX = canvas.offsetLeft
const canvasOffsetY = canvas.offsetTop

canvas.width = window.innerWidth - canvasOffsetX
canvas.height = window.innerHeight - canvasOffsetY

let isDrawing = false
let lineWidth = 10
let lastX = null
let lastY = null


toolbar.addEventListener('click', event => {
    if (event.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
})

toolbar.addEventListener('change', event => {
    if(event.target.id === 'stroke') {
        ctx.strokeStyle = event.target.value
    }

    if(event.target.id === 'lineWidth') {
        lineWidth = event.target.value
    }
    
})

const sendMessage = (event) => {
    if(isDrawing) {
        ws.send(JSON.stringify({
            x: event.clientX,
            y: event.clientY
        }))
    }
}

function receiveMessage(message) {
    if (lastX !== null && lastY !== null){
        drawLine(lastX, lastY, message.x, message.y)
    }
    if (isDrawing){
        lastX = message.x
        lastY = message.y
    }
}

function drawLine(startX, startY, nextX, nextY){
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(startX - (canvasOffsetX-20), startY - canvasOffsetY)
    ctx.lineTo(nextX - (canvasOffsetX-20), nextY - canvasOffsetY)
    ctx.stroke()
}

canvas.addEventListener('mousedown', () => {
    isDrawing = true
})

canvas.addEventListener('mouseup', () => {
    isDrawing = false
    lastX = null
    lastY = null
})

canvas.addEventListener('mousemove', sendMessage)

