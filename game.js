const canvas = document.getElementById("des")
const ctx = canvas.getContext("2d")

const fundo = new Image()
fundo.src = "./img/fundo.png"

let fundoX = 0
 
function desenhar(){
    ctx.clearRect(0,0,canvas.width,canvas.height)

    ctx.drawImage(fundo, fundoX, 0, canvas.width, canvas.height)
}

document.addEventListener("keydown", function(e){

    if(e.key === "ArrowRight"){
        fundoX -= 5
    }

    if(e.key === "ArrowLeft"){
        fundoX += 5
    }

})

function loop(){
    desenhar()
    requestAnimationFrame(loop)
}

loop()