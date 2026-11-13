# Decisões

Cada decisão foi **proposta pela IA com opções e recomendação e aprovada pelo autor** antes da
construção (os prompts estão em [`PROMPTS.md`](PROMPTS.md)). Insumo para a parte "decisões e por
quê" da justificativa técnica.

> **Correção de premissa.** A primeira versão desta consulta assumiu que o autor queria um "jogo".
> Isso estava errado: o enunciado aceita "simulador **ou** jogo". O formato escolhido foi um
> **simulador passo a passo**, com desafios opcionais como extra (D1).

## Decisões aprovadas

| # | Tema | Decisão | Por quê |
|---|---|---|---|
| D1 | Formato | Simulador passo a passo, como o prompt sugerido pelo professor, com desafios opcionais curtos ("provoque o bug", "agora conserte"). | Segue o que o professor sugeriu. Os desafios dão um objetivo sem esconder o conceito atrás de pontuação. |
| D2 | Assuntos | Os três: sincronização, comunicação e deadlock. A escolha é do autor, que avisa o grupo. | O tema da atividade junta os três, e um nível por assunto mantém a explicação linear. |
| D3 | Cenários | 1) contador compartilhado com e sem lock; 2) produtor-consumidor no buffer circular do pipe; 3) jantar dos filósofos com grafo de alocação. Sem editor livre de grafo. Semáforo só como nota. "Ciclo é necessário mas não suficiente com várias instâncias" só no glossário. | Vai do simples ao complexo, e cada nível reaproveita o anterior (o lock reaparece no pipe e nos garfos). O núcleo do xv6 não usa semáforo, então o nível 1 usa lock. |
| D4 | xv6 e Linux | Nomes reais na tela (`acquire`, `release`, `sleep`, `wakeup`, `nread`, `nwrite`, `PIPESIZE`) e painel "Como o xv6 e o Linux fazem". O futex é descrito como "tenta pegar o lock no espaço de usuário e só dorme no núcleo se houver disputa". | Liga o simulador ao conteúdo das outras partes do trabalho. O texto do futex foi corrigido pelo autor porque "dorme em vez de girar" era incompleto. |
| D5 | Controle | O usuário é o escalonador: escolhe qual processo roda a cada passo. Desafios valem até 3 estrelas, sem derrota. | Mostra o ponto central: o bug depende da intercalação, e o escalonador é o adversário. |
| D6 | Tempo | Passo a passo e Auto (escalonador aleatório), velocidade de 0,5× a 4×, Voltar 1 passo e atalhos de teclado. | O passo a passo serve para aprender; o Auto, para a demonstração. Voltar dá liberdade para experimentar. |
| D7 | Entrada do usuário | Nível 1: 2 a 4 processos, 1 a 5 incrementos, lock ligado/desligado. Nível 2: PIPESIZE de 1 a 8, 1 a 2 produtores, 1 a 2 consumidores, itens, versão (correta, sem checagem, ingênua). Nível 3: 3 a 6 filósofos e estratégia (esquerdo, ordem global, um canhoto). | O enunciado sugere que o usuário defina a entrada. Os limites mantêm a tela legível. |
| D8 | Explicação | Frase curta por passo, tutorial de 3 telas, glossário e "Por que isso aconteceu?" ao fim de cada desafio. | Quem não construiu o simulador precisa conseguir explicá-lo (regra do grupo). |
| D9 | Visual | ~~Painel técnico, tema claro de alto contraste, metáfora só na mesa dos filósofos.~~ **Substituída em 12/11/2026** pela identidade "Fábrica de Processos" (ver "D9 substituída", abaixo). | O motivo original era o contraste no projetor. A primeira interface foi reprovada por ser "feia, nada intuitiva" e sem identidade. |
| D10 | Público e tela | Prioridade para projetor e notebook; celular funcionando. Acessibilidade mínima: teclado, contraste AA, estado com ícone e texto (não só cor), `prefers-reduced-motion`. | É onde o simulador vai ser visto (aula e colegas). |
| D11 | Técnica | Um arquivo, JS puro, **zero rede**, sem som; progresso no `localStorage` com `try/catch` e botão de apagar. | Precisa funcionar aberto do disco (`file://`, Padlet) e no GitHub Pages. Sem armazenamento, o simulador funciona igual; só não lembra as estrelas. |
| D12 | Verificação | Casos à mão em `VERIFICACAO.md` e testes com `node:test`, sem instalar nada. | O enunciado pede conferência com exemplos feitos à mão; os testes repetem essa conferência a cada mudança. |
| D13 | Entregáveis | `index.html`, `NIELSEN.md`, `DECISOES.md`, `PROMPTS.md`, `VERIFICACAO.md`, `ROTEIRO-APRESENTACAO.md`, `PUBLICAR.md`, `VIDEO.md`, `README.md`. O repositório público leva todos. | Dão insumo para a justificativa (Pessoa 3) e para a apresentação (Pessoa 2), e deixam o uso de IA transparente. |
| D14 | Local e Git | Pasta `jogo-sincronizacao-so`, arquivo `index.html`, git local com um commit por parte, sem remoto e sem push. | `index.html` é o que o GitHub Pages abre por padrão. Publicar é tarefa do autor. |
| D15 | Versões | Os 3 níveis já na v1 de 20/11; o prazo de 25/11 fica só para correções. Demonstração ao vivo de 5 min. | O Padlet de 20/11 já mostra o escopo inteiro. |
| D16 | Vídeo e publicação | Vídeo do autor = explicação e demonstração do simulador, de 5 a 7 min. Modo apresentação: fonte maior, tela cheia e cenário pré-carregado. Guias em checklist. | Facilita gravar e projetar. |

