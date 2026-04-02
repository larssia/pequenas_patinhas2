# 🐾 Pequenas Patinhas

 Jogo de plataforma 2D com tema fofo, desenvolvido com HTML5 Canvas, CSS e JavaScript puro.

🔗 **[Jogar agora](https://pequenas-patinhas.vercel.app)**

---

## 📖 Sobre o Projeto

**Pequenas Patinhas** é um jogo de plataforma desenvolvido como projeto escolar pela estudante Larissa Bernardi, do último ano do Ensino Médio da Escola SESI de Tijucas. A inspiração veio de uma imagem de um furão, que deu origem ao personagem principal e ao tema fofo do jogo.

---

## 🎮 Como Jogar

### Controles

| Tecla | Ação |
|---|---|
| W ou ↑ | Pular |
| D ou → | Andar para frente |
| R | Reiniciar (após Game Over ou Vitória) |
| V | Voltar ao início (após Game Over ou Vitória) |
| ESC | Pausar / Retomar |

### Regras

🍓 Colete frutas para ganhar **+3 pontos** por fruta
⚠️ Evite frutas podres e lixo — cada colisão tira **-2 pontos**
❤️ Você começa com **4 vidas** — a cada **5 colisões**, perde 1 vida
🚀 O jogo possui **3 fases**, cada uma com velocidade maior
💀 Se perder todas as vidas, é **Game Over**
🏆 Complete as 3 fases para **vencer**!

### Modo Multiplayer (2 Jogadores)

| Jogador | Pular | Andar |
|---|---|---|
| P1 | W | D |
| P2 | ↑ | → |

No modo 2 jogadores, vence quem acumular mais pontos ao final das 3 fases. Em caso de empate, é declarado um 🤝.

---

## 🐾 Personagens

| Personagem | Nome |
|---|---|
| 🐻 | Poohret |
| 🐯 | Tigret |
| 🦡 | Musti |

Os personagens são selecionados antes de iniciar a partida, na tela de personalização.

---

## 🗂️ Estrutura do Projeto

pequenas_patinhas2/
│
├── index.html            # Tela inicial (menu principal)
├── game.html             # Tela do jogo (canvas)
├── instrucoes.html       # Tela de instruções
├── sobre.html            # Tela sobre a autora
│
├── style.css             # Estilos da tela inicial
├── game.css              # Estilos da tela do jogo
├── instrucoes.css        # Estilos da tela de instruções
├── sobre.css             # Estilos da tela sobre
│
├── game.js               # Lógica principal do jogo
│
├── models/
│   └── Furao.js          # Classe dos personagens/objetos do jogo
│
├── img/                  # Sprites, fundos e imagens do jogo
├── sons/                 # Efeitos sonoros e música de fundo
│   ├── frutas.mp3
│   ├── fundo.mp3
│   ├── galhos.mp3
│   ├── passos.mp3
│   └── pulo.mp3
│
└── Uml/                  # Diagramas UML do projeto
    ├── caso_uso.png
    ├── diagrama_classes.png
    └── diagrama_sequencia.png

---

## ⚙️ Funcionalidades Técnicas

**Renderização via Canvas** — todo o jogo é desenhado com a API canvas 2D do HTML5
**Sistema de fases** com transição suave via globalAlpha (fade entre backgrounds)
**Fundo com scroll infinito** — alternância de imagens sincronizada com o movimento do personagem
**Detecção de colisão** com cooldown de 300ms para evitar colisões múltiplas no mesmo obstáculo
**Sistema de pontuação por fase** — meta de pontos aumenta a cada fase (20 → 40 → 60)
**Velocidade progressiva** — vel = 5 na fase 1, 7 na fase 2, 10 na fase 3
**Som com cloneNode()** — permite efeitos sonoros sobrepostos sem corte
**Pause** via teclado (ESC) ou botão clicável na tela
**Suporte a 1 ou 2 jogadores** com barras de progresso e vidas independentes
 

---

## 🛠️ Tecnologias Utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 👩‍💻 Autora

Feito com ❤️ por **Larissa Bernardi**
Estudante da Escola SESI de Tijucas — Ensino Médio