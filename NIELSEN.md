# As 10 heurísticas de Nielsen no simulador

Para cada heurística: **onde foi aplicada** e **o que não foi bem atendido**. A interface atual é
a identidade "Fábrica de Processos" (veja `DECISOES.md`). A revisão foi feita pela IA abrindo o
`index.html` do disco no Edge, em 1280, 1366, 1920 e cerca de 480 px de largura, e completada por
uma auditoria de interface: contraste medido, teclado, estados vazios e de erro, conteúdo extremo,
hierarquia e facilidade de uso.

## 1. Visibilidade do estado do sistema

**Aplicada em:**
- **Palco**: o estado compartilhado fica no centro e em tamanho grande. Pode ser o contador, o
  buffer em anel com os ponteiros R e W, ou a mesa com o grafo de alocação.
- **Faixa de narração**, logo abaixo do palco: "Passo N" e uma frase curta com os valores do
  momento.
- **Erro ou travamento**: aparece um carimbo vermelho, a linha `kernel$ alerta: …` com cursor ▌ e
  um tremor curto da tela, só no passo que causou o problema.
- **Estado de cada processo** com ícone e texto: pronto, girando, dormindo em `&nread`, esperando
  G1, terminou.
- **Próxima linha** de cada processo no cartão, e o código inteiro com ▶ na caixa "Código de cada
  processo".
- **Linha do tempo em raias**: mostra a intercalação inteira, e a coluna tracejada indica onde vai
  cair o próximo passo.
- **Brilho no cartão** de quem acabou de rodar. No pipe, as condições cheio e vazio aparecem
  calculadas com os números ("nwrite 2 == nread 0 + 2"). No nível 3, as condições de Coffman
  ficam visíveis.

**Resolvido nesta rodada:** o Auto vai até 2× (600 ms por passo). A 4× (300 ms) nada ficava
legível, então essa velocidade saiu. Durante o Auto e depois de pausar, um **rastro** mostra os 2
passos anteriores acima da frase atual. O último passo fica destacado na linha do tempo e no
histórico.

## 2. Correspondência entre o sistema e o mundo real

**Aplicada em:**
- **Nomes reais do xv6** no código e na tela: `acquire`, `release`, `sleep(&nwrite, &pi->lock)`,
  `wakeup(&nread)`, `nread`, `nwrite`, `PIPESIZE`.
- **O buffer circular é desenhado como um anel**. A mesa dos filósofos e o grafo de alocação
  aparecem lado a lado.
- **Linguagem de terminal no erro** (`kernel$ alerta`). Ela não usa "panic", porque um erro de
  processo não derruba o kernel.
- Painel **"Como o xv6 e o Linux fazem"** com trechos de `spinlock.c` e `pipe.c`, o futex e o
  lockdep.

