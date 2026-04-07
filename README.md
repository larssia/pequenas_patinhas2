# 🐾 Pequenas Patinhas

 <img width="432" height="577" alt="logo" src="https://github.com/user-attachments/assets/a7b72a80-ebd1-4225-b072-0456c592622f" />

 Jogo de plataforma 2D com tema fofo, desenvolvido com HTML5 Canvas, CSS e JavaScript puro.

 <img width="432" height="577" alt="logo" src="https://github.com/user-attachments/assets/a7b72a80-ebd1-4225-b072-0456c592622f" />


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
```bash
pequenas_patinhas2/
│
├── 📄 index.html            # Tela inicial (menu principal)
├── 📄 game.html             # Tela do jogo (canvas)
├── 📄 instrucoes.html       # Tela de instruções
├── 📄 sobre.html            # Tela sobre a autora
│
├── 🎨 style.css             # Estilos da tela inicial
├── 🎨 game.css              # Estilos da tela do jogo
├── 🎨 instrucoes.css        # Estilos das instruções
├── 🎨 sobre.css             # Estilos da tela sobre
│
├── ⚙️ game.js               # Lógica principal do jogo
│
├── 📁 models/
│   └── 🧩 Furao.js          # Classe dos personagens e objetos
│
├── 📁 img/
│   └── 🖼️ (sprites, fundos e imagens do jogo)
│
├── 📁 sons/
│   ├── 🔊 frutas.mp3
│   ├── 🔊 fundo.mp3
│   ├── 🔊 galhos.mp3
│   ├── 🔊 passos.mp3
│   └── 🔊 pulo.mp3
│
└── 📁 Uml/
    ├── 📊 caso_uso.png
    ├── 📊 diagrama_classes.png
    └── 📊 diagrama_sequencia.png
```
---

## 📋 Requisitos do Sistema

---

## 🔹 Requisitos Funcionais

| Código | Descrição |
|--------|----------|
| **RF01** | O jogador deve poder **pular e se movimentar para frente** durante o jogo. |
| **RF02** | Cada jogador inicia com **4 vidas**. A cada 5 colisões com obstáculos, perde 1 vida. |
| **RF03** | O jogo deve possuir um **sistema de pontuação**, exibido na tela. |
| **RF04** | Devem existir **frutas coletáveis** que concedem **+3 pontos**. |
| **RF05** | Devem existir **obstáculos** que causam **-2 pontos** e contam como colisão. |
| **RF06** | O jogo deve possuir **3 fases**, com aumento de dificuldade conforme a pontuação. |
| **RF07** | O jogo deve permitir **modo 1 jogador e 2 jogadores**. |
| **RF08** | O sistema deve conter as telas: **Menu, Seleção de Personagem, Jogo, Pausa, Vitória e Game Over**. |
| **RF09** | Deve existir uma tela **"Sobre"** com informações da desenvolvedora. |
| **RF10** | O jogador deve poder **reiniciar ou voltar ao menu** após o fim da partida. |
| **RF11** | O jogo deve possuir **efeitos sonoros** (pulo, coleta, colisão, etc.). |

---

## ⚙️ Regras de Negócio

| Código | Descrição |
|--------|----------|
| **RN01** | A dificuldade aumenta a cada fase, com **maior velocidade do jogo**. |
| **RN02** | Cada fase deve possuir um **cenário diferente**. |
| **RN03** | O jogador vence ao completar a **fase 3 com pelo menos 1 vida**. |
| **RN04** | O jogo termina em **Game Over** quando as vidas chegam a 0. |
| **RN05** | No modo 2 jogadores, vence quem tiver **mais pontos ao final**. |
| **RN06** | O jogo deve possuir uma **seção de instruções** explicando controles e regras. |

---

## 🛠️ Requisitos Não Funcionais

| Código | Descrição |
|--------|----------|
| **RNF01** | O jogo deve ser desenvolvido em **JavaScript puro**, sem uso de frameworks. |
| **RNF02** | Deve rodar diretamente no navegador usando **HTML5 Canvas**. |
| **RNF03** | A interface deve ser adaptada para **telas de computador**. |
| **RNF04** | O jogo deve manter boa performance, com execução fluida (≈ **60 FPS**). |

---
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
