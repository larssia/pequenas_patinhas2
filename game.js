// ================== CONFIG ==================
const tela = document.getElementById("des")
const des = tela.getContext("2d")

const CHAO = 580

// ================== FUNÇÕES ==================
function pontosPorFase(fase) {
    if (fase === 1) return 20
    if (fase === 2) return 40
    if (fase === 3) return 60
}

function posicaoFruta() {
    let alturas = [
        CHAO - 40,
        CHAO - 120,
        CHAO - 200
    ]
    return alturas[Math.floor(Math.random() * alturas.length)]
}

// ================= OBJETOS =================

// MUITAS FRUTAS
const frutasLista = []
for (let i = 0; i < 12; i++) {
    frutasLista.push(
        new Frutas(
            1200 + i * 180,
            CHAO - 40,
            50,
            30,
            './img/morango.png'
        )
    )
}

// MUITOS GALHOS
const galhosLista = []
for (let i = 0; i < 10; i++) {
    galhosLista.push(
        new Galhos(
            1200 + i * 220,
            CHAO,
            60,
            40,
            './img/galho.png'
        )
    )
}

// TRONCOS GRANDES NO CHÃO
galhosLista.push(new Galhos(2000, CHAO, 120, 90, './img/tronco.png', true))
galhosLista.push(new Galhos(2600, CHAO, 120, 90, './img/tronco.png', true))

// ================== IMAGENS ==================
const furao = new Furao(80, CHAO - 120, 200, 120, './img/mov_furao.png', CHAO - 120)
const furao2 = new Furao(30, CHAO - 160, 180, 108, './img/mov_furao.png', CHAO - 160)

const imgPooh = new Image()
imgPooh.src = "./img/pooh.png"
const imgTigre = new Image()
imgTigre.src = "./img/tigrao.png"
const imgMusti = new Image()
imgMusti.src = "./img/furao_lado_oposto.png"

const fundoImg = new Image()
fundoImg.src = "./img/fundo-jogo.png"
const fundoImg2 = new Image()
fundoImg2.src = "./img/fundo-jogo2.png"
const fundoImg3 = new Image()
fundoImg3.src = "./img/fundo-jogo3.png"
const fundoImg4 = new Image()
fundoImg4.src = "./img/fundo-jogo4.png"
const fundoImg5 = new Image()
fundoImg5.src = "./img/fundo-jogo5.png"
const fundoImg6 = new Image()
fundoImg6.src = "./img/fundo-jogo6.png"

const gameOverImg = new Image()
gameOverImg.src = "./img/gameover.png"
const vitoriaImg = new Image()
vitoriaImg.src = "./img/vitoria.png"
const menuImg = new Image()
menuImg.src = "./img/menu.png"

// ================== SONS ==================
const somFruta = new Audio('./sons/frutas.mp3')
const somGalho = new Audio('./sons/galhos.mp3')
const somPulo = new Audio('./sons/Pulo.mp3')
const somPassos = new Audio('./sons/passos.mp3')
somPassos.loop = true
const musica = new Audio('./sons/fundo.mp3')
musica.loop = true
musica.volume = 0.2
somFruta.volume = 0.5
somGalho.volume = 0.7
somPulo.volume = 0.6
somPassos.volume = 0.6

// ================== ESTADO ==================
let dx = 0
let dx2 = 0
let fundoX = 0
let estado = "menu"
let modoJogo = 1
let personagemEscolhido = 1
let personagemEscolhido2 = 2
let selecionandoJogador = 0

let indexFundo = 0
let fase = 1
let emTransicao = false
let alphaFade = 0
let proximaFase = 1
let pontosTotal = 0
let pontosTotal2 = 0

furao.maxPontos = pontosPorFase(fase)
furao2.maxPontos = pontosPorFase(fase)

let vidas = 4
let vidas2 = 4
let galhosColetados = 0
let galhosColetados2 = 0
let gameOver = false
let venceu = false
let pausado = false
let velocidadeMundo = 0

document.addEventListener("keydown", () => { musica.play() }, { once: true })

