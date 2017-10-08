const settings = {
    pixel_type: 'checkbox',
    width: 80,
    height: 60,
    pause: false,
    speed: 200
}

const setPixel = (x, y, color = true) => document.querySelector('#line' + y).children[x].checked = color

function Apple() {
    const {round, random} = Math
    let apple = {
        x: 0,
        y: 0
    }

    apple.newPosition = () => {
        apple.x = round(random() * settings.width)
        apple.y = round(random() * settings.height)
    }

    apple.draw = () => setPixel(apple.x, apple.y)

    apple.newPosition()

    return apple
}

function Snake() {
    let xspeed = 1, yspeed = 0, tail = []

    let snake = {
        x: Math.round(settings.width / 2),
        y: Math.round(settings.height / 2),
    }

    tail.push({
        x: snake.x - xspeed,
        y: snake.y - yspeed
    })

    tail.push({
        x: snake.x - 2*xspeed,
        y: snake.y - 2*yspeed
    })

    snake.dir = k => {
        switch(k) {
            case 'W': 
                xspeed = 0
                yspeed = -1
                break
            case 'S': 
                xspeed = 0
                yspeed = 1
                break
            case 'A': 
                xspeed = -1
                yspeed = 0
                break
            case 'D': 
                xspeed = 1
                yspeed = 0
                break
            default:
        }
    }

    snake.die = () => {
        tail = [{
            x: snake.x - xspeed,
            y: snake.y - yspeed
        }]
        snake.x = Math.round(settings.width / 2)
        snake.y = Math.round(settings.height / 2)
        window.alert('You loose!')
    }

    snake.eat = ({x, y}) => {
        if (tail.length > 0) {
            const pos = tail[tail.length - 1]
           
            if (pos.x == x && pos.y == y) {
                tail.push({x: 0, y: 0})
                console.log(tail)
                return true
            }
        }
        return false
    }

    snake.update = () => {
        tail[0] = {x: snake.x, y: snake.y}
        for (let i=tail.length - 1; i >= 1; i--) {
            tail[i] = tail[i-1]
        }
        

        snake.x += xspeed
        snake.y += yspeed

        if (snake.x < 0 || snake.x >= settings.width 
        || snake.y < 0 || snake.y >= settings.height) 
            snake.die()
    }

    snake.draw = () => {
        setPixel(snake.x, snake.y)
        tail.forEach(({x, y}) => setPixel(x, y))
    }

    return snake
}

const snake = Snake()

window.addEventListener('load', () => {
    const screen = document.querySelector('#screen')
    
    for (let y = 0; y < settings.height; y++) {
        let line = document.createElement('div')
        line.id = 'line' + y
        screen.appendChild(line)

        for (let x = 0; x < settings.width; x++) {
            let checkbox = document.createElement('input')
            checkbox.type = settings.pixel_type
            line.appendChild(checkbox)
        }
    }

    let apple = Apple()

    function draw() {
        if (!settings.pause) {
            for (let y = 0; y < settings.height; y++) {
                const pixels = document.querySelector('#line' + y).children
                for (let x = 0; x < settings.width; x++)
                    pixels[x].checked = false
            }
            snake.update()
            
            if (snake.eat(apple)) {
                console.log('new position')
                apple.newPosition()
            }

            
            snake.draw()
            apple.draw()
        }

        setTimeout(draw, settings.speed)
    }   
    draw()
})

window.addEventListener('keypress', ({key}) => {
    if (key === ' ') {
        document.querySelector('body').style.backgroundColor = 
            (settings.pause = !settings.pause) ? '#fff' : '#000' 
        
    }
    else if (!settings.pause) snake.dir(key.toUpperCase())
})