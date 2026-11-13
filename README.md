# Simulador: Sincronização, Comunicação e Deadlock

Simulador passo a passo, num único arquivo HTML, para o Projeto Integrador de Sistemas
Operacionais (Atividade 1). Você faz o papel do **escalonador**: a cada passo escolhe qual
processo roda e vê o resultado da intercalação que escolheu.

| Nível | Assunto | O que dá para ver |
|---|---|---|
| 1. Contador compartilhado | Sincronização | Condição de corrida (atualização perdida) e spinlock com `acquire`/`release` |
| 2. Produtor-consumidor (pipe) | Comunicação | Buffer circular do pipe do xv6 (`nread`, `nwrite`, `PIPESIZE`), `sleep`/`wakeup` e lost wakeup |
| 3. Filósofos e deadlock | Deadlock | Espera circular, grafo de alocação com detecção de ciclo, condições de Coffman e ordem global de locks |

Cada nível tem desafios opcionais ("provoque o bug", "agora tente com a correção"), um painel
"Como o xv6 e o Linux fazem", tutorial, glossário e modo apresentação.

**Visual:** identidade "Fábrica de Processos". Cada processo tem uma cor **e** uma forma
(● ■ ▲ ◆ ⬢ ⬟). Erros e deadlock aparecem com um carimbo e a linha `kernel$ alerta`, que diz
"alerta" e não "panic", porque erro de processo não derruba o kernel. As animações desligam
com `prefers-reduced-motion`. Detalhes em [`DECISOES.md`](DECISOES.md).

## Como abrir

- **Pela internet:** https://gabrielhsp-sys.github.io/simulador-sincronizacao-so/
  (código em https://github.com/gabrielhsp-sys/simulador-sincronizacao-so).
- **Do disco:** baixe o `index.html` e abra no navegador (Chrome, Edge ou Firefox). Não precisa
  de internet: o arquivo não faz nenhuma requisição de rede.

Atalhos: `1` a `6` executam o processo dessa posição, `Espaço` dá um passo aleatório (o escalonador
escolhe), `A` liga o Auto, `Z` volta um passo, `R` reinicia, `?` abre a ajuda, `` ` `` (crase) abre
o terminal.

## Como conferir a lógica

```bash
node --test
```

Roda 18 testes (`tests/logica.test.js`) com o `node:test`, que já vem com o Node; nada é
instalado. O teste lê o bloco `<script id="logica">` de dentro do `index.html`. Os casos feitos à
mão estão em [`VERIFICACAO.md`](VERIFICACAO.md).

## Simplificações em relação a um SO real

1. **Concorrência.** Cada processo representa um fluxo concorrente, como se estivesse noutra CPU,
   e os passos intercalados representam essa concorrência. No xv6, `acquire` desliga as
   interrupções (`push_off`), então quem segura o lock não é interrompido naquela CPU; quem gira é
   outra CPU. O simulador não modela interrupções nem várias CPUs de verdade.
2. **Atomicidade.** Cada passo é uma linha de pseudocódigo e acontece inteiro. Num processador
   real são várias instruções, com cache e reordenação de memória; as barreiras
   (`__sync_synchronize`) aparecem no painel, mas não são simuladas.
3. **`contador++`** tem 2 passos (ler para o registrador; escrever registrador + 1). Na máquina
   são load, add e store.
4. **Spinlock.** Girar gasta exatamente um passo por tentativa. Na CPU real é um laço que roda
   muitas vezes.
5. **Pipe.** Cada `write`/`read` transfere um item, e o PIPESIZE vai de 1 a 8 (no xv6 são 512
   bytes, e um `write` copia vários bytes dentro do mesmo `acquire`). Por isso o simulador omite o
   `wakeup(&nread)` que o `pipewrite` do xv6 faz antes de dormir. Não há `readopen` nem processo
   morto (`killed`). O fechamento é um contador de produtores abertos (no xv6, a ponta de escrita é
   um arquivo com contagem de referências). Ao ler, a posição é limpa só para a tela ficar clara;
   na memória real o byte antigo continua lá.
6. **sleep/wakeup.** O canal é só um nome (`&nread`, `&nwrite`). O lock interno de cada processo,
   que o xv6 usa dentro de `sleep`, não é mostrado. Como no xv6, `wakeup` acorda todos que dormem
   no canal.
7. **Versão ingênua do pipe.** Sem lock, com 1 produtor e 1 consumidor, para isolar o lost
   wakeup.
8. **Filósofos.** Quem espera um garfo fica bloqueado (não gira) e cada um come uma vez. Fome
   (starvation) não é medida.
9. **Grafo.** Só recursos de instância única, em que ciclo significa deadlock.
10. **Escalonador.** É você. No Auto, a escolha é aleatória e uniforme, sem prioridade nem
    quantum.

## O que o simulador não cobre

- Semáforos e monitores como mecânica (o semáforo aparece só como nota).
- Editor livre de grafo e recursos de várias instâncias (só no glossário).
- Algoritmo do banqueiro e prevenção ou evitação formal de deadlock, exceto a ordem global.
- Paralelismo real, interrupções, cache e memória.
- Código real do xv6 executando (o painel mostra trechos simplificados).
- Outros IPCs (mensagens, sockets, memória compartilhada) e detalhes do futex além do painel.

## Terminal `kernel$`

Um terminal que controla o simulador por texto.
- **Para abrir:** a tecla `` ` `` (crase) em qualquer lugar da página. No teclado ABNT2 é `Shift` +
  a tecla do acento agudo. Também abre ao digitar um comando no prompt `kernel$ ▌` do rodapé; no
  celular, é por ali. O prompt do rodapé mostra `help` apagado como dica. A dica não é um comando:
  Enter com o campo vazio só abre o terminal.
- **Para fechar:** `Esc`, a crase, o botão × ou o comando `exit`.
- **Teclas:** `↑`/`↓` navegam pelo histórico, `Tab` completa comandos e argumentos, `Ctrl+L` limpa a
  tela e `Ctrl+C` cancela a linha.
- **Como funciona:** nada é executado de verdade. O texto só é procurado numa tabela de comandos,
  sem `eval`, e toda resposta aparece como texto puro. Os comandos que mexem na simulação usam as
  mesmas funções dos botões da página, inclusive a confirmação antes de perder uma simulação em
  andamento.

Os comandos, como aparecem no `help`:

```text
SIMULAÇÃO
  ps                 processos do nível e o estado de cada um
  nivel [1|2|3]      mostra ou troca o nível
  step [processo]    passo aleatório, ou roda um processo
  back               volta 1 passo
  auto               liga o Auto (o escalonador sorteia)
  pause              pausa o Auto
  reset              reinicia a simulação
PARÂMETROS
  lock on|off        nível 1: spinlock em volta do contador++
  versao <v>         nível 2: correta, semchecagem ou ingenua
  estrategia <e>     nível 3: esquerdo, ordem ou canhoto
ESTUDO
  desafios           abre a lista de desafios
  glossario [termo]  os 15 termos, ou a definição de um
  xv6 [tópico]       abre “Como o xv6 e o Linux fazem”
  coffman            as 4 condições de deadlock, agora
  man <comando>      ajuda detalhada de um comando
JOGO
  forkbomb           :(){ :|:& };: lota a tabela de processos
SISTEMA
  help               esta lista (também: ajuda, ?)
  neofetch           dados do simulador
  history            comandos desta sessão
  clear              limpa a tela (Ctrl+L)
  exit               fecha o terminal (Esc ou `)