document.addEventListener("keydown", (e) => {
    if (e.key == "w" || e.key == "W") furao.pular()
    if (e.key == "ArrowUp") {
        if (modoJogo === 2) furao2.pular()
        else furao.pular()
    }
    if (e.key == "d" || e.key == "D") dx = 1
    if (e.key == "ArrowRight" && modoJogo === 1) dx = 1
    if (e.key == "ArrowRight" && modoJogo === 2) dx2 = 1

    if ((gameOver || venceu) && (e.key == "v" || e.key == "V")) window.location.href = "./index.html"
    if ((gameOver || venceu) && (e.key == "r" || e.key == "R")) reiniciarJogo()
    if (e.key == "Escape") pausado = !pausado
})

document.addEventListener("keyup", (e) => {
    if (e.key == "d" || e.key == "D") dx = 0
    if (e.key == "ArrowRight" && modoJogo === 1) dx = 0
    if (e.key == "ArrowRight" && modoJogo === 2) dx2 = 0

    if (pausado) {
        if (e.key == "1") pausado = false
        if (e.key == "2") { pausado = false; reiniciarJogo() }
        if (e.key == "3") window.location.href = "./index.html"
    }
})

// ================== CLIQUES ==================
tela.addEventListener("click", (e) => {
    let rect = tela.getBoundingClientRect()
    let mouseX = e.clientX - rect.left
    let mouseY = e.clientY - rect.top

    if (estado === "menu") {
        let largura = 220, altura = 80
        let x1 = tela.width / 2 - 260, y1 = 380
        let x2 = tela.width / 2 + 40, y2 = 380

        if (mouseX >= x1 && mouseX <= x1 + largura && mouseY >= y1 && mouseY <= y1 + altura) {
            window.location.href = "index.html"; return
        }
        if (mouseX >= x2 && mouseX <= x2 + largura && mouseY >= y2 && mouseY <= y2 + altura) {
            estado = "selecao"; return
        }
    }

    if (estado === "selecao") {
        let largura = 200, altura = 45
        let xCentro = tela.width / 2 - largura / 2

        let y1Modo = 185, y2Modo = 240
        if (mouseX >= xCentro && mouseX <= xCentro + largura && mouseY >= y1Modo && mouseY <= y1Modo + altura) {
            modoJogo = 1; selecionandoJogador = 0; return
        }
        if (mouseX >= xCentro && mouseX <= xCentro + largura && mouseY >= y2Modo && mouseY <= y2Modo + altura) {
            modoJogo = 2; selecionandoJogador = 1; return
        }

        let ys = [340, 410, 480]

        if (modoJogo === 1) {
            let xBox = tela.width / 2 - largura / 2
            ys.forEach((y, i) => {
                if (mouseX >= xBox && mouseX <= xBox + largura && mouseY >= y && mouseY <= y + altura) {
                    personagemEscolhido = i + 1
                }
            })
        } else {
            let xEsq = tela.width / 2 - largura - 60
            let xDir = tela.width / 2 + 60

            ys.forEach((y, i) => {
                if (mouseX >= xEsq && mouseX <= xEsq + largura && mouseY >= y && mouseY <= y + altura) {
                    if (selecionandoJogador === 1) {
                        personagemEscolhido = i + 1
                        selecionandoJogador = 2
                    }
                }
                if (mouseX >= xDir && mouseX <= xDir + largura && mouseY >= y && mouseY <= y + altura) {
                    if (selecionandoJogador === 2) {
                        personagemEscolhido2 = i + 1
                        selecionandoJogador = 0
                    }
                }
            })
        }

        let xJogar = tela.width / 2 - 110, yJogar = tela.height - 90
        if (mouseX >= xJogar && mouseX <= xJogar + 220 && mouseY >= yJogar && mouseY <= yJogar + 60) {
            aplicarPersonagem(furao, personagemEscolhido)
            if (modoJogo === 2) aplicarPersonagem(furao2, personagemEscolhido2)
            estado = "jogo"
        }
    }

    if (estado === "jogo") {
        let w = 50, h = 50
        let bx = tela.width - w - 20, by = tela.height - h - 20
        if (mouseX >= bx && mouseX <= bx + w && mouseY >= by && mouseY <= by + h) {
            pausado = !pausado
        }
    }
})

function aplicarPersonagem(jogador, personagem) {
    if (personagem === 1) jogador.img.src = './img/mov_pooh.png'
    else if (personagem === 2) jogador.img.src = './img/mov_tigrao.png'
    else if (personagem === 3) jogador.img.src = './img/mov_furao.png'
}