## Ajustes aprovados depois do resumo do design

| Ajuste | Onde está |
|---|---|
| No xv6, `acquire` desliga as interrupções (`push_off`), então quem segura o lock não é interrompido naquela CPU; quem gira é outra CPU. No simulador, cada processo representa um fluxo concorrente (como se estivesse noutra CPU), e os passos intercalados representam essa concorrência. | Painel do nível 1 e lista de simplificações (`README.md`). |
| Nota do semáforo: "o núcleo do xv6 não usa semáforo; em espaço de usuário dá para montar um com pipe (um byte no pipe = uma permissão)". | Painel do nível 1 e glossário. |
| Título "Simulador: Sincronização, Comunicação e Deadlock"; interface em pt-BR; casos à mão escritos pela IA para o grupo conferir. | Toda a interface e `VERIFICACAO.md`. |

## Decisões de implementação (dentro do que foi aprovado)

| Decisão | Por quê |
|---|---|
| A lógica fica num bloco `<script id="logica">`, sem DOM nem rede. Cada nível é uma máquina de estados com a mesma interface: `criar`, `executaveis`, `passo`, `situacao`, `programa`. | O teste lê esse bloco de dentro do `index.html`, então o simulador continua sendo um arquivo só. A mesma interface nos três níveis deixa a tela igual para todos. |
| `passo()` nunca altera o estado recebido: devolve uma cópia. | Permite "Voltar 1 passo" (uma pilha de estados) e a busca exaustiva nos testes. |
| Os testes fazem **busca em largura sobre todas as intercalações** em casos pequenos. | Provar "com lock nunca perde" ou "ordem global nunca trava" exige olhar **todas** as ordens, não algumas. |
| `contador++` tem 2 passos: `reg = contador` e `contador = reg + 1`. | É o menor modelo que mostra a atualização perdida, e bate com o exemplo do professor (ler-ler-escrever-escrever). |
| Pipe com 1 item por `write`/`read` e PIPESIZE de 1 a 8. | Assim dá para ver cheio e vazio em poucos passos. |
| A versão ingênua do pipe é fixa em 1 produtor e 1 consumidor, com aviso na tela. | Sem lock, dois produtores corromperiam `nwrite`; o foco dela é o lost wakeup. |
| Filósofos: quem espera um garfo fica bloqueado e volta a tentar quando o garfo é solto. | Assim "ninguém pode rodar" coincide com o ciclo no grafo, o que deixa a detecção visível. |
| Detecção de ciclo por DFS com três cores (branco, cinza, preto) sobre o grafo de alocação. | É o algoritmo clássico. Com recursos de instância única, achar ciclo é achar deadlock. |
| Desafios: ★ por concluir, ★ sem ver a dica e ★ no menor número de passos possível. Esse mínimo foi calculado à mão e conferido por busca exaustiva. | É "estrelas por desafio, sem derrota" (D5). O mínimo nunca é um número inventado. |
| Linha do tempo de intercalação (um processo por linha, um passo por coluna) como elemento principal da tela. | A intercalação é a lição; a linha do tempo a mostra inteira. |
| Fontes do sistema (Segoe UI e equivalentes). | D11: nada pode vir da rede. |
| Bordas claras (`#B9C3D1`, 1,78:1) só em painéis; todo controle tem borda escura (15,97:1). | Painel é só agrupamento; controle precisa ser visto (WCAG 1.4.11). |
| Correções da revisão de interface: botões "Executar" com a cor do processo e estilo principal; título próprio no painel xv6/Linux; abas ligadas a um `tabpanel`; anúncios ao leitor de tela pausados durante o Auto. | Aprovadas pelo autor depois da auditoria (prompt 4). |
| O arquivo `prompt.md` (o prompt inicial original) não entra no Git; o texto dele está em `PROMPTS.md`, com o nome trocado. | Repositório público: não publicar nome pessoal (regra do projeto). |

