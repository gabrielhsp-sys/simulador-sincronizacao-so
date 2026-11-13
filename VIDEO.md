# Roteiro do vídeo (5 a 7 minutos)

Vídeo de explicação e demonstração do simulador, na ordem da tela. Tempos aproximados (cerca de
6 min). As sequências de teclas são as mesmas do roteiro da apresentação e foram conferidas na
lógica do simulador.

## Checklist antes de gravar

- [ ] Feche abas, programas e notificações (no Windows: ative "Não incomodar").
- [ ] Abra o simulador num navegador limpo, de preferência numa janela anônima, para o tutorial
      aparecer como na primeira visita.
- [ ] Zoom do navegador em 100% (`Ctrl+0`). Use **Apresentar** para a fonte maior.
- [ ] Tela cheia: o botão **Apresentar** já pede; se não entrar, use `F11`.
- [ ] Teste o microfone: grave 10 segundos e ouça.
- [ ] Faça uma **partida de teste** inteira, seguindo este roteiro, antes de gravar valendo.
- [ ] Use o gravador de tela que você já tem (no Windows, a Barra de Jogos abre com `Win+G`).
- [ ] Deixe este roteiro aberto noutra tela ou impresso.

Teclas: `1`, `2`, `3`… executam o processo dessa posição; `Z` volta um passo; `R` reinicia;
`` ` `` (crase) abre o terminal. No teclado ABNT2 a crase é `Shift` + a tecla do acento agudo.

## Roteiro

| Tempo | O que mostrar | O que falar |
|---|---|---|
| 0:00–0:30 | Tela inicial com o tutorial aberto. | "Este é o simulador de sincronização, comunicação e deadlock do nosso projeto integrador. É um único arquivo HTML que roda no navegador, inclusive sem internet." |
| 0:30–1:00 | Avançar as 3 telas do tutorial e clicar em **Começar**. Mostrar a barra de controles e um cartão de processo. | "Aqui eu sou o escalonador: a cada passo escolho qual processo roda, clicando em Executar ou pelas teclas. A linha marcada com ► é a próxima de cada processo, e a linha do tempo mostra a ordem que eu escolhi." |
| 1:00–2:00 | **Nível 1**, sem lock: teclas `1`, `2`, `1`, `2`. Apontar o contador em 1 e a mensagem de atualização perdida. | "`contador++` são dois passos: ler e escrever. Os dois leram 0, os dois escreveram 1, e um incremento sumiu. Isso é uma condição de corrida: depende da intercalação." |
| 2:00–2:40 | **Ajustar**, marcar **Proteger com lock**, **Aplicar e reiniciar**, teclas `1`, `2`, `1`, `2`. Abrir **Como o xv6 e o Linux fazem**. | "Com o spinlock, P1 gira enquanto P0 está na seção crítica. No xv6, `acquire` usa a troca atômica `amoswap` e chama `push_off`, que desliga as interrupções naquela CPU; quem gira é outra CPU. No Linux, o futex tenta pegar o lock no espaço de usuário e só dorme no núcleo se houver disputa." |
| 2:40–3:40 | **Nível 2**: **Ajustar**, versão **Ingênua**, **Aplicar e reiniciar**; teclas `2`, `1`, `1`, `1`, `1`, `1`, `2`, `1`. Apontar o carimbo "Wakeup perdido" e a linha `kernel$ alerta: travado`. | "Este é o buffer circular do pipe do xv6, com `nread`, `nwrite` e PIPESIZE. Na versão ingênua, teste e sleep são passos separados. O consumidor decidiu dormir, o produtor chamou wakeup antes, e o aviso se perdeu: os dois dormem para sempre." |
| 3:40–4:20 | **Ajustar**, versão **Correta**, **Aplicar e reiniciar**: tecla `1` onze vezes, depois `2` quatro vezes. | "No xv6, a condição é testada segurando o lock, e `sleep(&nwrite, &pi->lock)` solta o lock e dorme de uma vez. O produtor dormiu com o buffer cheio, o consumidor leu e o acordou. Nada se perde." |
| 4:20–5:20 | **Nível 3**, padrão: teclas `1`–`5` duas vezes. Apontar o ciclo vermelho no grafo e as condições de Coffman. | "Cada filósofo pegou o garfo da esquerda e espera o da direita. No grafo de alocação aparece o ciclo; como cada garfo é um só, ciclo é deadlock. As quatro condições de Coffman estão presentes." |
| 5:20–6:00 | **Ajustar**, estratégia **Ordem global**, **Aplicar e reiniciar**: teclas `1`–`5`, depois `4` três vezes. | "Com ordem global, todos pegam primeiro o garfo de menor número. F4 espera sem segurar nada, a espera circular não se forma e F3 consegue comer. É a regra que o xv6 segue para locks; no Linux, o lockdep avisa quando alguém foge da ordem." |
| 6:00–6:30 | Abrir **Desafios**, começar o 1.1 e concluí-lo (teclas `1`, `2`, `2`, `1`). Mostrar a janela de resultado. | "Os desafios são opcionais: provocar o bug e depois tentar com a correção. Cada um explica por que aquilo aconteceu." |
| 6:30–7:00 | Apertar `` ` `` (crase): abre o terminal `kernel$`. Digitar `help` e mostrar as categorias; depois `ps`, `glossario deadlock` e, por fim, `forkbomb`. Deixar a animação correr inteira (cerca de 9 s: os processos dobram até 64, as janelas de erro se empilham, a página treme e inverte, a tela escurece e o sistema "reinicia") e fechar no cartão com **Reiniciar o sistema**. | "O simulador também tem um terminal. Os comandos usam os mesmos botões da página: `ps` lista os processos, `step` roda um passo, `glossario` explica um termo. Nada roda de verdade. O `forkbomb` é o jogo do terminal: os processos se copiam até lotar a tabela, que no xv6 tem 64 lugares. Parece que o site caiu, mas é só animação: quando a tabela enche, `fork` devolve −1 e o sistema continua de pé. As simplificações estão no README. Obrigado." |

## Depois de gravar

- [ ] Assista ao vídeo inteiro uma vez: confira se o áudio está claro e se o texto da tela dá para
      ler.
- [ ] Se passar de 7 minutos, corte o trecho dos desafios (6:00–6:30). No terminal, dá para
      pular `ps` e `glossario` e ir direto ao `forkbomb`. O fork bomb leva cerca de 9 s até o
      cartão; não feche antes, ou o reboot não aparece no vídeo.