// ================== DESENHO ==================
function desenha() {
    galhosLista.forEach(g => g.des_galhos())
    frutasLista.forEach(f => f.des_fruta())

    furao.desenhar(des)
    if (modoJogo === 2) furao2.desenhar(des)

    if (modoJogo === 2) {
        furao2.desenhar(des)
        des.textAlign = "center"
        des.font = "bold 13px Arial"
        des.fillStyle = "#ff4d6d"
        des.fillText("P1", furao.x + furao.w / 2, furao.y - 5)
        des.fillStyle = "#4d88ff"
        des.fillText("P2", furao2.x + furao2.w / 2, furao2.y - 5)
        des.textAlign = "start"
    }
}

function atualiza() {
    if (gameOver || venceu) return

    furao.atualizar(dx)

    if (dx !== 0 && furao.noChao && !gameOver && !venceu) {
        if (somPassos.paused) somPassos.play()
    } else {
        somPassos.pause()
        somPassos.currentTime = 0
    }

    let velocidadeFase = 1
    if (fase === 2) velocidadeFase = 1.05
    if (fase === 3) velocidadeFase = 1.2

    if (modoJogo === 2) {
        velocidadeMundo = ((dx + dx2) / 2) * furao.vel
        furao2.atualizar(dx2)
    } else {
        velocidadeMundo = dx * furao.vel
    }

    galhosLista.forEach(g => g.mov_galho(velocidadeFase))
    frutasLista.forEach(f => f.mov_fruta(velocidadeFase))

    frutasLista.forEach(f => {
        let pg = 3
        if (furao.colid(f)) {
            f.recomeca()
            somFruta.cloneNode().play()
            furao.pontos = Math.min(furao.maxPontos, furao.pontos + pg)
            pontosTotal += pg
        }
        if (modoJogo === 2 && furao2.colid(f)) {
            f.recomeca()
            somFruta.cloneNode().play()
            furao2.pontos = Math.min(furao2.maxPontos, furao2.pontos + pg)
            pontosTotal2 += pg
        }
    })

    galhosLista.forEach(g => {
        if (furao.colid(g) && g.podeColidir) {
            g.podeColidir = false

            galhosColetados++
            if (galhosColetados >= 5) {
                vidas--
                galhosColetados = 0
            }

            g.recomeca()

            setTimeout(() => g.podeColidir = true, 300)
        }
    })

    // Troca de fase
    let condicaoFase = modoJogo === 2
        ? (furao.pontos >= furao.maxPontos || furao2.pontos >= furao2.maxPontos)
        : furao.pontos >= furao.maxPontos

    if (condicaoFase && !emTransicao && !venceu) {
        emTransicao = true
        alphaFade = 0
        if (fase === 3) {
            venceu = true; gameOver = false; emTransicao = false
        } else {
            proximaFase = fase + 1
        }
    }

    if (emTransicao) {
        alphaFade += 0.05
        if (alphaFade >= 1) {
            fase = proximaFase
            emTransicao = false
            alphaFade = 0
            furao.pontos = 0
            furao.maxPontos = pontosPorFase(fase)
            furao2.pontos = 0
            furao2.maxPontos = pontosPorFase(fase)
            if (fase === 2) { furao.vel = 7; furao2.vel = 7 }
            else if (fase === 3) { furao.vel = 10; furao2.vel = 10 }
        }
    }

    if (modoJogo === 1 && vidas <= 0) gameOver = true
    if (modoJogo === 2 && vidas <= 0 && vidas2 <= 0) gameOver = true
}

function desenharVidas() {
    let espacamento = 30

    if (modoJogo === 1) {
        let y = 60
        let x = tela.width - (vidas * espacamento) - 20
        for (let i = 0; i < vidas; i++) {
            des.font = "24px Arial"
            des.fillText("❤️", x + (i * espacamento), y)
        }
    } else {
        let y1 = 60
        let x1 = tela.width - (vidas * espacamento) - 50
        des.fillStyle = "#ff4d6d"
        des.font = "bold 14px Arial"
        des.fillText("P1", x1 - 5, y1 - 2)
        for (let i = 0; i < vidas; i++) {
            des.font = "20px Arial"
            des.fillText("❤️", x1 + (i * espacamento), y1)
        }
        let y2 = 90
        let x2 = tela.width - (vidas2 * espacamento) - 50
        des.fillStyle = "#4d88ff"
        des.font = "bold 14px Arial"
        des.fillText("P2", x2 - 5, y2 - 2)
        for (let i = 0; i < vidas2; i++) {
            des.font = "20px Arial"
            des.fillText("💙", x2 + (i * espacamento), y2)
        }
    }
}

