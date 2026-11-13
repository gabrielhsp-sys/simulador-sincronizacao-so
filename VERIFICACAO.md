# Plano de verificação — Simulador: Sincronização, Comunicação e Deadlock

Este arquivo registra **o que significa "pronto"** e **como cada afirmação foi conferida**:
casos feitos à mão (o "oráculo" independente que o enunciado pede: "o grupo confere os resultados
com exemplos feitos à mão") e testes automáticos da lógica com `node:test` (vem com o Node; nada
instalado).

## Objetivo

Um único `index.html` que roda no navegador (aberto do disco por `file://` e no GitHub Pages), sem
nenhuma requisição de rede, com três níveis passo a passo (contador, pipe, filósofos) cujo
comportamento bate, passo a passo, com os casos à mão abaixo.

## Fora de escopo

Semáforo como mecânica (só nota), editor livre de grafo, recursos com várias instâncias (só no
glossário), algoritmo do banqueiro, paralelismo real, código real do xv6 executando, outros IPCs.

## Alegações e caminho de evidência

| # | Alegação | Rota escolhida | Alternativas descartadas |
|---|---|---|---|
| A1 | Sem lock, existe intercalação que perde atualização; o resultado depende da ordem | caso à mão C1/C3/C4 reproduzido pelo teste + busca exaustiva (BFS) de todas as intercalações | só olhar a tela (não é prova) |
| A2 | Com lock (spinlock), **nenhuma** intercalação perde atualização | BFS sobre todas as intercalações (2×2 e 3×1) | testar algumas ordens aleatórias (não cobre todas) |
| A3 | Pipe correto: produtor dorme cheio, consumidor dorme vazio, ordem FIFO, nunca trava, `0 ≤ nwrite − nread ≤ PIPESIZE` sempre | casos C6/C7 + BFS do invariante e de "nunca trava" | só o caso feliz |
| A4 | Sem checagem há sobrescrita; na versão ingênua existe lost wakeup que trava os dois | casos C8/C9 reproduzidos passo a passo | — |
| A5 | Filósofos "todos pegam o esquerdo" podem formar ciclo (deadlock); "ordem global" e "um canhoto" nunca formam ciclo e sempre terminam | casos C10/C11 + BFS para 3 a 5 filósofos | — |
| A6 | Mínimo de passos de cada desafio (usado nas ★★★) está correto | BFS de menor caminho até o objetivo | contar à mão só (erro fácil) |
| A7 | O arquivo não faz requisição de rede | inspeção por `grep` (sem `http`, `fetch`, `XMLHttpRequest`, `<link`, `src=` externo, `import`) | — |
| A8 | A página carrega e a interface monta sem erro de JavaScript por `file://` | Edge headless (já instalado no Windows) abrindo o arquivo do disco: `--dump-dom` e captura de tela | instalar Playwright (proibido) |
| A9 | Interface aplica as 10 heurísticas de Nielsen | revisão uma a uma em `NIELSEN.md` | — |

## Como rodar

```bash
# testes da lógica (lê o bloco <script id="logica"> do index.html e roda num vm do Node)
node --test

# A7 — nenhuma referência de rede (a saída deve ser vazia)
grep -nE "https?://|fetch\(|XMLHttpRequest|WebSocket|<link|import |src=\"http" index.html
```

---

## Casos feitos à mão

Convenção: `P0`, `P1` = processos; `reg` = registrador privado de cada processo. Cada linha é **um
passo** escolhido pelo usuário (o escalonador).

### Nível 1 — Contador compartilhado

Programa sem lock (repetido `k` vezes): `ler: reg = contador` → `escrever: contador = reg + 1`.
Programa com lock: `acquire` → `ler` → `escrever` → `release`.

**C1 — sem lock, 2 processos × 1 incremento, ordem ler-ler-escrever-escrever**

| Passo | Ação | contador | P0.reg | P1.reg |
|---|---|---|---|---|
| 1 | P0 ler | 0 | 0 | – |
| 2 | P1 ler | 0 | 0 | 0 |
| 3 | P0 escrever | 1 | 0 | 0 |
| 4 | P1 escrever (leu 0, mas o contador já é 1) | **1** | | |

Esperado: final **1** (deveria ser 2); evento "atualização perdida" no passo 4.

