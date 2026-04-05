// ================= CLASSE BASE =================
class Obj {
    constructor(x, y, w, h, a, chaoY) {
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
        this.chaoY = chaoY

        this.frame = 0
        this.frameTimer = 0
        this.frameDelay = 6

        this.img = new Image()
        this.img.src = this.a
    }

    des_fruta() {
        des.drawImage(this.img, this.x, this.y, this.w, this.h)
    }

    des_obstaculo() {
        des.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
}

// ================= FURÃO =================
class Furao extends Obj {
    constructor(x, y, w, h, a, chaoY) {
        super(x, y, w, h, a, chaoY)
        this.pontos = 0
        this.maxPontos = 20
    }

    desenhar(ctx) {
        // spritesheet: 6 colunas x 4 linhas
        // linha 0 = correndo, linha 1 = pulando
        let frameWidth = 120
        let frameHeight = 72
        let sx = this.frame * frameWidth
        let sy = this.noChao ? 0 : 72

        ctx.drawImage(
            this.img,
            sx, sy,
            frameWidth, frameHeight,
            this.x, this.y,
            this.w, this.h
        )
    }

    pular() {
        if (this.noChao) {
            this.velY = this.impulso
            this.noChao = false
            this.frame = 0
            somPulo.cloneNode().play()
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
                // animação de pulo: avança até frame 5 e para
                this.frame++
                if (this.frame > 5) this.frame = 5
            } else if (dirX !== 0) {
                // animação de corrida: loop de 0 a 5
                this.frame++
                if (this.frame > 5) this.frame = 0
            } else {
                // parado: frame 0
                this.frame = 0
            }
        }
    }
}

// ================= FRUTAS =================
class Frutas extends Obj {
    recomeca() {
        this.x = 1200 + Math.random() * 1800
        this.y = posicaoFruta()
    }

    mov_fruta(velocidadeFase) {
        this.x -= this.vel * velocidadeFase + velocidadeMundo
        if (this.x < -this.w) this.recomeca()
    }
}

// ================= OBSTÁCULOS (tronco) =================
class Obstaculo extends Obj {
    constructor(x, y, w, h, a) {
        super(x, CHAO - h, w, h, a, CHAO - h)
        this.podeColidir = true
    }

    recomeca() {
        this.x = 1300 + Math.random() * 1800

        // garante que não spawna em cima do furão
        while (Math.abs(this.x - furao.x) < 300) {
            this.x += 300
        }

        this.y = CHAO - this.h
    }

    mov_obstaculo(velocidadeFase) {
        this.x -= this.vel * velocidadeFase + velocidadeMundo
        if (this.x < -this.w) this.recomeca()
    }
}