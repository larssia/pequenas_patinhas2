class Obj {
    constructor(x, y, w, h, a) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a

        this.vel = 2
        this.gravidade = 0.3
        this.impulso = -12
        this.velY = 0
        this.noChao = false
        this.chaoY = y

        this.frame = 0
        this.frameTimer = 0
        this.frameDelay = 6

        this.img = new Image()
        this.img.src = this.a
    }

    des_fruta() {
        des.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
    des_galhos() {
        des.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
}

class Furao extends Obj {
    constructor(x, y, w, h, a) {
        super(x, y, w, h, a)
        this.pontos = 0
        this.maxPontos = 20
    }

    desenhar(ctx) {
        let frameWidth = 120
        let frameHeight = 72
        let sx = this.frame * frameWidth
        let sy = 0

        if (!this.noChao) {
            sy = 72
        }

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
            this.frame = 0

            somPulo.cloneNode().play() // 🔥 toca o som
        }
    }

    colid(obj) {
        return (
            this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y
        )
    }

    atualizar(dirX) {
        this.velY += this.gravidade
        this.y += this.velY

        if (this.y >= this.chaoY) {
            this.y = this.chaoY
            this.velY = 0
            this.noChao = true
        } else {
            this.noChao = false
        }

        this.frameTimer++

        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0

            if (!this.noChao) {
                this.frame++
                if (this.frame > 5) this.frame = 5
            }

            else if (dirX != 0) {
                this.frame++
                if (this.frame > 5) this.frame = 0
            }

            else {
                this.frame = 0
            }
        }
    }
}

class Frutas extends Obj {
    vel = 2

    recomeca() {
        this.x = 1200 + Math.random() * 800
        this.y = posicaoFruta()
    }
    mov_fruta(velocidadeFase) {
        this.x -= this.vel * velocidadeFase + velocidadeMundo

        if (this.x < -this.w) {
            this.recomeca()
        }
    }
}

class Galhos extends Obj {
    vel = 2

    recomeca() {
        this.x = 1300 + Math.random() * 500

        while (Math.abs(this.x - furao.x) < 200) {
            this.x += 200
        }

        this.y = CHAO - this.h
    }
    mov_galho(velocidadeFase) {
        this.x -= this.vel * velocidadeFase + velocidadeMundo

        if (this.x < -this.w) {
            this.recomeca()
        }
    }
}