**C2 — com lock, mesma tentativa de intercalar**

| Passo | Ação | Resultado |
|---|---|---|
| 1 | P0 acquire | lock = P0 |
| 2 | P1 acquire | lock ocupado → P1 **gira** (passo gasto) |
| 3 | P0 ler | reg = 0 |
| 4 | P0 escrever | contador = 1 |
| 5 | P1 acquire | gira de novo |
| 6 | P0 release | lock livre; P0 terminou |
| 7 | P1 acquire | lock = P1 |
| 8 | P1 ler | reg = 1 |
| 9 | P1 escrever | contador = 2 |
| 10 | P1 release | P1 terminou |

Esperado: final **2**, nenhuma perda, 2 passos gastos girando.

**C3 — sem lock, ordem serial (P0 ler, P0 escrever, P1 ler, P1 escrever)** → final **2**, sem
perda. Mostra que o bug depende da intercalação, não do código "estar sempre errado".

**C4 — sem lock, 2 × 3: valor mínimo possível é 2**

P0 ler (reg 0) · P1 ler, escrever, ler, escrever (contador 2) · P0 escrever (contador **1**,
apagou o trabalho de P1) · P1 ler (reg 1) · P0 ler, escrever, ler, escrever (contador 3) · P1
escrever (contador **2**). Total 12 passos. Final **2**. Valor 1 é impossível (conferido por BFS).

**C5 — com lock, todas as intercalações** (2 × 2 e 3 × 1): final sempre = `n × k`, nunca há
perda (BFS).

### Nível 2 — Produtor-consumidor no buffer circular (pipe do xv6)

Cheio: `nwrite == nread + PIPESIZE`. Vazio: `nwrite == nread`. Posição: `índice % PIPESIZE`.

**C6 — versão correta, PIPESIZE = 2, 1 produtor (P1), 1 consumidor (C1), 3 itens A1..A3**

| Passos | Ação | Estado depois |
|---|---|---|
| 1–4 | P1 acquire, testa (0 == 0+2? não), escreve A1 em data[0], wakeup(&nread) + release | nwrite = 1 |
| 5–8 | idem com A2 em data[1] | nwrite = 2 |
| 9–11 | P1 acquire, testa (2 == 0+2 → **cheio**), `sleep(&nwrite)` solta o lock | P1 dormindo; só C1 pode rodar |
| 12–15 | C1 acquire, testa (vazio? não), lê A1 de data[0], wakeup(&nwrite) **acorda P1** + release | nread = 1 |
| 16 | P1 readquire o lock (sleep retorna segurando o lock) | |
| 17–19 | P1 testa de novo (2 == 1+2? não), escreve A3 em data[2 % 2 = 0], wakeup + release | nwrite = 3 |
| 20 | P1 close: writeopen = 0, wakeup(&nread) | P1 terminou |
| 21–28 | C1 lê A2 (data[1]) e A3 (data[0]) | nread = 3 |
| 29–31 | C1 acquire, testa: vazio **e** fechado → release, `read` devolve 0 | C1 terminou |

Esperado: consumidos **A1, A2, A3** nessa ordem, sem erro, 31 passos (é o mínimo do desafio 2.3).

**C7 — consumidor primeiro com buffer vazio**: C1 acquire, testa (0 == 0 e pipe aberto) →
`sleep(&nread)`. Esperado: C1 dormindo, lock livre, só P1 executável.

**C8 — sem checagem, PIPESIZE = 2, só o produtor roda**: A1 em data[0], A2 em data[1], A3 em
data[2 % 2 = 0] → **sobrescreve A1 que ninguém leu** (passo 8: acquire, escreve, release por
item). Consumidor rodando com buffer vazio → "leu posição vazia".

**C9 — versão ingênua (teste e sleep em passos separados, sem lock): lost wakeup**

| Passo | Ação |
|---|---|
| 1 | C1 testa: nread 0 == nwrite 0 → vazio, **decide** dormir (ainda não dormiu) |
| 2 | P1 testa: 0 == 0+2? não |
| 3 | P1 escreve A1, wakeup(&nread) → **ninguém dormindo: wakeup perdido** |
| 4 | P1 testa: não cheio |
| 5 | P1 escreve A2, wakeup perdido de novo |
| 6 | P1 testa: 2 == 0+2 → cheio, decide dormir |
| 7 | C1 sleep(&nread) → dorme **com 2 itens no buffer** |
| 8 | P1 sleep(&nwrite) → dorme |