function desenharBarra() {
    let larguraMax = 260
    let altura = 22
    let x = 20
    let y = 20

    let progresso = furao.pontos / furao.maxPontos

    des.fillStyle = "#ffd6e0"
    desenharRetanguloArredondado(x, y, larguraMax, altura, 15)
    des.fill()

    des.fillStyle = "#ff8fab"
    desenharRetanguloArredondado(x, y, larguraMax * progresso, altura, 15)
    des.fill()

    des.fillStyle = "rgba(255,255,255,0.4)"
    desenharRetanguloArredondado(x, y, larguraMax * progresso, altura / 2, 15)
    des.fill()

    des.strokeStyle = "#ff4d6d"
    des.lineWidth = 2
    desenharRetanguloArredondado(x, y, larguraMax, altura, 15)
    des.stroke()

    des.fillStyle = "#ff4d6d"
    des.font = "16px Arial"
    if (modoJogo === 2) {
        des.font = "bold 13px Arial"
        des.fillText("P1", x, y - 3)
    }
    des.font = "16px Arial"
    des.fillText("💖 " + furao.pontos, x + larguraMax + 8, y + 16)

    if (modoJogo === 2) {
        let y2 = 50
        let progresso2 = furao2.pontos / furao2.maxPontos

        des.fillStyle = "#d6e4ff"
        desenharRetanguloArredondado(x, y2, larguraMax, altura, 15)
        des.fill()

        des.fillStyle = "#6aa3ff"
        desenharRetanguloArredondado(x, y2, larguraMax * progresso2, altura, 15)
        des.fill()

        des.fillStyle = "rgba(255,255,255,0.4)"
        desenharRetanguloArredondado(x, y2, larguraMax * progresso2, altura / 2, 15)
        des.fill()

        des.strokeStyle = "#4d88ff"
        des.lineWidth = 2
        desenharRetanguloArredondado(x, y2, larguraMax, altura, 15)
        des.stroke()

        des.fillStyle = "#4d88ff"
        des.font = "bold 13px Arial"
        des.fillText("P2", x, y2 - 3)
        des.font = "16px Arial"
        des.fillText("💙 " + furao2.pontos, x + larguraMax + 8, y2 + 16)
    }
}

function desenharRetanguloArredondado(x, y, w, h, r) {
    des.beginPath()
    des.moveTo(x + r, y)
    des.lineTo(x + w - r, y)
    des.quadraticCurveTo(x + w, y, x + w, y + r)
    des.lineTo(x + w, y + h - r)
    des.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    des.lineTo(x + r, y + h)
    des.quadraticCurveTo(x, y + h, x, y + h - r)
    des.lineTo(x, y + r)
    des.quadraticCurveTo(x, y, x + r, y)
    des.closePath()
}

function desenharFundo() {
    let larguraFundo = 1200

    if (modoJogo === 2) {
        fundoX -= ((dx + dx2) / 2) * furao.vel
    } else {
        fundoX -= dx * furao.vel
    }

    let fundosFase
    if (fase === 1) fundosFase = [fundoImg, fundoImg2]
    else if (fase === 2) fundosFase = [fundoImg3, fundoImg4]
    else fundosFase = [fundoImg5, fundoImg6]

    let fundoA = fundosFase[indexFundo % 2]
    let fundoB = fundosFase[(indexFundo + 1) % 2]

    if (fundoX <= -larguraFundo) {
        fundoX += larguraFundo
        indexFundo++
    }

    des.globalAlpha = 1
    des.drawImage(fundoA, fundoX, 0, larguraFundo, 700)
    des.drawImage(fundoB, fundoX + larguraFundo, 0, larguraFundo, 700)

    if (emTransicao) {
        let proximosFundos
        if (proximaFase === 2) proximosFundos = [fundoImg3, fundoImg4]
        else if (proximaFase === 3) proximosFundos = [fundoImg5, fundoImg6]
        if (proximosFundos) {
            des.globalAlpha = alphaFade
            des.drawImage(proximosFundos[0], fundoX, 0, larguraFundo, 700)
            des.drawImage(proximosFundos[1], fundoX + larguraFundo, 0, larguraFundo, 700)
        }
    }

    des.globalAlpha = 1
}

