# Roteiro do vídeo (7 minutos)

**Quem lê:** o autor, gravando a tela e a voz.

**Duração:** cerca de 7 minutos de fala, 921 palavras a 130 por minuto, que é um ritmo calmo.

**Antes de gravar, deixe pronto:**

- [ ] Abas, programas e notificações fechados (no Windows, ative "Não incomodar").
- [ ] Uma gravação de teste inteira, seguindo este roteiro. Depois feche a janela.
- [ ] O simulador numa janela anônima **nova**, para o tutorial aparecer como na primeira visita,
      pelo link "Pela internet" do `README.md`.
- [ ] O tutorial na primeira tela, "Você é o escalonador".
- [ ] Zoom do navegador em 100%: **Ctrl+0**. Tela cheia com **F11**.
- [ ] **Não** use o modo Apresentar no vídeo: ele esconde os botões **Desafios**, **Glossário** e
      **Ajuda** e o código dos processos, que este roteiro mostra.
- [ ] Microfone testado: grave 10 segundos e ouça.
- [ ] O gravador de tela que você já tem (no Windows, a Barra de Jogos abre com **Win+G**).
- [ ] Este roteiro noutra tela ou impresso.

**Ordem dos trechos:**

| Trecho | Tempo | Palavras |
|---|---|---|
| 1. Abertura | 0:00–0:30 | 63 |
| 2. Tutorial e glossário | 0:30–1:10 | 85 |
| 3. Nível 1: condição de corrida | 1:10–2:00 | 108 |
| 4. Nível 1: spinlock e o painel do xv6 | 2:00–2:50 | 113 |
| 5. Nível 2: o lost wakeup | 2:50–3:50 | 130 |
| 6. Nível 2: a versão do xv6 | 3:50–4:25 | 77 |
| 7. Nível 3: deadlock | 4:25–5:10 | 99 |
| 8. Nível 3: ordem global | 5:10–5:45 | 75 |
| 9. Desafios | 5:45–6:05 | 45 |
| 10. Terminal | 6:05–6:30 | 55 |
| 11. Fork bomb e fechamento | 6:30–7:05 | 71 |
| Total | 7:05 | 921 |

---

## Como ler

- **NA TELA:** o que você faz na tela, em ordem. Risque cada item quando fizer.
- **FALE:** o texto para ler em voz alta, uma frase por linha. O **negrito** marca onde a voz pesa.
- *(pausa)*: pare uns dois segundos e deixe a tela aparecer no vídeo.
- *(ação: ...)*: pare de ler, faça na tela o que está escrito e só então siga.
- **Teclas:** **1** a **5** executam o processo daquela posição (**1** é o primeiro cartão).
  **Z** volta um passo. **R** reinicia o nível.
- **Pergunta "Perder a simulação atual?":** aparece quando você troca de nível, clica em
  **Aplicar e reiniciar** ou começa um desafio depois de dar passos. Clique sempre em **Continuar**.
  Não aperte Enter: o botão que já vem marcado é o **Cancelar**.

---

## 1. Abertura · 0:00–0:30

63 palavras, cerca de 29 s.

**NA TELA**

- [ ] Tutorial aberto na primeira tela.
- [ ] Não clique em nada ainda.

**FALE**

Olá.

Este é o simulador de sincronização, comunicação e deadlock do nosso **projeto integrador**.

É um arquivo HTML só, que roda no navegador, até **sem internet**.

Ele tem **três níveis**.

Um contador compartilhado, um pipe entre produtor e consumidor e o jantar dos filósofos.

Em cada nível, a gente **provoca um bug** e depois vê a **correção**.

Vamos passo a passo, com calma.

*(pausa)*

---

## 2. Tutorial e glossário · 0:30–1:10

85 palavras, cerca de 39 s.

**NA TELA**

- [ ] Deixe a primeira tela do tutorial à vista.
- [ ] Clique em **Próximo**.
- [ ] Clique em **Próximo** de novo.
- [ ] Na última tela, clique em **Começar**.
- [ ] Clique em **Glossário**, no topo.
- [ ] Role a lista devagar.
- [ ] Clique em **Fechar**.

**FALE**

O tutorial começa pelo nosso papel: aqui a gente é o **escalonador**.

O escalonador é a parte do sistema operacional que decide quem usa a **CPU** a cada momento.

