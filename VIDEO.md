# Roteiro do vídeo (7 minutos)

- **Quem lê:** o autor, gravando a tela e a voz.
- **Duração:** cerca de 7 minutos de fala, 921 palavras a 130 por minuto, que é um ritmo calmo.
- **Como ler:** **NA TELA** é o que você faz, antes de ler a fala logo abaixo. **FALE** é o texto
  para ler em voz alta, uma frase por linha. "(pausa)" quer dizer: pare uns dois segundos e deixe a
  tela aparecer no vídeo.
- **Teclas:** `1` a `5` executam o processo daquela posição (`1` é o primeiro cartão). `Z` volta um
  passo. `R` reinicia o nível.
- **Pergunta "Perder a simulação atual?":** aparece quando você troca de nível, clica em
  **Aplicar e reiniciar** ou começa um desafio depois de dar passos. Clique sempre em **Continuar**.
  Não aperte Enter: o botão que já vem marcado é o **Cancelar**.

## Antes de gravar

- [ ] Feche abas, programas e notificações (no Windows, ative "Não incomodar").
- [ ] Faça uma gravação de teste inteira, seguindo este roteiro. Depois feche a janela.
- [ ] Abra o simulador numa janela anônima **nova**, para o tutorial aparecer como na primeira
      visita, pelo link "Pela internet" do `README.md`.
- [ ] Deixe o tutorial na primeira tela, "Você é o escalonador".
- [ ] Zoom do navegador em 100%: **Ctrl+0**. Tela cheia com **F11**.
- [ ] **Não** use o modo Apresentar no vídeo: ele esconde os botões **Desafios**, **Glossário** e
      **Ajuda** e o código dos processos, que este roteiro mostra.
- [ ] Teste o microfone: grave 10 segundos e ouça.
- [ ] Use o gravador de tela que você já tem (no Windows, a Barra de Jogos abre com **Win+G**).
- [ ] Deixe este roteiro noutra tela ou impresso.

### 0:00–0:30 · Abertura

*Fala: 63 palavras (~29 s).*

**NA TELA:** tutorial aberto na primeira tela. Não clique em nada ainda.

**FALE:**

Olá.

Este é o simulador de sincronização, comunicação e deadlock do nosso projeto integrador.

É um arquivo HTML só, que roda no navegador, até sem internet.

Ele tem três níveis.

Um contador compartilhado, um pipe entre produtor e consumidor e o jantar dos filósofos.

Em cada nível, a gente provoca um bug e depois vê a correção.

Vamos passo a passo, com calma.

(pausa)

### 0:30–1:10 · Tutorial e glossário

*Fala: 85 palavras (~39 s).*

**NA TELA:** deixe a primeira tela do tutorial à vista.

**FALE:**

O tutorial começa pelo nosso papel: aqui a gente é o escalonador.

O escalonador é a parte do sistema operacional que decide quem usa a CPU a cada momento.

A cada passo, a gente escolhe qual processo executa a próxima linha.

**NA TELA:** clique em **Próximo**, depois em **Próximo** de novo e, na última tela, em
**Começar**.

**FALE:**

Dá para clicar em Executar no cartão do processo ou usar as teclas de 1 a 6.

A linha do tempo, mais abaixo, mostra a ordem que a gente escolheu.

**NA TELA:** clique em **Glossário**, no topo. Role a lista devagar. Clique em **Fechar**.

**FALE:**

No topo também fica o glossário, com os quinze termos que aparecem no simulador.

(pausa)

### 1:10–2:00 · Nível 1: condição de corrida

*Fala: 108 palavras (~50 s).*

**NA TELA:** nível 1, sem lock. Aponte os cartões P0 e P1 e o contador em 0. Aperte **1**, depois
**2**.

**FALE:**

No primeiro nível, dois processos somam 1 no mesmo contador, duas vezes cada.

O simulador intercala os passos.

Cada processo representa um fluxo concorrente, como se estivesse noutra CPU.

`contador++` parece uma coisa só, mas são dois passos: ler e escrever.

P0 leu zero.

P1 também leu zero.

**NA TELA:** aperte **1**, depois **2**. Aponte "atualizações perdidas: 1" e a linha
`kernel$ alerta`.

**FALE:**

P0 escreveu 1, e P1 escreveu 1 por cima.

Um incremento sumiu: é uma atualização perdida.

Depois de dois incrementos, o contador deveria valer 2, e vale 1.

(pausa)

Isso é uma condição de corrida: o resultado depende da ordem em que os passos se intercalam.

A tela mostra um alerta, mas o kernel não cai.