function desenharJogo() {
    desenha()
    desenharBarra()
    desenharVidas()
    desenharBotaoPause()
}

function desenharMenu() {
    des.drawImage(menuImg, 0, 0, tela.width, tela.height)

    des.fillStyle = "#5d4037"
    des.font = "bold 60px 'Comic Sans MS'"
    des.textAlign = "center"
    des.fillText("Vamos começar?", tela.width / 2, 120)

    let largura = 220, altura = 80
    let x1 = tela.width / 2 - 260, y1 = 380
    let x2 = tela.width / 2 + 40, y2 = 380

    desenharRetanguloArredondado(x1 + 5, y1 + 5, largura, altura, 25)
    des.fillStyle = "rgba(0,0,0,0.2)"; des.fill()
    desenharRetanguloArredondado(x1, y1, largura, altura, 25)
    des.fillStyle = "#b08968"; des.fill()
    desenharRetanguloArredondado(x1, y1, largura, altura / 2, 25)
    des.fillStyle = "rgba(255,255,255,0.2)"; des.fill()
    des.fillStyle = "#fff"; des.font = "bold 26px Arial"
    des.fillText("Voltar", x1 + largura / 2, y1 + 48)

    desenharRetanguloArredondado(x2 + 5, y2 + 5, largura, altura, 25)
    des.fillStyle = "rgba(0,0,0,0.2)"; des.fill()
    desenharRetanguloArredondado(x2, y2, largura, altura, 25)
    des.fillStyle = "#b08968"; des.fill()
    desenharRetanguloArredondado(x2, y2, largura, altura / 2, 25)
    des.fillStyle = "rgba(255,255,255,0.2)"; des.fill()
    des.fillStyle = "#fff"; des.font = "bold 24px Arial"
    des.fillText("Personalizar", x2 + largura / 2, y2 + 48)

    des.textAlign = "start"
}

