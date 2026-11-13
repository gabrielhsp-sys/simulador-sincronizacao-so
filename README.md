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

- **Pela internet:** no endereço do GitHub Pages, `https://USUARIO.github.io/REPOSITORIO/`.
- **Do disco:** baixe o `index.html` e abra no navegador (Chrome, Edge ou Firefox). Não precisa
  de internet: o arquivo não faz nenhuma requisição de rede.

Atalhos: `1` a `6` executam o processo dessa posição, `Espaço` dá um passo aleatório (o escalonador
escolhe), `A` liga o Auto, `Z` volta um passo, `R` reinicia, `?` abre a ajuda.

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
| `PUBLICAR.md` | Passo a passo para publicar no GitHub Pages ou no Padlet |
| `VIDEO.md` | Roteiro e checklist para gravar o vídeo |

Feito com ajuda de IA (Claude Code). Os prompts estão em [`PROMPTS.md`](PROMPTS.md).