O erro é dos processos.

### 2:00–2:50 · Nível 1: spinlock e o painel do xv6

*Fala: 113 palavras (~52 s).*

**NA TELA:** clique em **Ajustar**, marque **Proteger com lock (spinlock)** e clique em
**Aplicar e reiniciar**. Na pergunta, clique em **Continuar**.

**FALE:**

O trecho que mexe no contador é a seção crítica.

Só um processo pode estar nele por vez.

Para isso existe o lock, uma trava: `acquire` fecha e `release` abre.

**NA TELA:** aperte **1**, **2**, **1**, **2**.

**FALE:**

P0 pegou o lock.

P1 encontrou o lock ocupado e girou, gastando o passo sem avançar.

Por isso o nome spinlock.

Enquanto P0 não soltar o lock, P1 não chega perto do contador.

**NA TELA:** role a página para baixo e clique em **Como o xv6 e o Linux fazem**. Role o painel
devagar.

**FALE:**

Este painel mostra o spinlock do xv6, simplificado.

No xv6, `acquire` desliga as interrupções naquela CPU.

Quem gira esperando é outra CPU.

No Linux, o futex tenta pegar o lock no espaço de usuário e só dorme no núcleo se houver disputa.

E o núcleo do xv6 não usa semáforo.

### 2:50–3:50 · Nível 2: o lost wakeup

*Fala: 130 palavras (~1 min).*

**NA TELA:** clique na aba **2 Pipe**. Na pergunta, clique em **Continuar**. Depois clique em
**Ajustar**, escolha em **Versão** a opção **Ingênua: teste e sleep separados, sem lock** e clique em
**Aplicar e reiniciar**.

**FALE:**

O segundo nível é comunicação: o pipe do xv6, com um produtor e um consumidor.

Os itens ficam num buffer circular, um vetor pequeno que volta ao começo quando chega ao fim.

`nread` conta o que já foi lido, e `nwrite`, o que já foi escrito.

Com o buffer vazio, o consumidor dorme com `sleep`.

Quando chega item, o produtor chama `wakeup` e acorda quem dorme.

No anel, o R marca onde o consumidor lê, e o W, onde o produtor escreve.

Nesta versão ingênua, testar e dormir são passos separados.

**NA TELA:** aperte **2**, depois **1** quatro vezes. Aponte o aviso "Wakeup perdido".

**FALE:**

O consumidor viu o buffer vazio e decidiu dormir, mas ainda não dormiu.

O produtor escreveu e chamou `wakeup`.

Não tinha ninguém dormindo, e o aviso se perdeu.

**NA TELA:** aperte **1**, depois **2**, depois **1**. Aponte a linha
`kernel$ alerta: travado`.

**FALE:**

Agora os dois dormem para sempre.

Esse é o lost wakeup.

### 3:50–4:25 · Nível 2: a versão do xv6

*Fala: 77 palavras (~36 s).*

**NA TELA:** clique em **Ajustar**, escolha em **Versão** a opção **Correta (como o xv6)** e clique
em **Aplicar e reiniciar**. Na pergunta, clique em **Continuar**. Depois aperte **1** onze vezes,
com calma.

**FALE:**

Na versão correta, como no xv6, o produtor pega o lock antes de testar.

Ele encheu o buffer e foi dormir.

Olha a frase na tela: o `sleep` solta o lock e dorme de uma vez.

Assim, ninguém consegue chamar `wakeup` no meio do caminho.

**NA TELA:** aperte **2** quatro vezes.

**FALE:**

O consumidor leu um item e chamou `wakeup`.

O produtor acordou.

Nada se perdeu.

É o mesmo pipe do xv6: `nread`, `nwrite`, `sleep` e `wakeup`, com o lock do pipe em volta.

### 4:25–5:10 · Nível 3: deadlock

*Fala: 99 palavras (~46 s).*

**NA TELA:** clique na aba **3 Filósofos**. Na pergunta, clique em **Continuar**. Depois aperte
**1**, **2**, **3**, **4**, **5**.

**FALE:**

O terceiro nível é deadlock, com o jantar dos filósofos.

São cinco filósofos e cinco garfos, e cada um precisa de dois garfos para comer.

Todos pegaram o garfo da esquerda.

O grafo mostra quem está com cada garfo e quem espera qual garfo.

**NA TELA:** aperte **1**, **2**, **3**, **4**, **5** de novo. Aponte o ciclo vermelho no grafo e
as condições de Coffman.

**FALE:**

Agora cada um espera o garfo do vizinho, segurando o seu.

