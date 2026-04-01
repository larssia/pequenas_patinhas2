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
        this.chaoY = y // limite inferior do personagem (chão)

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
        this.dirX = 0 // direção atual (usada pelo desenhar)
    }

    desenhar(ctx) {
        // Spritesheet 724x724px → 6 colunas, 4 linhas → cada frame = 120x181px
        let frameWidth = 724 / 6
        let frameHeight = 724 / 4

        let sx = this.frame * frameWidth // coluna do frame atual

        // Linha 0 (sy=0)   → andando devagar
        // Linha 1 (sy=181) → no ar / pulando
        // Linha 2 (sy=362) → correndo rápido
        // Linha 3 (sy=543) → parado em pé
        let sy
        if (!this.noChao) {
            sy = 181 // pulando
        } else if (this.dirX !== 0) {
            sy = 362 // correndo
        } else {
            sy = 543 // parado
        }

        ctx.drawImage(
            this.img,
            sx, sy,           // recorte no spritesheet
            frameWidth, frameHeight,
            this.x, this.y,   // posição na tela
            this.w, this.h    // tamanho desenhado
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
        this.dirX = dirX // salva pra desenhar() saber se está se movendo

        this.velY += this.gravidade
        this.y += this.velY

        // Impede de cair abaixo do chão
        const estavaNoChaoCima = this.noChao
        if (this.y >= this.chaoY) {
            this.y = this.chaoY
            this.velY = 0
            this.noChao = true
            // Acabou de pousar: reseta frame para evitar "frame fantasma"
            if (!estavaNoChaoCima) this.frame = 0
        } else {
            this.noChao = false
        }

        // Avança os frames da animação
        this.frameTimer++
        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0

            if (!this.noChao) {
                // No ar: faz loop nos 6 frames de pulo (não para no último)
                this.frame = (this.frame + 1) % 6
            } else if (dirX !== 0) {
                // Correndo: loop nos 6 frames
                this.frame = (this.frame + 1) % 6
            } else {
                // Parado: fica no frame 0
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
        // Garante distância mínima do jogador
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