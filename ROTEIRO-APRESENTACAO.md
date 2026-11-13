# Roteiro da apresentação ao vivo (5 minutos)

Para quem vai apresentar o simulador em aula. Não é preciso ter construído o simulador: cada
trecho diz o que clicar e o que dizer. As sequências de teclas foram conferidas na lógica do
simulador.

## Antes de começar (fora do tempo)

1. Abra o `index.html` (ou o link do GitHub Pages) no navegador do projetor.
2. Se o tutorial aparecer, clique em **Pular tutorial**.
3. Clique em **Apresentar** (ou tecla `P`): a fonte aumenta, a tela fica cheia e o código e o histórico
   saem da tela para sobrar espaço.
4. Teste uma tecla e depois clique em **Reiniciar**.

Teclas: `1`, `2`, `3`… executam o processo dessa posição. `Z` volta um passo, `R` reinicia.

## 0:00–0:30 — Abertura

**Dizer:** "Este simulador mostra sincronização, comunicação e deadlock em três níveis. Aqui eu sou
o **escalonador**: a cada passo escolho qual processo roda. O resultado depende da ordem que eu
escolher, e a linha do tempo embaixo mostra essa ordem."

## 0:30–1:45 — Nível 1: contador compartilhado

Na aba **1. Contador**, configuração padrão (2 processos, 2 incrementos, sem lock).

| Fazer | Dizer |
|---|---|
| Tecla `1` (P0 lê 0), tecla `2` (P1 lê 0) | "Os dois leram 0. `contador++` são dois passos: ler e escrever." |
| Tecla `1` (P0 escreve 1), tecla `2` (P1 escreve 1) | "P1 escreveu 1 por cima: o incremento de P0 sumiu. Atualização perdida, uma condição de corrida." |
| Clicar em **Ajustar**, marcar **Proteger com lock** e clicar em **Aplicar e reiniciar** | "Agora com spinlock: `acquire` usa uma troca atômica, o `amoswap` do xv6." |
| Teclas `1`, `2`, `1`, `2` | "P1 encontrou o lock ocupado e **girou**: gastou o passo sem avançar. A leitura e a escrita de P0 não podem mais ser separadas." |

Se perguntarem: no xv6, `acquire` desliga as interrupções (`push_off`) naquela CPU, e quem gira é
outra CPU. Aqui cada processo faz o papel de um fluxo noutra CPU.

## 1:45–3:15 — Nível 2: produtor-consumidor (pipe do xv6)

Na aba **2. Pipe**, clique em **Ajustar**, escolha a versão **Ingênua** e clique em **Aplicar e
reiniciar** (PIPESIZE 2, 3 itens). P1 é o produtor (tecla `1`), C1 o consumidor (tecla `2`).

| Fazer | Dizer |
|---|---|
| Tecla `2` | "O consumidor testou: buffer vazio, então vai dormir. Mas ainda não dormiu." |
| Teclas `1`, `1`, `1`, `1` | "O produtor escreveu dois itens e chamou `wakeup`. Ninguém dormia ainda: **wakeup perdido**." |
| Tecla `1`, depois `2`, depois `1` | "O produtor viu o buffer cheio e dormiu; o consumidor dormiu com 2 itens no buffer. Os dois dormem para sempre: é o **lost wakeup**." |
| **Ajustar**, versão **Correta**, **Aplicar e reiniciar**; tecla `1` onze vezes | "Como no xv6: testa cheio **segurando o lock**, e `sleep(&nwrite, &pi->lock)` solta o lock e dorme de uma vez. O produtor encheu o buffer e dormiu." |
| Tecla `2` quatro vezes | "O consumidor leu um item e o `wakeup(&nwrite)` acordou o produtor. Nada se perde." |

## 3:15–4:30 — Nível 3: filósofos e deadlock

Na aba **3. Filósofos**, configuração padrão (5 filósofos, todos pegam o esquerdo).

| Fazer | Dizer |
|---|---|
| Teclas `1` `2` `3` `4` `5` | "Cada filósofo pegou o garfo da esquerda." |
| Teclas `1` `2` `3` `4` `5` | "Cada um espera o garfo do vizinho segurando o seu. No grafo, o ciclo aparece em vermelho, e as quatro condições de Coffman estão presentes: **deadlock**." |
| **Ajustar**, estratégia **Ordem global**, **Aplicar e reiniciar**; teclas `1` `2` `3` `4` `5` | "Com ordem global, todos pegam primeiro o garfo de menor número. F4 pede G0 antes e fica esperando **sem segurar nada**: não há posse e espera." |
| Tecla `4` três vezes | "F3 conseguiu o segundo garfo, comeu e soltou. Sem espera circular, sem ciclo. É a regra que o xv6 usa para os locks; o lockdep do Linux avisa quando alguém foge dessa ordem." |

## 4:30–5:00 — Fechamento

**Dizer:** "Simplificações: cada passo é uma linha atômica, não há várias CPUs nem interrupções de
verdade, e o pipe passa um item por vez. Os casos foram conferidos à mão e por testes que
percorrem todas as intercalações possíveis. Os desafios opcionais pedem justamente isso: provocar
o bug e depois tentar com a correção."

## Se algo der errado

- Errou uma tecla: `Z` (Voltar 1 passo).
- Perdeu o fio: **Reiniciar**. Se reiniciou sem querer, use o link **Desfazer reinício**.
- O navegador não entrou em tela cheia: use `F11`.