Esperado: nenhum processo executável e trabalho pendente → **travado para sempre**. Na versão
correta isso é impossível (BFS: nunca trava).

### Nível 3 — Jantar dos filósofos + grafo de alocação

Garfo `i` fica à esquerda do filósofo `Fi`; o da direita é `(i+1) % n`. Programa: pegar 1º garfo →
pegar 2º garfo → comer → soltar os dois. Recursos de **instância única**: ciclo no grafo ⇔
deadlock.

**C10 — 3 filósofos, "todos pegam o esquerdo"**: F0 pega G0, F1 pega G1, F2 pega G2, F0 pede G1
(espera), F1 pede G2 (espera), F2 pede G0 (espera). Esperado após 6 passos: ciclo
**F0 → G1 → F1 → G2 → F2 → G0 → F0**, nenhum executável, as 4 condições de Coffman presentes.
Com 5 filósofos: 10 passos (mínimo do desafio 3.1).

**C11 — 3 filósofos, "ordem global"** (F2 pega G0 antes de G2):

| Passo | Ação |
|---|---|
| 1 | F0 pega G0 |
| 2 | F1 pega G1 |
| 3 | F2 pede G0 → espera **sem segurar nada** (não há posse-e-espera) |
| 4–6 | F1 pega G2, come, solta G2 e G1 |
| 7–9 | F0 pega G1, come, solta G1 e G0 → F2 volta a ficar pronto |
| 10–13 | F2 pega G0, pega G2, come, solta |

Esperado: todos comem, nunca há ciclo (BFS para 3, 4 e 5 filósofos; idem "um canhoto").

### Mínimos dos desafios (★★★ = concluir em até esse número de passos)

| Desafio | Configuração | Objetivo | Mínimo |
|---|---|---|---|
| 1.1 | sem lock, 2 × 2 | provocar uma atualização perdida | 4 |
| 1.2 | com lock, 2 × 2 | tentar perder; terminar com valor certo | 16 |
| 1.3 | sem lock, 2 × 3 | terminar com contador = 2 | 12 |
| 2.1 | sem checagem, PIPESIZE 2, 1P 1C, 3 itens | sobrescrever item não lido | 8 |
| 2.2 | ingênua, PIPESIZE 2, 1P 1C, 3 itens | travar os dois (lost wakeup) | 8 |
| 2.3 | correta, PIPESIZE 2, 1P 1C, 3 itens | produtor dormir com buffer cheio e tudo terminar sem erro | 31 |
| 3.1 | todos o esquerdo, 5 filósofos | provocar deadlock | 10 |
| 3.2 | ordem global, 5 filósofos | tentar travar; fazer todos comerem | 20 |

---

## Resultados

Rodados em 12/11/2026, na versão final do `index.html` (≈ 100 KB), com Node v22.23.1.

### Testes da lógica — `node --test`

```text
ok 1 - C1: sem lock, ler-ler-escrever-escrever perde uma atualização (final 1)
ok 2 - C3: sem lock, ordem serial dá o valor certo (final 2, sem perda)
ok 3 - C2: com lock, quem tenta acquire com lock ocupado gira; final 2
ok 4 - C4: sem lock, 2 x 3 pode terminar em 2 e nunca em 1
ok 5 - C5: com lock, nenhuma intercalação perde atualização (2x2 e 3x1)
ok 6 - Desafios 1.1, 1.2, 1.3: mínimo de passos confere com a tabela feita à mão
ok 7 - C6: pipe correto, PIPESIZE 2, 3 itens: produtor dorme cheio, FIFO, 31 passos
ok 8 - C7: pipe correto, consumidor com buffer vazio dorme e solta o lock
ok 9 - C8: sem checagem, o 3º item sobrescreve A1 não lido; ler vazio é erro
ok 10 - C9: versão ingênua, lost wakeup trava os dois em 8 passos
ok 11 - A3: pipe correto nunca trava, nunca erra e respeita 0 <= nwrite-nread <= PIPESIZE
ok 12 - Versão ingênua: existe intercalação que trava (BFS)
ok 13 - Desafios 2.1, 2.2, 2.3: mínimo de passos confere com a tabela feita à mão
ok 14 - C10: 3 filósofos "todos pegam o esquerdo" formam ciclo em 6 passos
ok 15 - C11: 3 filósofos "ordem global": F2 espera sem segurar nada; todos comem em 13 passos
ok 16 - A5: "ordem global" e "um canhoto" nunca formam ciclo e sempre podem terminar (3 a 5)
ok 17 - A5: "todos pegam o esquerdo" pode travar, com ciclo, para 3 a 5 filósofos
ok 18 - Desafios 3.1 e 3.2: mínimo de passos confere com a tabela feita à mão
# tests 18
# pass 18
# fail 0
```

