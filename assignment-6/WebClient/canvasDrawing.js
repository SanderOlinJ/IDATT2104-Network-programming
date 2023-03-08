const ws = new WebSocket("ws://localhost:3027")
ws.onopen = (event) => {
    console.log("WebSocket is connected")
}
ws.onmessage = (event) => {
    console.log(event.data)
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

const drawAndSend = (event) => {
    if(isDrawing) {
        drawLine(event.clientX, event.clientY)
        ws.send(JSON.stringify({
            x: event.clientX,
            y: event.clientY
        }))
    }
}

function receiveMessage(message) {
    drawLine(message.x, message.y)
    ctx.beginPath()
}

function drawLine(x, y){
    ctx.lineWidth = lineWidth
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

