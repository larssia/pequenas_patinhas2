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
        CHAO - 40,  // chão
        CHAO - 120, // médio
        CHAO - 200  // alto (pulo)
    ]

    return alturas[Math.floor(Math.random() * alturas.length)]
}

// ================== OBJETOS ==================
const frutasLista = [
    new Frutas(1200, posicaoFruta(), 45, 25, './img/morango.png'),
    new Frutas(1400, posicaoFruta(), 45, 25, './img/abacaxi.png'),
    new Frutas(1500, posicaoFruta(), 45, 25, './img/banana.png'),
    new Frutas(1800, posicaoFruta(), 45, 25, './img/maca.png')
]

const galhosLista = [
    new Galhos(1300, CHAO, 45, 25, './img/banana_podre.png'),
    new Galhos(1600, CHAO, 45, 25, './img/maca_podre.png'),
    new Galhos(1900, CHAO, 45, 25, './img/lixo.png')
]
galhosLista.forEach(g => g.podeColidir = true)


// ================== IMAGENS ==================
const furao = new Furao(10, 520, 200, 120, './img/mov_furao.png')

const fundoImg = new Image()
fundoImg.src = "./img/fundo.png"

const fundoImg2 = new Image()
fundoImg2.src = "./img/fundo2.jpg"

const fundoImg3 = new Image()
fundoImg3.src = "./img/fundo3.png"

const fundoImg4 = new Image()
fundoImg4.src = "./img/fundo4.png"

const fundoImg5 = new Image()
fundoImg5.src = "./img/fundo5.png"

const fundoImg6 = new Image()
fundoImg6.src = "./img/fundo6.png"

const gameOverImg = new Image()
gameOverImg.src = "./img/gameover.png"

const vitoriaImg = new Image()
vitoriaImg.src = "./img/vitoria.png"

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

let dx = 0
let fundoX = 0
let fundoAtual = 0

let indexFundo = 0

let fase = 1
let emTransicao = false
let alphaFade = 0
let proximaFase = 1
let pontosTotal = 0

furao.maxPontos = pontosPorFase(fase)

let vidas = 3
let galhosColetados = 0
let gameOver = false
let venceu = false
let velocidadeMundo = 0


document.addEventListener("keydown", () => {
    musica.play()
}, { once: true })

//MOVIMENTA O FURAO
document.addEventListener("keydown", (e) => {

    if (e.key == "w" || e.key == "W" || e.key == "ArrowUp") {
        furao.pular()
    }

    if (e.key == "d" || e.key == "D" || e.key == "ArrowRight") {
        dx = 1
    }

    if ((gameOver || venceu) && (e.key == "v" || e.key == "V")) {
        window.location.href = "./index.html"
    }

    if (gameOver && (e.key == "r" || e.key == "R")) {
        reiniciarJogo()
    }

})

// PARA O MOVIMENTO DO FURAO
document.addEventListener("keyup", (e) => {

    if (
        e.key == "a" || e.key == "A" ||
        e.key == "d" || e.key == "D" ||
        e.key == "ArrowRight"
    ) {
        dx = 0
    }

})

//DESENHA
function desenha() {

    galhosLista.forEach(g => g.des_galhos())

    frutasLista.forEach(f => f.des_fruta())

    furao.desenhar(des)
}

//ATUALIZA
function atualiza() {

    if (gameOver || venceu) return
    furao.atualizar(dx)

    // SOM DE PASSOS
    if (dx !== 0 && furao.noChao && !gameOver && !venceu) {
        if (somPassos.paused) {
            somPassos.play()
        }
    } else {
        somPassos.pause()
        somPassos.currentTime = 0
    }

    //velocidade dos objetos por fase
    let velocidadeFase = 1
    velocidadeMundo = dx * furao.vel

    if (fase === 2) velocidadeFase = 1.05
    if (fase === 3) velocidadeFase = 1.2

    galhosLista.forEach(g => g.mov_galho(velocidadeFase))
    frutasLista.forEach(f => f.mov_fruta(velocidadeFase))

    frutasLista.forEach(f => {
        let pontosGanhos = 10
        if (furao.colid(f)) {
            f.recomeca()

            somFruta.currentTime = 0
            somFruta.play()

            furao.pontos = Math.min(furao.maxPontos, furao.pontos + pontosGanhos)
            pontosTotal += pontosGanhos
        }
    })

    galhosLista.forEach(g => {
        if (furao.colid(g) && g.podeColidir) {

            g.podeColidir = false

            //  SOM
            try {
                somGalho.currentTime = 0
                somGalho.play()
            } catch (e) {
                console.log("Erro no som:", e)
            }

            //  CONTADOR DE GALHOS 
            galhosColetados++

            if (galhosColetados >= 5) {
                vidas--
                galhosColetados = 0
            }

            let pontosPerdidos = 2

            furao.pontos = Math.max(0, furao.pontos - pontosPerdidos)
            pontosTotal = Math.max(0, pontosTotal - pontosPerdidos)

            g.recomeca()

            setTimeout(() => {
                g.podeColidir = true
            }, 300)
        }
    })

    //mudar fase
    if (furao.pontos >= furao.maxPontos && !emTransicao && !venceu) {
        emTransicao = true
        alphaFade = 0
        if (fase === 3) {
            venceu = true
            gameOver = false
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

            if (fase === 2) {
                furao.vel = 7
            } else if (fase === 3) {
                furao.vel = 10
            }
        }
    }

    if (vidas <= 0) {
        gameOver = true
    }
}

