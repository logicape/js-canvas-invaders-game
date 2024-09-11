const canvas = document.getElementById('thisCan')
const c = canvas.getContext('2d')

canvas.width = 1024             //window.innerWidth
canvas.height = 576             //window.innerHeight
c.font = "48px serif"
c.fillStyle = 'white'
c.fillText('horse', 200, 400)