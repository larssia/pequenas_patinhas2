const tela = document.getElementById("des")
const des = tela.getContext("2d")

const fundoImg = new Image()
fundoImg.src = "./img/fundo.png"

const furao = new Obj(20, 525)

let dx = 0
let fundoX = 0

//MOVIMENTA O FURAO KKK
document.addEventListener("keydown", (e) => {

    if (e.key == "ArrowUp") {
        furao.pular()
    }

    if (e.key == "ArrowLeft") {
        dx = -1
    }

    if (e.key == "ArrowRight") {
        dx = 1
    }

})

//PARA O MOVIMNETO DO FURAO
document.addEventListener("keyup", (e) => {

    if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
        dx = 0
    }

})


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

    furao.atualizar(dx)
    furao.desenhar(des)

    requestAnimationFrame(main)
}

main()