### Por alegação

| # | Alegação | Resultado | Evidência |
|---|---|---|---|
| A1 | Sem lock há atualização perdida, e ela depende da ordem | PASS | testes 1, 2 e 4 (C1, C3, C4: final mínimo 2, máximo 6 em 2 × 3) |
| A2 | Com lock, nenhuma intercalação perde | PASS | teste 5: busca em todas as intercalações de 2 × 2 e 3 × 1 |
| A3 | Pipe correto: dorme cheio e vazio, FIFO, nunca trava, invariante do buffer | PASS | testes 7, 8 e 11 (quatro configurações, todas as intercalações) |
| A4 | Sobrescrita sem checagem; lost wakeup trava a versão ingênua | PASS | testes 9, 10 e 12 |
| A5 | "Esquerdo" pode travar com ciclo; "ordem global" e "um canhoto" nunca | PASS | testes 14 a 17 (3, 4 e 5 filósofos); travou ⇔ há ciclo |
| A6 | Mínimos dos desafios | PASS | testes 6, 13 e 18: a busca confirma 4, 16, 12, 8, 8, 31, 10 e 20 |
| A7 | Nenhuma requisição de rede | PASS | `grep -cE "https?://\|fetch\(\|XMLHttpRequest\|WebSocket\|EventSource\|sendBeacon\|<link\|import \|src=\"http\|url\(http" index.html` → `0` |
| A8 | Carrega por `file://` sem erro de JavaScript | PASS (só Edge) | Edge 152 headless abrindo uma cópia do arquivo pelo disco, com um coletor de erros injetado na cópia: **0 erros** em 17 execuções (13 cenários distintos) (os três níveis, os casos C1, C9 e C10, os desafios 1.1 e 2.2, pipe com 8 posições e 2 × 2, 6 filósofos, modo apresentação, painel xv6/Linux, abas, Auto). Capturas de tela conferidas uma a uma. |
| A9 | 10 heurísticas de Nielsen | PASS, com ressalvas | [`NIELSEN.md`](NIELSEN.md), incluindo o que não foi bem atendido |

### O que continua sem verificação

- Chrome e Firefox (só o Edge foi usado) e o arquivo baixado do Padlet.
- Celular de verdade a 320 px. O Edge headless não estreita abaixo de uns 477 px; nessa largura,
  `scrollWidth` = `clientWidth`, ou seja, sem rolagem horizontal.
- Leitor de tela de verdade.
- O endereço do GitHub Pages (ainda não publicado).

## Conferência pelo grupo

O enunciado pede que **o grupo** confira os resultados da IA com exemplos feitos à mão. Os casos
acima foram escritos pela IA e conferidos pelos testes, mas isso não substitui a conferência de
vocês. Sugestão: cada pessoa refaz um caso no papel, executa a mesma sequência no simulador e
marca aqui.

| Caso | Sequência no simulador | Conferido? |
|---|---|---|
| C1 | Nível 1, sem lock, 2 processos: teclas `1 2 1 2` → contador 1 | [ ] |
| C2 | Nível 1, com lock, 2 processos × 1: teclas `1 2 1 1 2 1 2 2 2 2` → contador 2, 2 giros | [ ] |
| C6 | Nível 2, correta, PIPESIZE 2, 3 itens: tecla `1` onze vezes → produtor dorme | [ ] |
| C9 | Nível 2, ingênua: teclas `2 1 1 1 1 1 2 1` → travado | [ ] |
| C10 | Nível 3, 3 filósofos, esquerdo: teclas `1 2 3 1 2 3` → ciclo F0 → G1 → F1 → G2 → F2 → G0 | [ ] |
| C11 | Nível 3, 3 filósofos, ordem global: teclas `1 2 3 2 2 2 1 1 1 3 3 3 3` → todos comem | [ ] |

