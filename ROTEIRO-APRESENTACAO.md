# Roteiro da apresentação ao vivo (5 minutos)

**Quem lê:** Pessoa 2, na aula. Não é preciso ter construído o simulador.

**Duração:** 5 minutos de fala, 647 palavras a 130 por minuto, que é um ritmo calmo.

**Antes de começar (fora do tempo), deixe pronto:**

- [ ] O simulador aberto no navegador do projetor, pelo link "Pela internet" do `README.md` (ou o
      `index.html` do disco).
- [ ] Se aparecer o tutorial, clique em **Pular tutorial**.
- [ ] Zoom do navegador em 100%: **Ctrl+0**.
- [ ] Clique em **Apresentar** (ou tecla **P**). A fonte aumenta e a tela fica cheia. Se não ficar
      cheia, aperte **F11**.
- [ ] Aba **1 Contador** selecionada, e ao lado de **Ajustar** está escrito
      "2 processos, 2 incrementos, sem lock".
- [ ] Teste: aperte **1** uma vez e depois **R**. Volta ao passo 0.
- [ ] Este roteiro aberto noutra tela ou impresso.

**Ordem dos trechos:**

| Trecho | Tempo | Palavras |
|---|---|---|
| 1. Abertura | 0:00–0:30 | 67 |
| 2. Nível 1: contador compartilhado | 0:30–1:50 | 167 |
| 3. Nível 2: produtor e consumidor no pipe | 1:50–3:25 | 208 |
| 4. Nível 3: filósofos e deadlock | 3:25–4:35 | 157 |
| 5. Fechamento | 4:35–5:00 | 48 |
| Total | 5:00 | 647 |
| Opcional: fork bomb | fora dos 5 min | 48 |

---

## Como ler

- **NA TELA:** o que você faz na tela, em ordem. Risque cada item quando fizer.
- **FALE:** o texto para ler em voz alta, uma frase por linha. O **negrito** marca onde a voz pesa.
- *(pausa)*: pare uns dois segundos e deixe a turma olhar a tela.
- *(ação: ...)*: pare de ler, faça na tela o que está escrito e só então siga.
- **Teclas:** **1** a **5** executam o processo daquela posição (**1** é o primeiro cartão).
  **Z** volta um passo. **R** reinicia o nível.
- **Pergunta "Perder a simulação atual?":** aparece quando você troca de nível ou clica em
  **Aplicar e reiniciar** depois de dar passos. Clique sempre em **Continuar**. Não aperte Enter: o
  botão que já vem marcado é o **Cancelar**.

**Pronúncia, se ajudar:**

| Termo | Diga |
|---|---|
| `nread` | ene-ríd |
| `nwrite` | ene-ráit |
| `acquire` | acuáier |
| `release` | rilís |
| `wakeup` | uêicâp |
| `sleep` | slíp |
| xv6 | xis-vê-seis |

---

## 1. Abertura · 0:00–0:30

67 palavras, cerca de 30 s.

**NA TELA**

- [ ] Nível 1 aberto, nenhum passo dado.
- [ ] Aponte os dois cartões, **P0** e **P1**.

**FALE**

Olá, pessoal.

Vamos mostrar o nosso simulador de sincronização, comunicação e deadlock.

Ele tem **três níveis**, um para cada assunto.

Aqui eu faço o papel do **escalonador**.

O escalonador é a parte do sistema que decide **quem roda** a cada momento.

A cada passo, eu escolho qual processo executa **uma linha**.

O simulador **intercala** esses passos.

Cada processo representa um **fluxo concorrente**, como se estivesse noutra CPU.

*(pausa)*

---

## 2. Nível 1: contador compartilhado · 0:30–1:50

167 palavras, cerca de 1 min 17 s.

**NA TELA**

- [ ] Aperte **1**, depois **2**.
- [ ] Aperte **1**, depois **2**.
- [ ] Aponte "atualizações perdidas: 1" e a linha `kernel$ alerta`.
- [ ] Clique em **Ajustar**.
- [ ] Marque **Proteger com lock (spinlock)**.
- [ ] Clique em **Aplicar e reiniciar**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Aperte **1**, **2**, **1**, **2**.

**FALE**

*(ação: aperte 1, depois 2)*

Os dois processos querem somar 1 no **mesmo contador**.

Só que `contador++` são **dois passos**: ler o valor e escrever o valor mais 1.

P0 leu **zero**.