//DESENHAR VIDAS
function desenharVidas() {
    let y = 60
    let espacamento = 30

    let x = tela.width - (vidas * espacamento) - 20

    for (let i = 0; i < vidas; i++) {
        des.font = "24px Arial"
        des.fillText("❤️", x + (i * espacamento), y)
    }
}

//DESENHA BARRA
function desenharBarra() {
    let larguraMax = 300
    let altura = 25
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
    des.font = "18px Arial"
    des.fillText("💖 " + furao.pontos, x + larguraMax + 10, y + 18)
}

//DESENHA ARREDONDADO
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

//DESENHAR FUNDO
function desenharFundo() {
    let larguraFundo = 1200

    fundoX -= dx * furao.vel

    // LISTA DE FUNDOS POR FASE
    let fundosFase

    if (fase === 1) {
        fundosFase = [fundoImg, fundoImg2]
    } else if (fase === 2) {
        fundosFase = [fundoImg3, fundoImg4]
    } else {
        fundosFase = [fundoImg5, fundoImg6]
    }

    // índices dos fundos
    let fundoA = fundosFase[indexFundo % 2]
    let fundoB = fundosFase[(indexFundo + 1) % 2]

    // quando sair da tela, troca ordem
    if (fundoX <= -larguraFundo) {
        fundoX += larguraFundo


        indexFundo++
    }

    // desenha os dois fundos
    des.globalAlpha = 1
    des.drawImage(fundoA, fundoX, 0, larguraFundo, 700)
    des.drawImage(fundoB, fundoX + larguraFundo, 0, larguraFundo, 700)

    // FADE ENTRE FASES
    if (emTransicao) {
        let proximosFundos

        if (proximaFase === 2) {
            proximosFundos = [fundoImg3, fundoImg4]
        } else if (proximaFase === 3) {
            proximosFundos = [fundoImg5, fundoImg6]
        }

        if (proximosFundos) {
            des.globalAlpha = alphaFade
            des.drawImage(proximosFundos[0], fundoX, 0, larguraFundo, 700)
            des.drawImage(proximosFundos[1], fundoX + larguraFundo, 0, larguraFundo, 700)
        }
    }

    des.globalAlpha = 1
}

//CONTROLA DESENHO DO JOGO
function desenharJogo() {
    desenha()
    desenharBarra()
    desenharVidas()
}

function desenharGameOver() {

    des.drawImage(gameOverImg, 0, 0, tela.width, tela.height)

    des.fillStyle = "rgba(0, 0, 0, 0.5)"
    des.fillRect(0, 0, tela.width, tela.height)

    des.fillStyle = "#fff"
    des.font = "60px Arial"
    des.textAlign = "center"
    des.fillText("GAME OVER", tela.width / 2, 200)

    des.font = "30px Arial"
    des.fillText("Pontuação total: " + pontosTotal, tela.width / 2, 280)

    des.font = "22px Arial"
    des.fillText("Pressione R para reiniciar", tela.width / 2, 330)

    des.font = "22px Arial"
    des.fillText("Pressione V para voltar ao início", tela.width / 2, 370)

    des.textAlign = "start"
}

function desenharVitoria() {

    des.drawImage(vitoriaImg, 0, 0, tela.width, tela.height)

    des.fillStyle = "rgba(0, 0, 0, 0.5)"
    des.fillRect(0, 0, tela.width, tela.height)

    des.fillStyle = "#fff"
    des.font = "60px Arial"
    des.textAlign = "center"
    des.fillText("Você Ganhou!!", tela.width / 2, 200)

    des.font = "30px Arial"
    des.fillText("Pontuação total: " + pontosTotal, tela.width / 2, 280)

    des.font = "22px Arial"
    des.fillText("Pressione R para reiniciar", tela.width / 2, 330)

    des.font = "22px Arial"
    des.fillText("Pressione V para voltar ao início", tela.width / 2, 370)

    des.textAlign = "start"
}

function reiniciarJogo() {
    vidas = 4
    galhosColetados = 0
    gameOver = false
    venceu = false
    pontosTotal = 0

    fase = 1
    furao.vel = 5

    furao.pontos = 0
    furao.maxPontos = pontosPorFase(fase)

    furao.x = 10
    furao.y = 520

    frutasLista.forEach(f => f.recomeca())
    galhosLista.forEach(g => {
        g.recomeca()
        g.podeColidir = true
    })
}

function main() {

    des.clearRect(0, 0, 1200, 700)

    desenharFundo()

    if (!gameOver && !venceu) {
        atualiza()
    }

    if (!gameOver && !venceu) {
        desenharJogo()
    } else if (gameOver) {
        desenharGameOver()
    } else if (venceu) {
        desenharVitoria()
    }

    requestAnimationFrame(main)
}

main()