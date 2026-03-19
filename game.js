const tela = document.getElementById("des")
const des = tela.getContext("2d")

const frutas = new Frutas(1000, 350, 45, 25, './img/morango.png')
const frutas2 = new Frutas(1000, 350, 45, 25, './img/abacaxi.png')
const frutas3 = new Frutas(1000, 350, 45, 25, './img/banana.png')
const frutas4 = new Frutas(1000, 350, 45, 25, './img/maca.png')
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
    if (furao.point(frutas)) {
        furao.pontos += 5
        frutas.recomeca()
    }
    if (furao.point(frutas2)) {
        furao.pontos += 5
        frutas.recomeca()
    }
    if (furao.point(frutas3)) {
        furao.pontos += 5
        frutas.recomeca()
    }
    if (furao.point(frutas4)) {
        furao.pontos += 5
        frutas.recomeca()
    }
}


function desenha() {
    frutas.des_fruta()
    frutas2.des_fruta()
    frutas3.des_fruta()
    frutas4.des_fruta()

    furao.desenhar(des)
}

function atualiza() {
    furao.atualizar(dx)

    frutas.mov_fruta(dx)
    frutas2.mov_fruta(dx)
    frutas3.mov_fruta(dx)
    frutas4.mov_fruta(dx)

    // colisão
    if (furao.colid(frutas)) {
        frutas.recomeca()
    }

    if (furao.colid(frutas2)) {
        frutas2.recomeca()
    }

    if (furao.colid(frutas3)) {
        frutas3.recomeca()
    }

    if (furao.colid(frutas4)) {
        frutas4.recomeca()
    }
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