## Rodada de interface "Fábrica de Processos" (12/11/2026)

A interface foi reescrita. A lógica (`<script id="logica">`) e os testes não mudaram: o script de
aplicação comparou o bloco da lógica antes e depois, e ele ficou idêntico byte a byte.

| Critério | Resultado | Evidência |
|---|---|---|
| Testes da lógica | PASS | `node --test`: `# pass 18`, `# fail 0` |
| Sem rolagem horizontal em 1280, 1366, 1920 e ≤ 480 px | PASS | Edge headless: `scrollWidth == clientWidth` nos 3 níveis, inclusive pipe com 8 posições e 2 × 2, 6 filósofos e os cenários de erro (contador sem lock, pipe ingênuo, deadlock). Em "480", o Edge não estreita abaixo de 477 px. |
| "Executar" do nível 3 acima da dobra em 1366 × 768 | PASS | Fundo do último botão: 568 px com 5 filósofos e 635 px com 6, para uma área visível de 676 px. |
| Nenhuma linha de código quebrada | PASS | Altura de cada linha do código ≤ 1,5 × a altura de linha: 0 quebradas de 4 (nível 1), 24 (nível 2) e 24 (nível 3), nas 4 larguras. |
| Contraste AA no texto | PASS | `contrast.py`: pior caso 4,71:1 (branco sobre o vermelho de erro). Botões "Executar" entre 5,99:1 e 10,75:1; linha do kernel 12,2:1. |
| `prefers-reduced-motion` desliga as animações | PASS | Com `--force-prefers-reduced-motion`, o tremor, o brilho, o cursor, o carimbo e a entrada na linha do tempo ficam em `animation-name: none`. A linha `kernel$ alerta` continua visível como texto. |
| A palavra "panic" não aparece na interface | PASS | Só existe em comentários do código, que explicam por que não é usada. |
| Sem erro de JavaScript por `file://` | PASS | 0 erros em todas as execuções: 3 níveis × 4 larguras, primeiro uso, desafios, glossário, tutorial, gaveta de parâmetros, apresentação e alerta. |
| Teclado e fluxo de desafio | PASS | Teclas `1`, `2`, `Z` e `R`, "Desfazer reinício" e o desafio 3.1 resolvido por teclas (janela de resultado com ★★★). |
| Nenhuma requisição de rede | PASS | `grep` por `http`, `fetch`, `<link`, `import`: 0 ocorrências. |

As capturas ficam em `screenshots/`, fora do Git.

## Publicação (12/11/2026)

| Verificação | Resultado | Evidência |
|---|---|---|
| Endereço responde | PASS | `curl -sI https://gabrielhsp-sys.github.io/simulador-sincronizacao-so/` → `HTTP/2 200`, `text/html; charset=utf-8` |
| Publicado = arquivo testado | PASS | `curl -s <endereço> \| cmp - index.html`: conteúdo idêntico (123 418 bytes) |
| Abre no navegador sem erro | PASS | Edge 152 headless no endereço publicado: interface montada ("Passo 0", cartões, tutorial do primeiro acesso) e nenhum erro de console |
| Histórico publicado sem e-mail pessoal | PASS | `main` tem 1 commit, com autor e committer `noreply` do GitHub; o histórico com e-mail pessoal ficou só na branch local `historico-local` |

## Rodada de acabamento (13/11/2026)

A lógica e os testes não mudaram: o bloco `<script id="logica">` continua idêntico e `tests/` não
foi tocado.

