const tela = document.getElementById("des")
const des = tela.getContext("2d")

const CHAO = 580

function posicaoFruta() {
    let alturas = [
        CHAO - 40,  // chão
        CHAO - 120, // médio
        CHAO - 200  // alto (pulo)
    ]

    return alturas[Math.floor(Math.random() * alturas.length)]
}

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

const furao = new Furao(10, 520, 200, 120, './img/mov_furao.png')

const fundoImg = new Image()
fundoImg.src = "./img/fundo.png"

const fundoImg2 = new Image()
fundoImg2.src = "./img/fundo_larissa.jpg"

const fundoImg3 = new Image()
fundoImg3.src = "./img/fundo2.png"

const fundoImg4 = new Image()
fundoImg4.src = "./img/fundo3.png"

const gameOverImg = new Image()
gameOverImg.src = "./img/gameover.png"

let dx = 0
let fundoX = 0
let fundoAtual = 0

let fase = 1
let emTransicao = false
let alphaFade = 0
let proximaFase = 1

let vidas = 3
let galhosColetados = 0
let gameOver = false

//MOVIMENTA O FURAO KKK
document.addEventListener("keydown", (e) => {

    if (e.key == "w" || e.key == "W" || e.key == "ArrowUp") {
        furao.pular()
    }

    if (e.key == "d" || e.key == "D" || e.key == "ArrowRight") {
        dx = 1
    }if (gameOver && (e.key == "r" || e.key == "R")) {
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
    furao.atualizar(dx)

    galhosLista.forEach(g => g.mov_galho(dx))
    frutasLista.forEach(f => f.mov_fruta(dx))

    frutasLista.forEach(f => {
        if (furao.colid(f)) {
            f.recomeca()
            furao.pontos = Math.min(furao.maxPontos, furao.pontos + 3)
        }
    })

    galhosLista.forEach(g => {
        if (furao.colid(g)) {
            g.recomeca()
    
            galhosColetados++
    
            if (galhosColetados >= 5) {
                vidas--
                galhosColetados = 0
            }
    
            furao.pontos = Math.max(0, furao.pontos - 2)
        }
    })

    //mudar fase
    if (furao.pontos >= furao.maxPontos && !emTransicao) {
        emTransicao = true
        alphaFade = 0
        proximaFase = fase + 1
    }

    if (vidas <= 0) {
        gameOver = true
    }
}

//DESENHAR VIDAS
function desenharVidas() {
    let y = 60
    let espacamento = 30

    // começa da direita
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

    // FUNDO (rosa clarinho)
    des.fillStyle = "#ffd6e0"
    desenharRetanguloArredondado(x, y, larguraMax, altura, 15)
    des.fill()

    // BARRA (rosa mais forte)
    des.fillStyle = "#ff8fab"
    desenharRetanguloArredondado(x, y, larguraMax * progresso, altura, 15)
    des.fill()

    // BRILHO (detalhe fofo)
    des.fillStyle = "rgba(255,255,255,0.4)"
    desenharRetanguloArredondado(x, y, larguraMax * progresso, altura / 2, 15)
    des.fill()

    // BORDA
    des.strokeStyle = "#ff4d6d"
    des.lineWidth = 2
    desenharRetanguloArredondado(x, y, larguraMax, altura, 15)
    des.stroke()

    // TEXTO
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

    if (fundoX <= -larguraFundo) {
        fundoX = 0
    }

    // ESCOLHE FUNDOS PELA FASE
    let fundo1, fundo2

    if (fase === 1) {
        fundo1 = fundoImg
        fundo2 = fundoImg2
    } else {
         fundo1 = fundoImg3
         fundo2 = fundoImg4 
     }

    // desenha infinito
    des.drawImage(fundo1, fundoX, 0, larguraFundo, 700)
    des.drawImage(fundo2, fundoX + larguraFundo, 0, larguraFundo, 700)
}


//CONTROLA DESENHO DO JOGO
function desenharJogo() {
    if (!emTransicao) {
        desenha()
        desenharBarra()
        desenharVidas()
    }
}

function desenharGameOver() {
    
    des.drawImage(gameOverImg, 0, 0, tela.width, tela.height)

    // camada escura por cima
    des.fillStyle = "rgba(0, 0, 0, 0.5)"
    des.fillRect(0, 0, tela.width, tela.height)

    // título GAME OVER
    des.fillStyle = "#fff"
    des.font = "60px Arial"
    des.textAlign = "center"
    des.fillText("GAME OVER", tela.width / 2, 200)

    // pontuação
    des.font = "30px Arial"
    des.fillText(
        "Pontuação: " + furao.pontos,
        tela.width / 2,
        280
    )

    // instrução
    des.font = "22px Arial"
    des.fillText(
        "Pressione R para reiniciar",
        tela.width / 2,
        330
    )

    // voltar alinhamento padrão
    des.textAlign = "start"
}

function reiniciarJogo() {
    vidas = 3
    galhosColetados = 0
    gameOver = false

    furao.pontos = 0
    furao.x = 10
    furao.y = 520

    frutasLista.forEach(f => f.recomeca())
    galhosLista.forEach(g => g.recomeca())
}

function main() {

    des.clearRect(0, 0, 1200, 700)

    desenharFundo()

    if (!gameOver) {
        desenharJogo()
        atualiza()
    } else {
        desenharGameOver()
    }
    requestAnimationFrame(main)
}

main()