function desenharSelecao() {
    des.drawImage(menuImg, 0, 0, tela.width, tela.height)
    des.textAlign = "center"

    des.fillStyle = "#5d4037"
    des.font = "bold 50px 'Comic Sans MS'"
    des.fillText("Personalizar", tela.width / 2, 75)

    des.fillStyle = "#6d4c41"
    des.font = "20px Arial"
    des.fillText("Escolha quantos jogadores:", tela.width / 2, 160)

    let largura = 200, altura = 40
    let xCentro = tela.width / 2 - largura / 2

    let y1Modo = 170, y2Modo = 220

    desenharRetanguloArredondado(xCentro, y1Modo, largura, altura, 20)
    des.fillStyle = modoJogo === 1 ? "#b08968" : "rgba(0,0,0,0.2)"; des.fill()
    des.fillStyle = "#fff"; des.font = "bold 18px Arial"
    des.fillText("1 Jogador", tela.width / 2, y1Modo + 27)

    desenharRetanguloArredondado(xCentro, y2Modo, largura, altura, 20)
    des.fillStyle = modoJogo === 2 ? "#b08968" : "rgba(0,0,0,0.2)"; des.fill()
    des.fillStyle = "#fff"
    des.fillText("2 Jogadores", tela.width / 2, y2Modo + 27)

    let ys = [310, 385, 460]
    let nomes = ["Poohret", "Tigret", "Musti"]
    let imgs = [imgPooh, imgTigre, imgMusti]

    if (modoJogo === 1) {
        des.fillStyle = "#6d4c41"; des.font = "18px Arial"
        des.fillText("Escolha seu personagem:", tela.width / 2, 295)

        let xBox = tela.width / 2 - largura / 2
        let xImg = xBox + largura + 15

        ys.forEach((y, i) => {
            desenharRetanguloArredondado(xBox, y, largura, altura, 20)
            des.fillStyle = personagemEscolhido === (i + 1) ? "#b08968" : "rgba(0,0,0,0.2)"; des.fill()
            des.fillStyle = "#fff"; des.font = "bold 17px Arial"
            des.fillText(nomes[i], tela.width / 2, y + 27)
            des.drawImage(imgs[i], xImg, y - 3, 50, 50)
        })
    } else {
        let xEsq = tela.width / 2 - largura - 55
        let xDir = tela.width / 2 + 55
        let xImgEsq = xEsq + largura + 8
        let xImgDir = xDir + largura + 8

        des.fillStyle = "#ff4d6d"; des.font = "bold 16px Arial"
        des.fillText("◀ Jogador 1" + (selecionandoJogador === 1 ? " (escolha!)" : ""), tela.width / 2 - 130, 295)
        des.fillStyle = "#4d88ff"
        des.fillText("Jogador 2 ▶" + (selecionandoJogador === 2 ? " (escolha!)" : ""), tela.width / 2 + 130, 295)

        ys.forEach((y, i) => {
            desenharRetanguloArredondado(xEsq, y, largura, altura, 20)
            des.fillStyle = personagemEscolhido === (i + 1) ? "#ff8fab" : "rgba(0,0,0,0.15)"; des.fill()
            if (selecionandoJogador === 1) {
                des.strokeStyle = "#ff4d6d"; des.lineWidth = 2
                desenharRetanguloArredondado(xEsq, y, largura, altura, 20); des.stroke()
            }
            des.fillStyle = "#fff"; des.font = "bold 16px Arial"
            des.fillText(nomes[i], xEsq + largura / 2, y + 27)
            des.drawImage(imgs[i], xImgEsq, y - 3, 48, 48)

            desenharRetanguloArredondado(xDir, y, largura, altura, 20)
            des.fillStyle = personagemEscolhido2 === (i + 1) ? "#6aa3ff" : "rgba(0,0,0,0.15)"; des.fill()
            if (selecionandoJogador === 2) {
                des.strokeStyle = "#4d88ff"; des.lineWidth = 2
                desenharRetanguloArredondado(xDir, y, largura, altura, 20); des.stroke()
            }
            des.fillStyle = "#fff"; des.font = "bold 16px Arial"
            des.fillText(nomes[i], xDir + largura / 2, y + 27)
            des.drawImage(imgs[i], xImgDir, y - 3, 48, 48)
        })

        if (selecionandoJogador === 1) {
            des.fillStyle = "#ff4d6d"; des.font = "16px Arial"
            des.fillText("Clique na coluna da esquerda para escolher o personagem do P1", tela.width / 2, 535)
        } else if (selecionandoJogador === 2) {
            des.fillStyle = "#4d88ff"; des.font = "16px Arial"
            des.fillText("Agora clique na coluna da direita para escolher o personagem do P2", tela.width / 2, 535)
        }
    }

    let xJogar = tela.width / 2 - 110, yJogar = tela.height - 90

    desenharRetanguloArredondado(xJogar + 4, yJogar + 4, 220, 60, 25)
    des.fillStyle = "rgba(0,0,0,0.2)"; des.fill()
    desenharRetanguloArredondado(xJogar, yJogar, 220, 60, 25)
    des.fillStyle = "#4caf50"; des.fill()
    desenharRetanguloArredondado(xJogar, yJogar, 220, 30, 25)
    des.fillStyle = "rgba(255,255,255,0.25)"; des.fill()
    des.fillStyle = "#fff"; des.font = "bold 28px Arial"
    des.fillText("▶ Jogar!", tela.width / 2, yJogar + 40)

    des.textAlign = "start"
}

function desenharPause() {
    des.fillStyle = "rgba(0, 0, 0, 0.6)"
    des.fillRect(0, 0, tela.width, tela.height)
    des.fillStyle = "#fff"
    des.textAlign = "center"
    des.font = "50px Arial"
    des.fillText("PAUSADO", tela.width / 2, 150)
    des.font = "28px Arial"
    des.fillText("1 - Voltar ao jogo", tela.width / 2, 250)
    des.fillText("2 - Recomeçar", tela.width / 2, 300)
    des.fillText("3 - Voltar ao início", tela.width / 2, 350)
    des.textAlign = "start"
}

function desenharBotaoPause() {
    let w = 50, h = 50
    let x = tela.width - w - 20
    let y = tela.height - h - 20

    des.fillStyle = "rgba(0,0,0,0.5)"
    des.fillRect(x, y, w, h)
    des.fillStyle = "#fff"

    if (!pausado) {
        des.fillRect(x + 14, y + 10, 6, 30)
        des.fillRect(x + 30, y + 10, 6, 30)
    } else {
        des.beginPath()
        des.moveTo(x + 15, y + 10)
        des.lineTo(x + 15, y + 40)
        des.lineTo(x + 38, y + 25)
        des.closePath()
        des.fill()
    }
}

