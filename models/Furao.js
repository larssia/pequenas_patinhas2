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

        // this.img = new Image()
        // this.img.src = './img/mov_furao.png' 
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
        let sy = 0 // Linha 0 corrida

        // SE ESTIVER NO AR 
        if (!this.noChao) {
            // Se o pulo for a 2ª linha, use 72. Se for a 3ª, use 144.
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

    point(obj) {
        if (obj.x <= -100) {
            return true
        } else {
            return false
        }
    }

    atualizar(dirX) {
        // Lógica de Gravidade
        this.velY += this.gravidade
        this.y += this.velY

        // Verificação do Chão
        if (this.y >= this.chaoY) {
            this.y = this.chaoY
            this.velY = 0
            this.noChao = true
        } else {
            this.noChao = false
        }
        // ANIMAÇÃO
        this.frameTimer++

        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0

            // PULO
            if (!this.noChao) {
                this.frame++

                // LIMITA PRA NÃO SUMIR
                if (this.frame > 5) this.frame = 5
            }

            // CORRIDA
            else if (dirX != 0) {
                this.frame++
                // LIMITA PRA PRIMEIRA LINHA
                if (this.frame > 5) this.frame = 0
            }

            // PARADO
            else {
                this.frame = 0
            }
        }
    }
}

class Frutas extends Obj {
    vel = 2

    recomeca() {
        this.x = 1200 + Math.random() * 400
        this.y = posicaoFruta()
    }

    mov_fruta(dx) {
        this.x -= this.vel + (dx * 3)

        if (this.x <= -100) {
            this.recomeca()
        }
    }
}

class Galhos extends Obj {
    vel = 2

    recomeca() {
        this.x = 1300 + Math.random() * 500
        // evita nascer muito perto do jogador
        while (Math.abs(this.x - furao.x) < 200) {
            this.x += 200
        }
        this.y = CHAO - this.h
    }

    mov_galho(dx) {
        this.x -= this.vel + (dx * 3)

        if (this.x <= -100) {
            this.recomeca()
        }
    }
}