Isso é um deadlock: cada um espera um recurso que está com outro do grupo.

No grafo de alocação aparece o ciclo, que é a espera circular.

Como cada garfo é um só, ciclo aqui é deadlock.

As quatro condições de Coffman estão presentes.

### 5:10–5:45 · Nível 3: ordem global

*Fala: 75 palavras (~35 s).*

**NA TELA:** clique em **Ajustar**, escolha em **Estratégia para pegar os garfos** a opção
**Ordem global (menor número primeiro)** e clique em **Aplicar e reiniciar**. Na pergunta, clique em
**Continuar**. Depois aperte **1**, **2**, **3**, **4**, **5**.

**FALE:**

A correção é a ordem global: todos pegam primeiro o garfo de menor número.

F4 precisa do garfo zero primeiro e espera sem segurar nada.

**NA TELA:** aperte **4** três vezes.

**FALE:**

F3 pegou o segundo garfo, comeu e soltou os dois.

A espera circular não se forma.

O grafo fica sem ciclo, e nas condições de Coffman a espera circular aparece como ausente.

No xv6, a regra para locks é a mesma: quem precisa de vários pega sempre na mesma ordem.

### 5:45–6:05 · Desafios

*Fala: 45 palavras (~21 s).*

**NA TELA:** clique em **Desafios**, no topo, e em **Começar 1.1**. Na pergunta, clique em
**Continuar**. Aperte **1**, **2**, **2**, **1**. Espere a janela "Desafio concluído".

**FALE:**

Os desafios são opcionais.

Cada um vale até três estrelas, e não existe derrota.

Se travar, dá para pedir uma dica.

Este pede uma atualização perdida.

(pausa)

Ao concluir, a janela explica por que aquilo aconteceu.

O desafio seguinte pede o mesmo com o lock ligado.

**NA TELA:** clique em **Continuar explorando**.

### 6:05–6:30 · Terminal

*Fala: 55 palavras (~25 s).*

**NA TELA:** clique no campo `kernel$` do rodapé, onde aparece "help" apagado. Digite `help` e
aperte Enter.

**FALE:**

O simulador também tem um terminal.

Ele abre por este campo do rodapé ou pela tecla crase.

O `help` lista os comandos, por categoria.

**NA TELA:** digite `ps` e aperte Enter.

**FALE:**

O `ps` mostra os processos do nível e o estado de cada um.

**NA TELA:** digite `glossario deadlock` e aperte Enter.

**FALE:**

E o `glossario` explica um termo.

Nada roda de verdade: os comandos usam os mesmos botões da página.

### 6:30–7:05 · Fork bomb e fechamento

*Fala: 71 palavras (~33 s).*

**NA TELA:** digite `forkbomb` e aperte Enter. Não clique em nada durante a animação, porque um
clique fecha. Espere uns 9 segundos, até o cartão "Calma: foi só um easter egg".

**FALE:**

O último comando é um jogo: o fork bomb.

Os processos se copiam sem parar, até lotar a tabela.

(pausa)

Parece que o site caiu, mas é só animação.

**NA TELA:** com o cartão na tela, aponte os parágrafos do xv6 e do Linux.

**FALE:**

No xv6, a tabela de processos tem 64 lugares.

Quando ela enche, `fork` devolve menos um, e o sistema continua de pé.

No Linux, o `ulimit` e o controlador `pids` do cgroup fazem o `fork` falhar antes.

As simplificações estão no README.

Obrigado.

**NA TELA:** clique em **Reiniciar o sistema** e pare a gravação.

## Se algo der errado

- **Apertou a tecla errada:** aperte **Z** (Voltar 1 passo) e siga. No vídeo, dá para cortar o
  trecho depois.
- **Clicou em Cancelar na pergunta:** clique de novo na aba, em **Aplicar e reiniciar** ou em
  **Começar 1.1** e, desta vez, em **Continuar**.
- **Um clique fechou o fork bomb antes do cartão:** no terminal, digite `forkbomb` de novo e não
  mexa no mouse até o cartão.
- **A página travou ou ficou estranha:** aperte **F5**. O simulador volta ao início, no nível 1:
  abra a aba do nível em que parou, refaça o **Ajustar** do trecho e regrave a partir dele.

## Depois de gravar

- [ ] Assista ao vídeo inteiro uma vez: confira se o áudio está claro e se o texto da tela dá para
      ler.
- [ ] Se passar de 7 minutos, corte o trecho dos desafios (5:45–6:05). No terminal, dá para pular
      `ps` e `glossario` e ir direto ao `forkbomb`.
