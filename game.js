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

let dx = 0
let fundoX = 0
let fundoAtual = 0
let estado = "menu"
let estado1 = "inicio"
let modoJogo = 1
let personagemEscolhido = 1

let indexFundo = 0

let fase = 1
let emTransicao = false
let alphaFade = 0
let proximaFase = 1
let pontosTotal = 0

furao.maxPontos = pontosPorFase(fase)

let vidas = 4
let galhosColetados = 0
let gameOver = false
let venceu = false
let pausado = false
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

    if ((gameOver || venceu) && (e.key == "r" || e.key == "R")) {
        reiniciarJogo()
    }
    if (e.key == "Escape") {
        pausado = !pausado
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
    if (pausado) {

        if (e.key == "1") {
            pausado = false
        }

        if (e.key == "2") {
            pausado = false
            reiniciarJogo()
        }

        if (e.key == "3") {
            window.location.href = "./index.html"
        }

    }

})

tela.addEventListener("click", (e) => {

    let rect = tela.getBoundingClientRect()
    let mouseX = e.clientX - rect.left
    let mouseY = e.clientY - rect.top

    // ================= MENU =================
    if (estado === "menu") {

        // botão ESCOLHER
        if (
            mouseX >= 300 && mouseX <= 500 &&
            mouseY >= 300 && mouseY <= 380
        ) {
            estado = "selecao"
            return
        }

        // botão VOLTAR
        if (
            mouseX >= 300 && mouseX <= 500 &&
            mouseY >= 450 && mouseY <= 530
        ) {
            estado1 = "inicio" 
            return
        }
    }

    // ================= SELEÇÃO =================
    else if (estado === "selecao") {

        // 1 jogador
        if (
            mouseX >= 300 && mouseX <= 500 &&
            mouseY >= 180 && mouseY <= 220
        ) {
            modoJogo = 1
        }

        // 2 jogadores
        if (
            mouseX >= 300 && mouseX <= 500 &&
            mouseY >= 240 && mouseY <= 280
        ) {
            modoJogo = 2
        }

        // personagem 1
        if (
            mouseX >= 300 && mouseX <= 500 &&
            mouseY >= 320 && mouseY <= 360
        ) {
            personagemEscolhido = 1
        }

        // personagem 2
        if (
            mouseX >= 300 && mouseX <= 500 &&
            mouseY >= 380 && mouseY <= 420
        ) {
            personagemEscolhido = 2
        }

        // botão COMEÇAR
        if (
            mouseX >= 300 && mouseX <= 500 &&
            mouseY >= 450 && mouseY <= 520
        ) {
            estado = "jogo"
        }
    }

    // ================= JOGO =================
    else if (estado === "jogo") {

        // 👉 teu botão de pause (igual já tava)
        let w = 50
        let h = 50
        let x = tela.width - w - 20
        let y = tela.height - h - 20

        if (
            mouseX >= x &&
            mouseX <= x + w &&
            mouseY >= y &&
            mouseY <= y + h
        ) {
            pausado = !pausado
        }
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
        let pontosGanhos = 3
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
            emTransicao = false
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
    desenharBotaoPause()
}

function desenharMenu() {
    // fundo
    des.drawImage(menuImg, 0, 0, tela.width, tela.height)

    // título 
    des.fillStyle = "#6d4c41"
    des.font = "bold 70px Arial"
    des.textAlign = "center"
    des.fillText("Pequenas patinhas", tela.width / 2, 180)

    // --- BOTÃO ESCOLHER ---
    desenharRetanguloArredondado(295, 305, 210, 90, 20)
    des.fillStyle = "rgba(0,0,0,0.15)"
    des.fill()

    // corpo do botão
    desenharRetanguloArredondado(300, 300, 200, 80, 20)
    des.fillStyle = "#e29578"
    des.fill()

    // brilho superior
    des.fillStyle = "rgba(255,255,255,0.25)"
    desenharRetanguloArredondado(300, 300, 200, 40, 20)
    des.fill()

    // texto
    des.fillStyle = "#fff1e6"
    des.font = "bold 30px Arial"
    des.fillText("ESCOLHER", tela.width / 2, 350)

    // --- BOTÃO VOLTAR ---
    // sombra
    desenharRetanguloArredondado(295, 455, 210, 90, 20)
    des.fillStyle = "rgba(0,0,0,0.15)"
    des.fill()

    // corpo do botão
    desenharRetanguloArredondado(300, 450, 200, 80, 20)
    des.fillStyle = "#a68a64"
    des.fill()

    des.fillStyle = "rgba(255,255,255,0.2)"
    desenharRetanguloArredondado(300, 450, 200, 40, 20)
    des.fill()

    // texto
    des.fillStyle = "#fff1e6"
    des.font = "bold 30px Arial"
    des.fillText("VOLTAR", tela.width / 2, 500)

    des.textAlign = "start"
}

function desenharSelecao() {

    // fundo
    des.fillStyle = "#1a1a2e"
    des.fillRect(0, 0, tela.width, tela.height)

    des.textAlign = "center"

    // título
    des.fillStyle = "#ff8fab"
    des.font = "50px Arial"
    des.fillText("Configuração", tela.width / 2, 120)

    des.font = "26px Arial"

    // ===== MODO =====
    des.fillStyle = "#fff"
    des.fillText("Modo de jogo", tela.width / 2, 200)

    // 1 jogador
    desenharRetanguloArredondado(300, 220, 200, 40, 15)
    des.fillStyle = modoJogo === 1 ? "#ff8fab" : "#333"
    des.fill()
    des.fillStyle = "#fff"
    des.fillText("1 Jogador", tela.width / 2, 248)

    // 2 jogadores
    desenharRetanguloArredondado(300, 270, 200, 40, 15)
    des.fillStyle = modoJogo === 2 ? "#ff8fab" : "#333"
    des.fill()
    des.fillStyle = "#fff"
    des.fillText("2 Jogadores", tela.width / 2, 298)

    // ===== PERSONAGEM =====
    des.fillStyle = "#fff"
    des.fillText("Personagem", tela.width / 2, 360)

    // furão 1
    desenharRetanguloArredondado(300, 380, 200, 40, 15)
    des.fillStyle = personagemEscolhido === 1 ? "#ff8fab" : "#333"
    des.fill()
    des.fillStyle = "#fff"
    des.fillText("Furão 1", tela.width / 2, 408)

    // furão 2
    desenharRetanguloArredondado(300, 430, 200, 40, 15)
    des.fillStyle = personagemEscolhido === 2 ? "#ff8fab" : "#333"
    des.fill()
    des.fillStyle = "#fff"
    des.fillText("Furão 2", tela.width / 2, 458)

    // ===== BOTÃO COMEÇAR =====
    desenharRetanguloArredondado(300, 500, 200, 60, 20)
    des.fillStyle = "#ff4d6d"
    des.fill()

    // brilho
    des.fillStyle = "rgba(255,255,255,0.3)"
    desenharRetanguloArredondado(300, 500, 200, 30, 20)
    des.fill()

    des.fillStyle = "#fff"
    des.font = "28px Arial"
    des.fillText("COMEÇAR", tela.width / 2, 538)

    des.textAlign = "start"
}

function desenharPause() {

    // fundo escuro
    des.fillStyle = "rgba(0, 0, 0, 0.6)"
    des.fillRect(0, 0, tela.width, tela.height)

    des.fillStyle = "#fff"
    des.textAlign = "center"

    des.font = "50px Arial"
    des.fillText("PAUSADO", tela.width / 2, 150)

    // botões (texto)
    des.font = "28px Arial"

    des.fillText("1 - Voltar ao jogo", tela.width / 2, 250)
    des.fillText("2 - Recomeçar", tela.width / 2, 300)
    des.fillText("3 - Voltar ao início", tela.width / 2, 350)

    des.textAlign = "start"
}

function desenharBotaoPause() {

    let w = 50
    let h = 50
    let x = tela.width - w - 20
    let y = tela.height - h - 20

    // fundo
    des.fillStyle = "rgba(0,0,0,0.5)"
    des.fillRect(x, y, w, h)

    des.fillStyle = "#fff"

    if (!pausado) {
        // 🔥 PAUSE (||)
        des.fillRect(x + 14, y + 10, 6, 30)
        des.fillRect(x + 30, y + 10, 6, 30)
    } else {
        // ▶ PLAY (triângulo)
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

    // ================= MENU =================
    if (estado === "menu") {
        desenharMenu()
    }

    // ================= SELEÇÃO =================
    else if (estado === "selecao") {
        desenharSelecao()
    }

    // ================= JOGO =================
    else if (estado === "jogo") {

        desenharFundo()

        if (!gameOver && !venceu && !pausado) {
            atualiza()
        }

        if (!gameOver && !venceu) {
            desenharJogo()

            if (pausado) {
                desenharPause()
            }
        } else if (gameOver) {
            desenharGameOver()
        } else if (venceu) {
            desenharVitoria()
        }
    }

    requestAnimationFrame(main)
}

main()