PIADAS
  sudo <comando>     pede permissão
  rm -rf /           tenta apagar tudo
  whoami             quem é você aqui
```

`man <comando>` explica cada um e diz qual botão da página ele usa. Há alguns comandos fora da
lista, para quem adivinhar. Um comando desconhecido responde `comando não encontrado` e, quando dá,
sugere o certo (`top` → `ps`).

## Easter egg

Há um "crash" simulado escondido. Para ver:
- digite `:(){ :|:& };:` em qualquer lugar da página;
- ou, no celular, toque 5 vezes seguidas, em até 2 segundos, no nome "Simulador" no topo;
- ou, no terminal `kernel$`, use o comando `forkbomb`, o próprio `:(){ :|:& };:` ou `jogo`.

O site parece desmoronar, em cerca de 9 s:

| Fase | Tempo | O que aparece |
|---|---|---|
| 1. Multiplicação | 0–1,7 s | Cartões de processo dobrando (1, 2, 4… 64) por cima da página, o contador "processos: N" e uma tabela `ps` falsa rolando |
| 2. Erros | 1,7–3,7 s | 22 janelas de erro tortas se empilhando: `fork: retry: Resource temporarily unavailable`, `allocproc: tabela de processos cheia`, `fork() = -1`, `out of PIDs`… |
| 3. A interface quebra | 3,7–5,9 s | A página treme e se inclina, os títulos falham (glitch), letras trocadas por símbolos, botões apagados com cursor de espera, o contador de passos enlouquece, faixas de risco e cores invertidas |
| 4. Congela | 5,9–7,6 s | Tudo para, a tela escurece e sobra `kernel$ alerta: sistema sem resposta▌` |
| 5. Reboot | 7,6–8,6 s | Linhas de boot do xv6 em texto e, depois, o cartão |

O cartão diz que foi piada e explica o fork bomb. No xv6 o sistema não cai: com a tabela
`proc[NPROC]` cheia (`NPROC = 64`), `allocproc()` não acha lugar e `fork()` devolve −1. No Linux,
`ulimit -u` e o controlador `pids` do cgroup fazem `fork()` falhar com `EAGAIN`.

É só visual: não cria processos, não usa Worker, não abre janelas e não gera erro de verdade (o
console fica limpo). Fica num script separado e não mexe na simulação. Esc, um clique ou
"Reiniciar o sistema" fecham em qualquer fase, e a tela volta exatamente ao que era. A tela nunca
pisca mais de 3 vezes por segundo. Com `prefers-reduced-motion`, nada treme nem se multiplica: aparecem
direto a tela "sistema sem resposta", o reboot em texto e o cartão.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | O simulador, com código comentado |
| `tests/logica.test.js` | Testes da lógica |
| `VERIFICACAO.md` | Casos feitos à mão e resultados |
| `DECISOES.md` | Decisões e motivos |
| `PROMPTS.md` | Prompts usados com a IA |
| `NIELSEN.md` | Onde cada heurística de Nielsen foi aplicada |
| `ROTEIRO-APRESENTACAO.md` | Roteiro de 5 min para a apresentação ao vivo |
| `PUBLICAR.md` | Registro da publicação e o que ainda é manual (Padlet, testes) |
| `VIDEO.md` | Roteiro e checklist para gravar o vídeo |

Feito com ajuda de IA (Claude Code). Os prompts estão em [`PROMPTS.md`](PROMPTS.md).
