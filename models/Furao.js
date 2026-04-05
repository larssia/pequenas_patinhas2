class Obj {
    constructor(x, y, w, h, a, chaoY) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a

        this.vel = 2
        this.gravidade = 0.5
        this.impulso = -12
        this.velY = 0
        this.noChao = false
        this.chaoY = chaoY

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

// ================= FURÃO =================
class Furao extends Obj {
    constructor(x, y, w, h, a, chaoY) {
        super(x, y, w, h, a, chaoY)
        this.pontos = 0
        this.maxPontos = 20
    }

    desenhar(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
    }

    pular() {
        if (this.noChao) {
            this.velY = this.impulso
            this.noChao = false
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
        }
    }
}

// ================= FRUTAS =================
class Frutas extends Obj {
    recomeca() {
        this.x = 1200 + Math.random() * 600
        this.y = CHAO - 40 - Math.random() * 180
    }

    mov_fruta(velocidadeFase) {
        this.x -= this.vel * velocidadeFase + velocidadeMundo
        if (this.x < -this.w) this.recomeca()
    }
}

// ================= GALHOS =================
class Galhos extends Obj {
    constructor(x, y, w, h, a, isTronco = false) {
        super(x, CHAO - h, w, h, a, CHAO - h)
        this.isTronco = isTronco
        this.podeColidir = true
    }

    recomeca() {
        this.x = 1200 + Math.random() * 800
        this.y = CHAO - this.h
    }

    mov_galho(velocidadeFase) {
        this.x -= this.vel * velocidadeFase + velocidadeMundo
        if (this.x < -this.w) this.recomeca()
    }
}