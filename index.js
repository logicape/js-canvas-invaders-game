const canvas = document.getElementById('thisCan')
const scoreEl = document.getElementById('scoreEl')
const c = canvas.getContext('2d')

canvas.width = 1024             //window.innerWidth
canvas.height = 576             //window.innerHeight

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        this.opacity = 1
        const image = new Image()
        image.src = './img/spaceship.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
        /* c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height) */

        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

        c.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 4
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.fades) {
            this.opacity -= 0.01
        }
    }
}

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.width = 3
        this.height = 10
    }

    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    constructor({ position, type }) {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.type = type
        this.color
        this.value
        const image = new Image()
        switch (this.type) {
            case 1:
                image.src = './img/invader.png'
                this.color = colors.purple
                this.value = 100
                break
            case 2:
                image.src = './img/invader2.png'
                this.color = colors.green
                this.value = 200
                break
            case 3:
                image.src = './img/invader3.png'
                this.color = colors.yellow
                this.value = 300
                break
        }
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        /* c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height) */
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 1,
            y: 0
        }
        this.invaders = []

        let type = 1 + Math.floor(Math.random() * 3)            //for now...

        const columns = Math.floor(Math.random() * 8 + 6)
        const rows = Math.floor(Math.random() * 2 + 1) * 2      //2 || 4  
        this.width = columns * 30
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({ position: { x: x * 30, y: y * 30 }, type }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0
        if (this.position.x + this.width >= canvas.width || this.position.x < 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

class Score {
    constructor({ position, color, fades, scoreVal }) {
        this.position = position
        this.color = color
        this.opacity = 1
        this.fades = fades
        this.scoreVal = scoreVal
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.font = "20px san-serif"
        c.fillStyle = this.color
        c.fillText(this.scoreVal, this.position.x, this.position.y)  // ,30)
        c.restore()
    }

    update() {
        this.draw()
        this.position.y -= .5
        if (this.fades) {
            this.opacity -= 0.0066
        }
    }
}


const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const scores = []

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

const colors = {
    purple: "#9474c3",
    green: "#6ab983",
    yellow: "#bcaf6d"
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500) + 1000
let game = {
    over: false,
    active: true
}
let score = 0

//instantiate Fast stars
for (let i = 0; i < 10; i++) {
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.2
        },
        radius: Math.random() * 3,
        color: 'white'
    }))
}

//instantiate Slow stars
for (let i = 0; i < 30; i++) {
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.15
        },
        radius: Math.random() * 2,
        color: 'lightgray'
    }))
}

//instantiate Snail stars
for (let i = 0; i < 50; i++) {
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.1
        },
        radius: Math.random() * 2,
        color: 'slategrey'
    }))
}

function createParticles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#BAA0DE',
            fades: fades
        }))
    }
}

function floatScore({ object, color, fades, scoreVal }) {

    scores.push(new Score({
        position: {
            x: object.position.x,
            y: object.position.y + object.height
        },
        color: color || 'white',
        fades: fades,
        scoreVal: scoreVal
    }))

}

function animate() {
    if (!game.active) {
        return
    }
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach((particle, pindex) => {
        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(pindex, 1)
            }, 0)
        } else {
            particle.update()
        }
    })
    scores.forEach((score, sindex) => {
        if (score.opacity <= 0) {
            setTimeout(() => {
                scores.splice(sindex, 1)
            }, 0)
        } else {
            score.update()
        }
    })

    invaderProjectiles.forEach((invaderProjectile, ip) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(ip, 1)
            }, 0)
        } else {
            invaderProjectile.update()
        }

        //projectile hits player
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width) {

            /* setTimeout(() => {
                invaderProjectiles.splice(ip, 1)
                player.opacity = 0
                game.over = true
            }, 0)

            setTimeout(() => {
                game.active = false
            }, 2000) */

            console.log('you lose')
            createParticles({
                object: player,
                color: 'white',
                fades: true
            })
        }
    })


    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
        else {
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        //spawn enemy projectilies
        if (frames % 250 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            //check for player shots hitting enemies
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.y + projectile.radius >= invader.position.y &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width
                ) {

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((invader2) => {
                            return invader2 === invader
                        })
                        const projectileFound = projectiles.find((projectile2) => {
                            return projectile2 === projectile
                        })
                        if (invaderFound && projectileFound) {
                            floatScore({
                                object: invader,
                                color: invader.color,
                                fades: true,
                                scoreVal: invader.value
                            })
                            score += invader.value
                            scoreEl.innerHTML = score
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            createParticles({
                                object: invader,
                                fades: true,
                                color: invader.color
                            })

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]
                                //reset grid width to accommodate if a whole column was removed
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                //reset the grid's position to the first invader's
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })


    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -5
        player.rotation = -0.15
    } else if (keys.d.pressed && player.position.x < canvas.width - player.width) {
        player.velocity.x = 5
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    //spawn enemy grids
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500) + 500
        frames = 0
    }

    frames++
}

animate()


window.addEventListener('keydown', ({ key }) => {
    if (game.over) {
        return
    }

    switch (key) {
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case ' ':
            keys.space.pressed = true
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -7
                }
            }))
            break
    }
})

window.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case ' ':
            keys.space.pressed = false
            break
    }
})