**Não tão bem atendida:** "R" e "W" são abreviações. O próprio rótulo explica cada uma ("R:
próxima leitura").

## 3. Controle e liberdade do usuário

**Aplicada em:**
- Voltar 1 passo, sem limite.
- **Desfazer reinício**.
- Pausar o Auto.
- Sair do desafio e pular o tutorial.
- `Esc` fecha qualquer janela, inclusive a gaveta de parâmetros.

**Resolvido nesta rodada:** trocar de nível, "Aplicar e reiniciar" e começar um desafio com uma
simulação em andamento abrem uma confirmação: "Você vai perder a simulação atual (passo N).
Continuar?". O foco começa em "Cancelar", e Esc também cancela. Sem simulação em andamento, não há
pergunta. "Reiniciar" continua sem pergunta, porque tem "Desfazer reinício".

## 4. Consistência e padrões

**Aplicada em:**
- **Uma cor e uma forma por processo** (● ■ ▲ ◆ ⬢ ⬟), iguais no cartão, no botão, na linha do
  tempo, no código, na mesa e no grafo.
- **A mesma moldura nos três níveis**: barra, palco, narração, linha do tempo, código e extras.
- **Um só estilo de botão**: contorno preto e sombra dura, que afunda ao clicar.
- **Mesmos verbos** em todo lugar: "Executar P0", "Voltar 1 passo", "Reiniciar", "Ajustar".
- **Padrões da web**: abas com setas do teclado, `<dialog>` nativo e `<select>`.

## 5. Prevenção de erros

**Aplicada em:**
- Parâmetros só por `<select>`, numa gaveta. Nada muda até "Aplicar e reiniciar".
- O botão "Executar" fica desabilitado para quem não pode rodar, e o motivo aparece no estado.
- A versão ingênua do pipe força 1 produtor e 1 consumidor, com aviso.
- Durante um desafio, os parâmetros ficam travados.
- Apagar o progresso pede confirmação em dois cliques.
- Os atalhos são ignorados com foco num campo ou com uma janela aberta.

## 6. Reconhecer em vez de lembrar

**Aplicada em:**
- O cartão mostra a próxima linha, `reg`, itens escritos ou lidos e o último item. No nível 3, a
  mesa mostra quem segura cada garfo.
- O código completo de cada processo está sempre à vista, com ▶.
- O atalho aparece escrito no próprio botão ("Executar P0 [1]"). Nos cartões compactos do nível 3
  ele foi omitido por espaço, mas está na Ajuda.
- O resumo dos parâmetros atuais fica sempre visível no palco ("2 processos, 2 incrementos, sem
  lock").
- O prompt `kernel$ ▌` do rodapé mostra `help` apagado: quem não conhece o terminal vê por onde
  começar sem precisar lembrar de nada.
- As condições do pipe aparecem calculadas, e o grafo tem legenda.

## 7. Flexibilidade e eficiência de uso

**Aplicada em:**
- **Atalhos**: `1`–`6`, `Espaço`, `A`, `Z`, `R`, `+`/`−`, `D`, `G`, `P`, `?`.
- **Três ritmos**: escolher cada processo, "Passo aleatório" ou Auto com velocidade de 0,5× a 2×.
- **Modo "Apresentar"**: fonte maior, tela cheia, cenário padrão, e o código e o histórico saem da
  tela.
- **Desafios opcionais** e parâmetros para explorar.
- **Terminal `kernel$`** (crase): os mesmos controles por texto, com histórico (↑/↓), Tab para
  completar e `man` para cada comando.

## 8. Design estético e minimalista

**Aplicada em:**
- **Uma ação principal por nível**: os botões "Executar", com a cor do processo. Os controles de
  passo ficam na faixa escura, como secundários.
- **O estado compartilhado domina o palco**.
- Os parâmetros, o painel xv6/Linux e o histórico ficam recolhidos até alguém pedir.
- **Cor só com função**: processo, erro e lock. As listras marcam "girando", e a faixa de risco
  marca o lock ocupado.

**Resolvido nesta rodada:** a página continua longa, mas, enquanto a linha do tempo e o código
estão abaixo da tela, um link fixo **"↓ Linha do tempo e código"** avisa que eles existem e leva
até lá. Nada fica escondido no modo normal.

## 9. Ajudar a reconhecer, diagnosticar e recuperar erros

**Aplicada em:**
- **Erro de concorrência nomeado na hora**: o carimbo traz a causa ("P1 leu 0 e escreveu 1, mas o
  contador já valia 1…"), e a linha `kernel$ alerta:` traz o tipo ("atualização perdida", "wakeup
  perdido", "deadlock: ciclo F0 → G1 → …").
- **"Por que isso aconteceu?"** ao fim de cada desafio.
- **Sistema travado**: a tela diz isso e sugere "Voltar 1 passo". Com o Espaço sem processo
  executável, a tela explica o motivo.
- Se o navegador não salvar o progresso, a tela avisa que o resto funciona igual.

## 10. Ajuda e documentação

**Aplicada em:**
- "Comece por aqui" no primeiro passo de cada nível. No nível 3, ele fica na coluna da mesa.
- Tutorial de 3 telas e Ajuda com os atalhos e a explicação de cor e forma.
- Glossário com 15 termos.
- Painel xv6/Linux em cada nível e dicas nos desafios.
- `README.md` com simplificações e com o que o simulador não cobre.

**Resolvido nesta rodada:** o que estava só no `title` (o que cada controle faz e a tecla de
atalho) agora também está num botão **"?"** ao lado dos controles. Ele abre ao toque e pelo
teclado.

## O que continua fraco

- **"R" e "W"** continuam abreviações (heurística 2). O rótulo do próprio ponteiro explica cada
  uma.
- **Nos cartões compactos do nível 3**, o número da tecla de atalho não aparece no botão. Foi
  omitido para os 6 botões caberem acima da dobra; o atalho está na Ajuda e no "?".
- **O link fixo** cobre uma faixa estreita do conteúdo na parte de baixo da tela. Ele some quando
  a linha do tempo aparece.

## O que não foi testado

- Leitor de tela de verdade (as marcações ARIA foram conferidas no código).
- Celular de verdade. O Edge headless não estreita abaixo de uns 477 px; nessa largura não há
  rolagem horizontal.
- Firefox e Chrome. Só o Edge foi usado; o endereço publicado também foi aberto nele.
