const ws = new WebSocket("ws://localhost:3027")
ws.onopen = (event) => {
    console.log("WebSocket is connected")
    const id = Math.round(Math.random() * 100)
    console.log("Sending...", id)
    const data = JSON.stringify({
        id,
        name: `${id} Sander Olin`,
        study: "Computer science"
    })
    ws.send(data)
}
ws.onmessage = (event) => console.log(event)
ws.onerror = (event) => console.log("WebSocket Error", event)
ws.onclose = (event) => console.log("Disconnected from WebSocket server")

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
    if(!isDrawing) {
        return
    }
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineTo(event.clientX - (canvasOffsetX-20), event.clientY - canvasOffsetY)
    ctx.stroke();
    ws.send(JSON.stringify({
        x: event.clientX,
        y: event.clientY
    }))
}

canvas.addEventListener('mousedown', (event) => {
    isDrawing = true
})

canvas.addEventListener('mouseup', event => {
    isDrawing = false
    ctx.stroke()
    ctx.beginPath()
})

canvas.addEventListener('mousemove', drawAndSend)

function getMousePos(evt) {
    return {
        x: Math.round(evt.clientX - canvasOffsetX),
        y: Math.round(evt.clientY - canvasOffsetY)
    };
}

function sendMessage(evt){
  if(isDrawing)
    ws.send(getMousePos(evt).x + "," + getMousePos(evt).y)
}