## D9 substituída: identidade visual "Fábrica de Processos" (fusão)

**Decisão do grupo.** A D9 ("painel técnico, tema claro, metáfora só na mesa") foi substituída
pela fusão escolhida depois de duas rodadas de mockups (três layouts, depois três identidades
visuais):

| Parte | Decisão | Por quê |
|---|---|---|
| Base | "Fábrica de Processos" (neo-brutalismo): fundo amarelo pontilhado, contornos pretos grossos, sombras duras, cores chapadas, faixa de risco preto-amarela no lock, botões que afundam ao clicar. | Identidade forte que se sustenta no projetor sem depender de brilho nem de sala escura. Preto sobre amarelo dá 13:1 de contraste. |
| Forma por processo | Cada processo tem cor **e** forma (● ■ ▲ ◆ ⬢ ⬟), iguais no cartão, na linha do tempo, no código, na mesa e no grafo. | Identificar um processo nunca depende só da cor (acessibilidade e impressão em preto e branco). |
| Da identidade "Fósforo" | No erro e no deadlock, além do carimbo vermelho, aparece a linha `kernel$ alerta: …` com cursor ▌ e um tremor curto da tela. | Liga o erro ao tema de SO e chama a atenção no momento certo. |
| Correção conceitual | A linha diz **"alerta"**, nunca "panic". | Atualização perdida, sobrescrita, lost wakeup e deadlock são erros de **processos**: o kernel não cai. O xv6 só chama `panic()` em erros do próprio kernel (por exemplo, `acquire` de um lock que a CPU já segura), e nenhum caso do simulador é assim. |
| Da identidade "Neon" | Ao clicar em "Executar", o cartão do processo acende na cor dele por 0,75 s. | Mostra qual processo acabou de rodar. |
| Fontes | Só fontes do sistema: Arial Black ou Impact (títulos), Bahnschrift (texto), Consolas (código), com alternativas para Mac e Linux. | Zero rede. Havia fontes OFL na máquina (Geist, Archivo), mas em `.woff2` comprimido: sem instalar nada, não dava para conferir a licença dentro do próprio arquivo, como o projeto exige. |

## Decisões da rodada de interface (dentro da fusão aprovada)

| Decisão | Por quê |
|---|---|
| Layout em **palco**: o estado compartilhado (contador, buffer em anel, mesa e grafo) no centro, e os processos com o botão "Executar" em volta. | A ação principal fica colada no que ela muda. Resolve "não está claro o que fazer primeiro". |
| **Uma barra superior** só (nome, níveis, Desafios, Glossário, Ajuda, Apresentar). | Antes eram três faixas empilhadas antes do conteúdo. |
| Parâmetros numa **gaveta** ("Ajustar"), com o resumo atual sempre visível no palco. | Os parâmetros ocupavam a coluna da direita acima do que importa. |
| "Próximo passo" passou a se chamar **"Passo aleatório"**, como controle secundário na faixa de narração. | Ele competia com "Executar Pn", que é a ação principal. |
| Buffer do pipe desenhado como **anel**, com R e W fora do anel e a conta `nwrite − nread` escrita. | O "buffer circular" fica visível e os ponteiros ficam legíveis. |
| **Linha do tempo em raias** (uma por processo), com coluna tracejada "próximo passo" e mensagem de estado vazio. | A intercalação é a lição. Antes, o estado vazio eram caixas em branco. |
| Código de cada processo sempre visível, **sem quebrar linha** (comentário numa coluna própria, que pode ser cortada). | O comentário quebrado no meio da linha parecia defeito. |
| Nível 3 com **cartões compactos** (uma linha por filósofo). | Todos os botões "Executar" ficam acima da dobra em 1366×768, com até 6 filósofos. |
| Condições de Coffman: "● presente" em bloco preto e "○ ausente" tracejado, sem vermelho/verde. | "✓ presente" em vermelho confundia (marca de certo com cor de erro). |
| Diálogo Desafios em **grade fixa** (número, título, estrelas, botão). | Antes cada linha tinha um layout. |
| **Modo apresentação**: fonte 116%, tela cheia, cenário padrão do nível; o código e o histórico saem da tela (o painel xv6/Linux fica, porque o roteiro o usa). | Antes ele só aumentava a fonte e piorava o empilhamento. |
| Mais duas cores e formas (P4 rosa ⬢, P5 verde-limão ⬟). | O nível 3 vai até 6 filósofos. |
| `mockups/` e `screenshots/` ficam fora do Git (`.gitignore`). | São material de trabalho, não entregável. |