A cada passo, a gente escolhe qual processo executa a **próxima linha**.

*(ação: Próximo, Próximo, Começar)*

Dá para clicar em **Executar** no cartão do processo ou usar as teclas de **1 a 6**.

A **linha do tempo**, mais abaixo, mostra a ordem que a gente escolheu.

*(ação: Glossário; role a lista devagar; Fechar)*

No topo também fica o **glossário**, com os **quinze** termos que aparecem no simulador.

*(pausa)*

---

## 3. Nível 1: condição de corrida · 1:10–2:00

108 palavras, cerca de 50 s.

**NA TELA**

- [ ] Nível 1, sem lock.
- [ ] Aponte os cartões **P0** e **P1** e o contador em 0.
- [ ] Aperte **1**, depois **2**.
- [ ] Aperte **1**, depois **2**.
- [ ] Aponte "atualizações perdidas: 1" e a linha `kernel$ alerta`.

**FALE**

*(ação: aponte P0, P1 e o contador; aperte 1, depois 2)*

No primeiro nível, dois processos somam 1 no **mesmo contador**, duas vezes cada.

O simulador **intercala** os passos.

Cada processo representa um **fluxo concorrente**, como se estivesse noutra CPU.

`contador++` parece uma coisa só, mas são **dois passos**: ler e escrever.

P0 leu **zero**.

P1 **também** leu zero.

*(ação: aperte 1, depois 2; aponte "atualizações perdidas: 1" e `kernel$ alerta`)*

P0 escreveu 1, e P1 escreveu 1 **por cima**.

Um incremento sumiu: é uma **atualização perdida**.

Depois de dois incrementos, o contador deveria valer **2**, e vale **1**.

*(pausa)*

Isso é uma **condição de corrida**: o resultado depende da ordem em que os passos se intercalam.

A tela mostra um alerta, mas o kernel **não cai**.

O erro é **dos processos**.

---

## 4. Nível 1: spinlock e o painel do xv6 · 2:00–2:50

113 palavras, cerca de 52 s.

**NA TELA**

- [ ] Clique em **Ajustar**.
- [ ] Marque **Proteger com lock (spinlock)**.
- [ ] Clique em **Aplicar e reiniciar**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Aperte **1**, **2**, **1**, **2**.
- [ ] Role a página para baixo e clique em **Como o xv6 e o Linux fazem**.
- [ ] Role o painel devagar.

**FALE**

*(ação: Ajustar, marque Proteger com lock (spinlock), Aplicar e reiniciar, Continuar)*

O trecho que mexe no contador é a **seção crítica**.

Só **um** processo pode estar nele por vez.

Para isso existe o **lock**, uma trava: `acquire` fecha e `release` abre.

*(ação: aperte 1, 2, 1, 2)*

P0 **pegou** o lock.

P1 encontrou o lock **ocupado** e girou, gastando o passo sem avançar.

Por isso o nome **spinlock**.

Enquanto P0 não soltar o lock, P1 **não chega perto** do contador.

*(ação: role para baixo, clique em Como o xv6 e o Linux fazem, role o painel devagar)*

Este painel mostra o spinlock do **xv6**, simplificado.

No xv6, `acquire` **desliga as interrupções** naquela CPU.

Quem gira esperando é **outra CPU**.

No Linux, o **futex** tenta pegar o lock no espaço de usuário e só dorme no núcleo se houver **disputa**.

E o núcleo do xv6 **não usa semáforo**.

---

## 5. Nível 2: o lost wakeup · 2:50–3:50

130 palavras, cerca de 1 min.

**NA TELA**

- [ ] Clique na aba **2 Pipe**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Clique em **Ajustar**.
- [ ] Em **Versão**, escolha **Ingênua: teste e sleep separados, sem lock**.
- [ ] Clique em **Aplicar e reiniciar**.
- [ ] Aperte **2**, depois **1** quatro vezes.
- [ ] Aponte o aviso "Wakeup perdido".
- [ ] Aperte **1**, depois **2**, depois **1**.
- [ ] Aponte a linha `kernel$ alerta: travado`.

**FALE**

*(ação: aba 2 Pipe, Continuar; Ajustar, Versão Ingênua, Aplicar e reiniciar)*

O segundo nível é **comunicação**: o pipe do xv6, com um produtor e um consumidor.

