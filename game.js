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

let dx = 0
let fundoX = 0
let fundoAtual = 0

let fase = 1
let emTransicao = false
let alphaFade = 0
let proximaFase = 1

//MOVIMENTA O FURAO KKK
document.addEventListener("keydown", (e) => {

    if (e.key == "w" || e.key == "W" || e.key == "ArrowUp") {
        furao.pular()
    }

    if (e.key == "d" || e.key == "D" || e.key == "ArrowRight") {
        dx = 1
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
            furao.pontos = Math.max(0, furao.pontos - 2)
        }
    })

    //mudar fase
    if (furao.pontos >= furao.maxPontos && !emTransicao) {
        emTransicao = true
        alphaFade = 0
        proximaFase = fase + 1
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
        fundo2 = fundoImg4 // usa o mesmo pra repetir
    }

    // desenha infinito
    des.drawImage(fundo1, fundoX, 0, larguraFundo, 700)
    des.drawImage(fundo2, fundoX + larguraFundo, 0, larguraFundo, 700)
}

//TRANSICAO
function atualizarTransicao() {
    if (!emTransicao) return

    alphaFade += 0.02

    // tela branca
    des.fillStyle = "rgba(255,255,255," + alphaFade + ")"
    des.fillRect(0, 0, 1200, 700)

    // quando termina o fade
    if (alphaFade >= 1) {
        fase = proximaFase
        furao.pontos = 0

        frutasLista.forEach(f => f.vel += 1)
        galhosLista.forEach(g => g.vel += 1)

        fundoX = 0
        alphaFade = 0
        emTransicao = false
    }
}

//CONTROLA DESENHO DO JOGO
function desenharJogo() {
    if (!emTransicao) {
        desenha()
        desenharBarra()
    }
}

function main() {

    //LIMPA A TELA
    des.clearRect(0, 0, 1200, 700)

    desenharFundo()
    desenharJogo()
    atualiza()
    atualizarTransicao()

    requestAnimationFrame(main)
}

main()