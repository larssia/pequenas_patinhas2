const tela = document.getElementById("des")
const des = tela.getContext("2d")

const frutas = new Frutas(1300, 325, 80, 50, './img/morango.png')
const frutas2 = new Frutas(1300, 325, 80, 50, './img/abacaxi.png')
const frutas3 = new Frutas(1300, 325, 80, 50, './img/banana.png')
const frutas4 = new Frutas(1300, 325, 80, 50, './img/maca.png')
const furao = new Furao(10, 530, 150, 100, './img/mov_furao.png')

const fundoImg = new Image()
fundoImg.src = "./img/fundo.png"

let dx = 0
let fundoX = 0

//MOVIMENTA O FURAO KKK
document.addEventListener("keydown", (e) => {

    if (e.key == "w" || e.key == "ArrowUp") {
        furao.pular()
    }

    if (e.key == "a" || e.key == "ArrowLeft") {
        dx = -1
    }

    if (e.key == "d" || e.key == "ArrowRight") {
        dx = 1
    }

})

//PARA O MOVIMNETO DO FURAO
document.addEventListener("keyup", (e) => {

    if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
        dx = 0
    }

})


function desenha() {
    frutas.des_fruta()
    frutas2.des_fruta()
    frutas3.des_fruta()
    frutas4.des_fruta()

    furao.desenhar(des)
}

function atualiza() {
    furao.atualizar(dx)

    frutas.mov_fruta()
    frutas2.mov_fruta()
    frutas3.mov_fruta()
    frutas4.mov_fruta()

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
    let x = fundoX % larguraFundo

    des.drawImage(fundoImg, x, 0, larguraFundo, 700)
    des.drawImage(fundoImg, x + larguraFundo, 0, larguraFundo, 700)

    desenha()
    atualiza()

    requestAnimationFrame(main)
}

main()