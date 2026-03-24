const tela = document.getElementById("des")
const des = tela.getContext("2d")

const CHAO = 580

function posicaoFruta() {
    return CHAO - Math.random() * 150
}

const frutasLista = [
    new Frutas(1200, posicaoFruta(), 45, 25, './img/morango.png'),
    new Frutas(1400, posicaoFruta(), 45, 25, './img/abacaxi.png'),
    new Frutas(1600, posicaoFruta(), 45, 25, './img/banana.png'),
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
fundoImg2.src = "./img/fundo2.png"

let dx = 0
let fundoX = 0
let fundoAtual = 0

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

function pontuacao() {
    frutasLista.forEach(f => {
        if (furao.point(f)) {
            furao.pontos += 5
            f.recomeca()
        }
    })
}

function desenha() {

    galhosLista.forEach(g => g.des_galhos())

    frutasLista.forEach(f => f.des_fruta())

    furao.desenhar(des)
}

function atualiza() {
    furao.atualizar(dx)

    galhosLista.forEach(g => g.mov_galho(dx))
    frutasLista.forEach(f => f.mov_fruta(dx))

    // colisão frutas
    frutasLista.forEach(f => {
        if (furao.colid(f)) {
            f.recomeca()
            furao.pontos += 5
        }
    })

    // colisão galhos
    galhosLista.forEach(g => {
        if (furao.colid(g)) {
            console.log("bateu no galho!")
            g.recomeca()
        }
    })
}

function main() {

    //LIMPA A TELA
    des.clearRect(0, 0, 1200, 700)

    //MOVE O FUNDO NA MESMA VELOCIDADE QUE O FURAO
    fundoX -= dx * furao.vel

    //FUNDO "INFINITO"
    let larguraFundo = 1200

   // troca de fundo
    if (fundoX <= -larguraFundo) {
        fundoX = 0
        fundoAtual = fundoAtual === 0 ? 1 : 0
    }

    // desenha os dois fundos
    if (fundoAtual === 0) {
        des.drawImage(fundoImg, fundoX, 0, larguraFundo, 700)
        des.drawImage(fundoImg2, fundoX + larguraFundo, 0, larguraFundo, 700)
    } else {
        des.drawImage(fundoImg2, fundoX, 0, larguraFundo, 700)
        des.drawImage(fundoImg, fundoX + larguraFundo, 0, larguraFundo, 700)
    }

    desenha()
    atualiza()
    pontuacao()

    requestAnimationFrame(main)
}

main()