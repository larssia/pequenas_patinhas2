class Obj {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.w = 160
        this.h = 130
        this.vel = 2
        this.gravidade = 0.6
        this.impulso = -15
        this.velY = 0
        this.noChao = false
        this.chaoY = y

        this.frame = 0
        this.frameTimer = 0
        this.frameDelay = 6

        this.img = new Image()
        this.img.src = "./img/mov_furao.png"
    }

    desenhar(ctx) {

        let frameWidth = 120
        let frameHeight = 72

        let sx = this.frame * frameWidth
        let sy = 0

        ctx.drawImage(
            this.img,
            sx,
            sy,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            this.w,
            this.h
        )
    }

    pular() {
        if (this.noChao) {
            this.velY = this.impulso
            this.noChao = false
        }
    }

    atualizar(dirX) {

        this.x += dirX * this.vel

        // teleporte nas bordas da tela
        if (this.x > 1200) {
            this.x = -this.w
        }

        if (this.x < -this.w) {
            this.x = 1200
        }

        this.velY += this.gravidade
        this.y += this.velY

        if (this.y >= this.chaoY) {
            this.y = this.chaoY
            this.velY = 0
            this.noChao = true
        }

        if (dirX != 0) {

            this.frameTimer++

            if (this.frameTimer > this.frameDelay) {
                this.frame++
                this.frameTimer = 0

                if (this.frame > 5) {
                    this.frame = 0
                }
            }

        } else {
            this.frame = 0
        }
    }
}