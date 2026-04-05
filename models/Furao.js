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

        this.frame = 0
        this.frameTotal = 6   
        this.frameTimer = 0
        this.frameDelay = 6  
        this.linhaAtual = 0 
    }

    desenhar(ctx) {
        this.linhaAtual = this.noChao ? 0 : 1

        // Avança o frame
        this.frameTimer++
        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0
            this.frame = (this.frame + 1) % this.frameTotal
        }

        const cols = 6
        const rows = 4
        const frameW = this.img.naturalWidth / cols
        const frameH = this.img.naturalHeight / rows

        if (!frameW || !frameH) {
            ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
            return
        }

        ctx.drawImage(
            this.img,
            this.frame * frameW,        // sx
            this.linhaAtual * frameH,   // sy
            frameW, frameH,             // sWidth, sHeight
            this.x, this.y,             // dx, dy
            this.w, this.h              // dWidth, dHeight
        )
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
        let posY = isTronco ? CHAO - h : y
        super(x, posY, w, h, a, posY)
        this.isTronco = isTronco
        this.podeColidir = true
    }

    recomeca() {
        this.x = 1200 + Math.random() * 800
        if (this.isTronco) {
            this.y = CHAO - this.h
        } else {
            this.y = CHAO - this.h - Math.random() * 160
        }
    }

    mov_galho(velocidadeFase) {
        this.x -= this.vel * velocidadeFase + velocidadeMundo
        if (this.x < -this.w) this.recomeca()
    }
}