Os itens ficam num **buffer circular**, um vetor pequeno que volta ao começo quando chega ao fim.

`nread` conta o que já foi **lido**, e `nwrite`, o que já foi **escrito**.

Com o buffer vazio, o consumidor dorme com **`sleep`**.

Quando chega item, o produtor chama **`wakeup`** e acorda quem dorme.

No anel, o **R** marca onde o consumidor lê, e o **W**, onde o produtor escreve.

Nesta versão ingênua, testar e dormir são **passos separados**.

*(ação: aperte 2, depois 1 quatro vezes; aponte "Wakeup perdido")*

O consumidor viu o buffer vazio e decidiu dormir, mas **ainda não** dormiu.

O produtor escreveu e chamou `wakeup`.

**Não tinha ninguém** dormindo, e o aviso se perdeu.

*(ação: aperte 1, depois 2, depois 1; aponte `kernel$ alerta: travado`)*

Agora os dois dormem **para sempre**.

Esse é o **lost wakeup**.

---

## 6. Nível 2: a versão do xv6 · 3:50–4:25

77 palavras, cerca de 36 s.

**NA TELA**

- [ ] Clique em **Ajustar**.
- [ ] Em **Versão**, escolha **Correta (como o xv6)**.
- [ ] Clique em **Aplicar e reiniciar**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Aperte **1** onze vezes, com calma.
- [ ] Aperte **2** quatro vezes.

**FALE**

*(ação: Ajustar, Versão Correta (como o xv6), Aplicar e reiniciar, Continuar; aperte 1 onze vezes, com calma)*

Na versão correta, como no xv6, o produtor pega o **lock** antes de testar.

Ele encheu o buffer e foi dormir.

Olha a frase na tela: o `sleep` solta o lock e dorme **de uma vez**.

Assim, ninguém consegue chamar `wakeup` **no meio do caminho**.

*(ação: aperte 2 quatro vezes)*

O consumidor leu um item e chamou `wakeup`.

O produtor acordou.

**Nada** se perdeu.

É o **mesmo pipe** do xv6: `nread`, `nwrite`, `sleep` e `wakeup`, com o lock do pipe em volta.

---

## 7. Nível 3: deadlock · 4:25–5:10

99 palavras, cerca de 46 s.

**NA TELA**

- [ ] Clique na aba **3 Filósofos**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Aperte **1**, **2**, **3**, **4**, **5**.
- [ ] Aperte **1**, **2**, **3**, **4**, **5** de novo.
- [ ] Aponte o ciclo vermelho no grafo e as condições de Coffman.

**FALE**

*(ação: aba 3 Filósofos, Continuar; aperte 1, 2, 3, 4, 5)*

O terceiro nível é **deadlock**, com o jantar dos filósofos.

São **cinco** filósofos e **cinco** garfos, e cada um precisa de dois garfos para comer.

Todos pegaram o garfo da **esquerda**.

O **grafo** mostra quem está com cada garfo e quem espera qual garfo.

*(ação: aperte 1, 2, 3, 4, 5 de novo; aponte o ciclo vermelho e as condições de Coffman)*

Agora cada um espera o garfo do **vizinho**, segurando o seu.

Isso é um **deadlock**: cada um espera um recurso que está com outro do grupo.

No grafo de alocação aparece o ciclo, que é a **espera circular**.

Como cada garfo é **um só**, ciclo aqui é deadlock.

As **quatro condições** de Coffman estão presentes.

---

## 8. Nível 3: ordem global · 5:10–5:45

75 palavras, cerca de 35 s.

**NA TELA**

- [ ] Clique em **Ajustar**.
- [ ] Em **Estratégia para pegar os garfos**, escolha **Ordem global (menor número primeiro)**.
- [ ] Clique em **Aplicar e reiniciar**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Aperte **1**, **2**, **3**, **4**, **5**.
- [ ] Aperte **4** três vezes.

**FALE**

*(ação: Ajustar, Ordem global, Aplicar e reiniciar, Continuar; aperte 1, 2, 3, 4, 5)*

A correção é a **ordem global**: todos pegam primeiro o garfo de **menor número**.

F4 precisa do garfo zero primeiro e espera **sem segurar nada**.

*(ação: aperte 4 três vezes)*

F3 pegou o segundo garfo, comeu e **soltou os dois**.

A espera circular **não se forma**.