| Critério | Resultado | Evidência |
|---|---|---|
| Testes da lógica | PASS | `node --test`: `# pass 18`, `# fail 0` |
| Auto legível | PASS | Velocidades 0,5×, 1× e 2×. Durante o Auto e depois de pausar, o rastro mostra os 2 passos anteriores; o último passo fica destacado na linha do tempo (`td.atual`). Depois de um passo manual, o rastro some. |
| Confirmação antes de perder a simulação | PASS | Sem simulação, a troca de nível não pergunta. Com simulação no passo 3, abre "Você vai perder a simulação atual (passo 3). Continuar?" com foco em "Cancelar". Cancelar mantém o nível e o passo; "Aplicar e reiniciar" também pergunta, e cancelar deixa a gaveta aberta; Continuar troca de nível. |
| Dicas sem mouse | PASS | O botão "?" abre a lista com o que cada controle faz e a tecla. |
| Página longa | PASS | Em 1366 × 768, o link "↓ Linha do tempo e código" aparece no topo e some quando a linha do tempo entra na tela. Volta a aparecer ao voltar ao topo (testado disparando `scroll`, porque o headless com tempo virtual não emite o evento sozinho). |
| Sem rolagem horizontal | PASS | `scrollWidth == clientWidth` nos 3 níveis e com o easter egg aberto, em 1280, 1366, 1920 e "480" (477 px no Edge). |
| "Executar" do nível 3 acima da dobra em 1366 × 768 | PASS | 568 px com 5 filósofos e 635 px com 6, para uma área visível de 676 px. |
| Linhas de código | PASS | 0 quebradas nos 3 níveis e nas 4 larguras. |
| Contraste | PASS | Rastro 13:1 ou mais, link fixo 13,08:1, texto do easter egg entre 12,2:1 e 18,9:1. O pior caso geral continua 4,71:1. |
| Easter egg 3 vezes seguidas | PASS | Teclado (os espaços da sequência não deram passo), 5 toques e teclado com Auto rodando. Saída por Esc, clique e botão. Em todos: 64 cartões no máximo, tela final com foco em "Reiniciar o sistema", palco e número de elementos do DOM idênticos depois de fechar, Auto pausado e retomado, 0 erros de JavaScript. |
| Easter egg com reduced-motion | PASS | Tela final direto (64 cartões, cartão didático), `animation-name: none` na faixa, nos cartões e na caixa. |
| Sem "panic" na interface | PASS | Só em comentários do código. |
| Sem rede | PASS | `grep` no `index.html`: 0 ocorrências. |

## Terminal do easter egg (13/11/2026)

A lógica e os testes não mudaram.

| Critério | Resultado | Evidência |
|---|---|---|
| Testes da lógica | PASS | `node --test`: `# pass 18`, `# fail 0` |
| Atalho `` ` `` | PASS | `` ` `` e a tecla morta do ABNT2 (`Dead` + `Shift` + `BracketLeft`) focam o campo sem dar passo. Com o diálogo do easter egg aberto, a tecla não sai dele. |
| Teclas dentro do campo | PASS | `1` e `A` digitados no campo não executam processo nem ligam o Auto. |
| `help` | PASS | Também com maiúsculas e espaços (`HELP `). Lista os dois comandos e diz que nada roda de verdade. |
| Comando desconhecido | PASS | `ls -la` responde `ls -la: comando não encontrado (digite help)`. Texto com mais de 40 caracteres é cortado com "…". |
| Texto com HTML | PASS | `<img src=x onerror=alert(1)>` aparece como texto; nenhum `<img>` foi criado. |
| Fork bomb pelo terminal | PASS | Com e sem espaços. Abre o easter egg (64 cartões, tela final); Esc e "Reiniciar o sistema" fecham, o foco volta ao campo, e o palco e o passo ficam idênticos. |
| Gatilhos antigos | PASS | O teste das 3 vezes seguidas (teclado, 5 toques e teclado com Auto) passou igual ao da rodada anterior. |
| Sem rolagem horizontal | PASS | `scrollWidth == clientWidth` com a resposta do `help` na tela, em 1280, 1366, 1920 e "480" (477 px no Edge). |
| Contraste | PASS | Prompt 12,2:1 e texto 15,6:1 sobre preto; contorno de foco 4,14:1 sobre o amarelo. |
| Reduced-motion | PASS | Cursor ▌ com `animation-name: pisca` normalmente e `none` com `--force-prefers-reduced-motion`. |
| Erros de JavaScript | PASS | 0 em todos os testes acima. |
| Sem `eval` | PASS | O `grep` não acha `eval(`, `new Function` nem `innerHTML` no código do terminal. |

Não testado: teclado ABNT2 de verdade (o headless só simula o evento da tecla morta) e leitor de
tela de verdade.

