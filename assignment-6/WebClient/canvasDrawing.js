const canvas = document.getElementById("drawing-board")
const toolbar = document.getElementById("toolbar")
const ctx = canvas.getContext("2d")

const canvasOffsetX = canvas.offsetLeft
const canvasOffsetY = canvas.offsetTop

canvas.width = window.innerWidth - canvasOffsetX
canvas.height = window.innerHeight - canvasOffsetY

let isPainting = false
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

const draw = (event) => {
    if(!isPainting) {
        return
    }

    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineTo(event.clientX - canvasOffsetX, event.clientY)
    ctx.stroke();
}

canvas.addEventListener('mousedown', (event) => {
    isPainting = true
})

canvas.addEventListener('mouseup', event => {
    isPainting = false
    ctx.stroke()
    ctx.beginPath()
})

canvas.addEventListener('mousemove', draw)