function desenharGameOver() {
    des.drawImage(gameOverImg, 0, 0, tela.width, tela.height)
    des.fillStyle = "rgba(0, 0, 0, 0.5)"
    des.fillRect(0, 0, tela.width, tela.height)

    des.fillStyle = "#fff"
    des.font = "60px Arial"
    des.textAlign = "center"
    des.fillText("GAME OVER", tela.width / 2, 180)

    if (modoJogo === 2) {
        des.font = "28px Arial"
        des.fillStyle = "#ff8fab"
        des.fillText("P1 - " + pontosTotal + " pontos", tela.width / 2, 250)
        des.fillStyle = "#6aa3ff"
        des.fillText("P2 - " + pontosTotal2 + " pontos", tela.width / 2, 295)
    } else {
        des.fillStyle = "#fff"
        des.font = "30px Arial"
        des.fillText("Pontuação total: " + pontosTotal, tela.width / 2, 270)
    }

    des.fillStyle = "#fff"; des.font = "22px Arial"
    des.fillText("Pressione R para reiniciar", tela.width / 2, 350)
    des.fillText("Pressione V para voltar ao início", tela.width / 2, 390)
    des.textAlign = "start"
}

function desenharVitoria() {
    des.drawImage(vitoriaImg, 0, 0, tela.width, tela.height)
    des.fillStyle = "rgba(0, 0, 0, 0.5)"
    des.fillRect(0, 0, tela.width, tela.height)

    des.textAlign = "center"

    if (modoJogo === 2) {
        let texto, cor
        if (pontosTotal > pontosTotal2) { texto = "🏆 Jogador 1 Venceu!"; cor = "#ff8fab" }
        else if (pontosTotal2 > pontosTotal) { texto = "🏆 Jogador 2 Venceu!"; cor = "#6aa3ff" }
        else { texto = "🤝 Empate!"; cor = "#fff" }

        des.fillStyle = cor; des.font = "bold 55px Arial"
        des.fillText(texto, tela.width / 2, 170)
        des.font = "28px Arial"
        des.fillStyle = "#ff8fab"
        des.fillText("P1 - " + pontosTotal + " pontos", tela.width / 2, 245)
        des.fillStyle = "#6aa3ff"
        des.fillText("P2 - " + pontosTotal2 + " pontos", tela.width / 2, 290)
    } else {
        des.fillStyle = "#fff"; des.font = "60px Arial"
        des.fillText("Você Ganhou!!", tela.width / 2, 200)
        des.font = "30px Arial"
        des.fillText("Pontuação total: " + pontosTotal, tela.width / 2, 280)
    }

    des.fillStyle = "#fff"; des.font = "22px Arial"
    des.fillText("Pressione R para reiniciar", tela.width / 2, 350)
    des.fillText("Pressione V para voltar ao início", tela.width / 2, 390)
    des.textAlign = "start"
}

function reiniciarJogo() {
    vidas = 4; vidas2 = 4
    galhosColetados = 0; galhosColetados2 = 0
    gameOver = false; venceu = false
    pontosTotal = 0; pontosTotal2 = 0
    fase = 1
    furao.vel = 5; furao2.vel = 5
    furao.pontos = 0; furao.maxPontos = pontosPorFase(fase)
    furao.x = 80; furao.y = CHAO - 120
    furao2.pontos = 0; furao2.maxPontos = pontosPorFase(fase)
    furao2.x = 10; furao2.y = CHAO - 160; furao2.w = 180; furao2.h = 108; furao2.chaoY = CHAO - 160
    dx = 0; dx2 = 0
    frutasLista.forEach(f => f.recomeca())
    galhosLista.forEach(g => { g.recomeca(); g.podeColidir = true })
}

function main() {
    des.clearRect(0, 0, 1200, 700)

    if (estado === "menu") {
        desenharMenu()
    } else if (estado === "selecao") {
        desenharSelecao()
    } else if (estado === "jogo") {
        desenharFundo()
        if (!gameOver && !venceu && !pausado) atualiza()
        if (!gameOver && !venceu) {
            desenharJogo()
            if (pausado) desenharPause()
        } else if (gameOver) {
            desenharGameOver()
        } else if (venceu) {
            desenharVitoria()
        }
    }

    requestAnimationFrame(main)
}

main()