## Terminal kernel$ ampliado (13/11/2026)

A lógica e os testes não mudaram. A interface ganhou só a ponte `window.SimuladorUI` e a função
`aplicarParametros`, que o "Aplicar e reiniciar" também usa.

| Critério | Resultado | Evidência |
|---|---|---|
| Testes da lógica | PASS | `node --test`: `# pass 18`, `# fail 0`; `<script id="logica">` idêntico ao commit anterior; `tests/` sem diferença |
| Cada comando ao menos uma vez | PASS | Teste no Edge headless: `help`, `ajuda`, `?`, `man` (com e sem argumento), `ps`, `nivel` (lista, 2, `filosofos`, 9), `step` (aleatório, `P1`, `P9`, `F0` bloqueado), `back`, `auto`, `pause`, `reset`, `lock` (on, off, sem argumento, inválido, no nível errado), `versao` (`ingênua`, sem argumento, no nível errado), `estrategia`, `desafios`, `glossario` (lista, `dead`, `lock`, `co`, inexistente), `xv6` (outro nível, desconhecido, `lockdep`), `coffman` (sem e com deadlock), `forkbomb`, `neofetch`, `history`, `clear`, `exit`, `sudo`, `sudo rm -rf /`, `rm -rf /`, `whoami`, `snake`, `ls`, `top` (palpite) e `contato`/`cv`/`projetos` (não existem). |
| Mesmas funções dos botões | PASS | `lock off` com simulação no passo 2 abriu "Você vai perder a simulação atual (passo 2)"; Cancelar manteve o lock e o passo; Continuar aplicou. `estrategia ordem` com deadlock na tela também pediu confirmação. `coffman` deu o mesmo ciclo do palco (F0 → G1 → … → G0 → F0). |
| Atalhos da página | PASS | `1`, `a` e Espaço digitados no campo não deram passo nem ligaram o Auto. |
| Teclas do terminal | PASS | Crase abre e fecha (também de dentro do campo); Esc e `exit` fecham; ↑/↓ percorrem o histórico; Tab completa `neo` → `neofetch` e `versao s` → `versao semchecagem`, lista as opções quando há mais de uma e, com o campo vazio, não prende o foco; Ctrl+L limpa; Ctrl+C escreve `^C` e limpa a linha. |
| Prompt do rodapé | PASS | `ps` digitado no rodapé abriu o terminal e rodou o comando. |
| Fork bomb 3 vezes | PASS | `forkbomb`, `:(){ :|:& };:` e `jogo`: 64 cartões; "Reiniciar o sistema" fecha, o terminal escreve "Sistema reiniciado…" e o foco volta ao campo; o passo da simulação não mudou. Os gatilhos antigos (sequência no teclado e 5 toques) continuaram funcionando. |
| Texto com HTML | PASS | `<img src=x onerror=alert(1)>` virou texto; nenhum `<img>` foi criado. Nenhum `eval(`, `new Function` ou `innerHTML` no script do terminal. |
| Leitor de tela | PASS | Campo com label ("kernel$ comando (help lista todos)") e dica (`aria-describedby`); `role="status"` recebe só a última resposta (depois de `ps`, só a saída do `ps`). |
| Sem rolagem horizontal | PASS | Com o terminal aberto mostrando `help`, `neofetch` e `ps`: `scrollWidth == clientWidth` em 1280, 1366, 1920 e "480" (477 px); o log não rola na horizontal. Nos 3 níveis, sem o terminal: igual, e 0 linhas de código quebradas. |
| "Executar" do nível 3 acima da dobra em 1366 × 768 | PASS | 568 px com 5 filósofos e 635 px com 6, para 676 px visíveis (igual à rodada anterior). |
| Contraste | PASS | Erro #FF8A7A sobre preto 9,17:1; placeholder #A89A7C 7,58:1; texto branco e âmbar, 12:1 ou mais; barra preta sobre amarelo 13,08:1. |
| Reduced-motion | PASS | A entrada do terminal só anima sem `prefers-reduced-motion`; com `--force-prefers-reduced-motion`, ele aparece pronto. |
| Erros de JavaScript | PASS | 0 em todos os testes acima. |

Não testado: leitor de tela de verdade, teclado ABNT2 físico e celular de verdade.