P1 **também** leu zero.

*(ação: aperte 1, depois 2; aponte "atualizações perdidas: 1" e `kernel$ alerta`)*

P0 escreveu 1.

P1 escreveu 1 **por cima**.

O incremento de P0 sumiu: é uma **atualização perdida**.

*(pausa)*

Isso se chama **condição de corrida**: o resultado depende da ordem em que os processos rodam.

A tela mostra um alerta, mas o kernel **não cai**.

O erro é **dos processos**.

O trecho que mexe no contador é a **seção crítica**.

Só **um** processo pode estar nele por vez.

*(ação: Ajustar, marque Proteger com lock (spinlock), Aplicar e reiniciar, Continuar)*

Para isso existe o **lock**, uma trava.

Quem entra na seção crítica **fecha** a trava, e quem sai **abre**.

*(ação: aperte 1, 2, 1, 2)*

P0 **pegou** o lock.

P1 tentou pegar, encontrou o lock **ocupado** e girou.

**Girar** é testar de novo, gastando o passo sem avançar.

Por isso o nome **spinlock**.

*(pausa)*

Enquanto P0 não soltar o lock, P1 **não chega perto** do contador.

No xv6 é assim: **`acquire`** pega o spinlock e **`release`** solta.

---

## 3. Nível 2: produtor e consumidor no pipe · 1:50–3:25

208 palavras, cerca de 1 min 36 s.

**NA TELA**

- [ ] Clique na aba **2 Pipe**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Clique em **Ajustar**.
- [ ] Em **Versão**, escolha **Ingênua: teste e sleep separados, sem lock**.
- [ ] Clique em **Aplicar e reiniciar**.
- [ ] Aperte **2**.
- [ ] Aperte **1** quatro vezes.
- [ ] Aponte o aviso "Wakeup perdido".
- [ ] Aperte **1**, depois **2**, depois **1**.
- [ ] Aponte a linha `kernel$ alerta: travado`.
- [ ] Clique em **Ajustar**.
- [ ] Em **Versão**, escolha **Correta (como o xv6)**.
- [ ] Clique em **Aplicar e reiniciar**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Aperte **1** onze vezes, com calma.
- [ ] Aperte **2** quatro vezes.

**FALE**

*(ação: aba 2 Pipe, Continuar; Ajustar, Versão Ingênua, Aplicar e reiniciar)*

O segundo nível é **comunicação**.

Um processo **produz** itens, e outro **consome**, como no pipe do xv6.

Os itens ficam num **buffer circular**.

É um vetor pequeno que, quando chega ao fim, **volta ao começo**.

`nread` conta quantos itens já foram **lidos**, e `nwrite`, quantos foram **escritos**.

Com o buffer vazio, o consumidor dorme: isso é o **`sleep`**.

Quando chega item, o produtor acorda quem dorme: isso é o **`wakeup`**.

Nesta versão ingênua, testar e dormir são **passos separados**.

*(ação: aperte 2)*

O consumidor viu o buffer **vazio** e decidiu dormir.

Mas **ainda não** dormiu.

*(ação: aperte 1 quatro vezes; aponte "Wakeup perdido")*

O produtor escreveu dois itens e chamou `wakeup` **duas vezes**.

**Ninguém** estava dormindo ainda, então o aviso **se perdeu**.

*(ação: aperte 1, depois 2, depois 1; aponte `kernel$ alerta: travado`)*

O produtor viu o buffer **cheio** e foi dormir.

O consumidor **também** dormiu, com dois itens esperando por ele.

*(pausa)*

Os dois dormem **para sempre**.

Esse é o **lost wakeup**, o aviso de acordar que se perdeu.

*(ação: Ajustar, Versão Correta (como o xv6), Aplicar e reiniciar, Continuar; aperte 1 onze vezes, com calma)*

Na versão correta, o produtor pega o **lock** antes de testar se o buffer está cheio.

Ele encheu o buffer e foi dormir.

Olhem a frase na tela: o `sleep` solta o lock e dorme **de uma vez**.

Ninguém consegue chamar `wakeup` **no meio do caminho**.

*(ação: aperte 2 quatro vezes)*

O consumidor leu um item e chamou `wakeup`.

O produtor acordou, e **nada se perdeu**.

---

## 4. Nível 3: filósofos e deadlock · 3:25–4:35

157 palavras, cerca de 1 min 12 s.

**NA TELA**