O grafo fica **sem ciclo**, e nas condições de Coffman a espera circular aparece como **ausente**.

No xv6, a regra para locks é a mesma: quem precisa de vários pega sempre na **mesma ordem**.

---

## 9. Desafios · 5:45–6:05

45 palavras, cerca de 21 s.

**NA TELA**

- [ ] Clique em **Desafios**, no topo.
- [ ] Clique em **Começar 1.1**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Aperte **1**, **2**, **2**, **1**.
- [ ] Espere a janela "Desafio concluído".
- [ ] Clique em **Continuar explorando**.

**FALE**

*(ação: Desafios, Começar 1.1, Continuar; aperte 1, 2, 2, 1; espere "Desafio concluído")*

Os desafios são **opcionais**.

Cada um vale até **três estrelas**, e não existe derrota.

Se travar, dá para pedir uma **dica**.

Este pede uma **atualização perdida**.

*(pausa)*

Ao concluir, a janela explica **por que** aquilo aconteceu.

O desafio seguinte pede o mesmo **com o lock** ligado.

*(ação: clique em Continuar explorando)*

---

## 10. Terminal · 6:05–6:30

55 palavras, cerca de 25 s.

**NA TELA**

- [ ] Clique no campo `kernel$` do rodapé, onde aparece "help" apagado.
- [ ] Digite `help` e aperte **Enter**.
- [ ] Digite `ps` e aperte **Enter**.
- [ ] Digite `glossario deadlock` e aperte **Enter**.

**FALE**

*(ação: campo kernel$ do rodapé; digite help, Enter)*

O simulador também tem um **terminal**.

Ele abre por este campo do rodapé ou pela tecla **crase**.

O `help` lista os comandos, **por categoria**.

*(ação: digite ps, Enter)*

O `ps` mostra os processos do nível e o **estado** de cada um.

*(ação: digite glossario deadlock, Enter)*

E o `glossario` **explica um termo**.

**Nada roda** de verdade: os comandos usam os mesmos botões da página.

---

## 11. Fork bomb e fechamento · 6:30–7:05

71 palavras, cerca de 33 s.

**NA TELA**

- [ ] Digite `forkbomb` e aperte **Enter**.
- [ ] Não clique em nada durante a animação: um clique fecha.
- [ ] Espere uns 9 segundos, até o cartão "Calma: foi só um easter egg".
- [ ] Com o cartão na tela, aponte os parágrafos do xv6 e do Linux.
- [ ] Clique em **Reiniciar o sistema**.
- [ ] Pare a gravação.

**FALE**

*(ação: digite forkbomb, Enter; sem clicar, espere o cartão "Calma: foi só um easter egg")*

O último comando é um jogo: o **fork bomb**.

Os processos **se copiam** sem parar, até lotar a tabela.

*(pausa)*

Parece que o site caiu, mas é **só animação**.

*(ação: aponte os parágrafos do xv6 e do Linux no cartão)*

No xv6, a tabela de processos tem **64 lugares**.

Quando ela enche, `fork` devolve **menos um**, e o sistema continua de pé.

No Linux, o **`ulimit`** e o controlador **`pids`** do cgroup fazem o `fork` falhar antes.

As simplificações estão no **README**.

Obrigado.

*(ação: clique em Reiniciar o sistema e pare a gravação)*

---

## Se algo der errado

| Problema | O que fazer |
|---|---|
| Apertou a tecla errada | Aperte **Z** (Voltar 1 passo) e siga. No vídeo, dá para cortar o trecho depois. |
| Clicou em **Cancelar** na pergunta | Clique de novo na aba, em **Aplicar e reiniciar** ou em **Começar 1.1** e, desta vez, em **Continuar**. |
| Um clique fechou o fork bomb antes do cartão | No terminal, digite `forkbomb` de novo e não mexa no mouse até o cartão. |
| A página travou ou ficou estranha | Aperte **F5**. O simulador volta ao início, no nível 1: abra a aba do nível em que parou, refaça o **Ajustar** do trecho e regrave a partir dele. |

## Depois de gravar

- [ ] Assista ao vídeo inteiro uma vez: confira se o áudio está claro e se o texto da tela dá para
      ler.
- [ ] Se passar de 7 minutos, corte o trecho dos desafios (5:45–6:05). No terminal, dá para pular
      `ps` e `glossario` e ir direto ao `forkbomb`.