- [ ] Clique na aba **3 Filósofos**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Aperte **1**, **2**, **3**, **4**, **5**.
- [ ] Aperte **1**, **2**, **3**, **4**, **5** de novo.
- [ ] Aponte o ciclo vermelho no grafo e as condições de Coffman.
- [ ] Clique em **Ajustar**.
- [ ] Em **Estratégia para pegar os garfos**, escolha **Ordem global (menor número primeiro)**.
- [ ] Clique em **Aplicar e reiniciar**.
- [ ] Na pergunta, clique em **Continuar**.
- [ ] Aperte **1**, **2**, **3**, **4**, **5**.
- [ ] Aperte **4** três vezes.

**FALE**

*(ação: aba 3 Filósofos, Continuar; aperte 1, 2, 3, 4, 5)*

O terceiro nível é **deadlock**, com o jantar dos filósofos.

São **cinco** filósofos e **cinco** garfos, e cada um precisa de dois garfos para comer.

Cada filósofo pegou o garfo da **esquerda**.

*(ação: aperte 1, 2, 3, 4, 5 de novo; aponte o ciclo vermelho e as condições de Coffman)*

Agora cada um espera o garfo do **vizinho**, segurando o seu.

**Ninguém** avança.

Isso é um **deadlock**: cada um espera um recurso que está com outro do grupo.

*(pausa)*

No grafo, o ciclo aparece em **vermelho**.

Esse ciclo é a **espera circular**: um espera o outro, até voltar ao primeiro.

As **quatro condições** de Coffman estão presentes, e as quatro juntas dão deadlock.

*(ação: Ajustar, Ordem global, Aplicar e reiniciar, Continuar; aperte 1, 2, 3, 4, 5)*

A correção é a **ordem global**: todo mundo pega primeiro o garfo de **menor número**.

O último filósofo, **F4**, precisa do garfo zero primeiro.

Ele espera **sem segurar nada**.

*(ação: aperte 4 três vezes)*

F3 pegou o segundo garfo, comeu e **soltou os dois**.

A espera circular **não se forma**.

No xv6, a regra para locks é a mesma: quem precisa de vários pega sempre na **mesma ordem**.

---

## 5. Fechamento · 4:35–5:00

48 palavras, cerca de 22 s.

**NA TELA**

- [ ] Deixe o nível 3 na tela.

**FALE**

O simulador **simplifica** algumas coisas.

Cada passo é uma linha que acontece **inteira**, e não há várias CPUs de verdade.

Não usamos **semáforo** porque o núcleo do xv6 também não usa.

Conferimos os casos à mão e com testes que percorrem **todas as intercalações** em casos pequenos.

Obrigado.

---

## OPCIONAL, fora dos 5 min · Fork bomb

Só se sobrar tempo. 48 palavras, cerca de 22 s.

**NA TELA**

- [ ] Clique no campo `kernel$` do rodapé.
- [ ] Digite `forkbomb` e aperte **Enter**.
- [ ] Não clique em nada durante a animação: um clique fecha.
- [ ] Espere uns 9 segundos, até o cartão "Calma: foi só um easter egg".
- [ ] Clique em **Reiniciar o sistema**.
- [ ] Aperte **Esc**.

**FALE**

*(ação: campo kernel$, digite forkbomb, Enter; não clique em nada)*

Para fechar, um easter egg do terminal: um **fork bomb**.

São processos que **se copiam** sem parar.

*(pausa)*

Parece que o site caiu, mas é **só animação**.

No xv6, a tabela de processos tem **64 lugares**.

Quando ela enche, `fork` devolve **menos um**, e o sistema continua de pé.

*(ação: com o cartão na tela, Reiniciar o sistema; Esc)*

---

## Se algo der errado

| Problema | O que fazer |
|---|---|
| Apertou a tecla errada | Aperte **Z** (Voltar 1 passo) e siga. |
| Clicou em **Cancelar** na pergunta | Clique de novo na aba ou em **Aplicar e reiniciar** e, desta vez, em **Continuar**. |
| Perdeu a sequência | Aperte **R** e refaça as teclas do trecho desde o começo. Se reiniciou sem querer, clique em **Desfazer reinício**. |
| A página travou ou ficou estranha | Aperte **F5**. O simulador volta ao início, no nível 1 e sem o modo Apresentar: aperte **P**, abra a aba do nível em que parou e refaça o **Ajustar** do trecho. |
