# Roteiro da apresentação ao vivo (5 minutos)

- **Quem lê:** Pessoa 2, na aula. Não é preciso ter construído o simulador.
- **Duração:** 5 minutos de fala, 647 palavras a 130 por minuto, que é um ritmo calmo.
- **Como ler:** **NA TELA** é o que você faz, antes de ler a fala logo abaixo. **FALE** é o texto
  para ler em voz alta, uma frase por linha. "(pausa)" quer dizer: pare uns dois segundos e deixe a
  turma olhar a tela.
- **Teclas:** `1` a `5` executam o processo daquela posição (`1` é o primeiro cartão). `Z` volta um
  passo. `R` reinicia o nível.
- **Pergunta "Perder a simulação atual?":** aparece quando você troca de nível ou clica em
  **Aplicar e reiniciar** depois de dar passos. Clique sempre em **Continuar**. Não aperte Enter: o
  botão que já vem marcado é o **Cancelar**.
- **Pronúncia, se ajudar:** `nread` = "ene-ríd"; `nwrite` = "ene-ráit"; `acquire` = "acuáier";
  `release` = "rilís"; `wakeup` = "uêicâp"; `sleep` = "slíp"; xv6 = "xis-vê-seis".

## Antes de começar (fora do tempo)

- [ ] Abra o simulador no navegador do projetor, pelo link "Pela internet" do `README.md` (ou
      abra o `index.html` do disco).
- [ ] Se aparecer o tutorial, clique em **Pular tutorial**.
- [ ] Zoom do navegador em 100%: **Ctrl+0**.
- [ ] Clique em **Apresentar** (ou tecla **P**). A fonte aumenta e a tela fica cheia. Se não ficar
      cheia, aperte **F11**.
- [ ] Confira: aba **1 Contador** selecionada, e ao lado de **Ajustar** está escrito
      "2 processos, 2 incrementos, sem lock".
- [ ] Teste: aperte **1** uma vez e depois **R**. Volta ao passo 0.
- [ ] Deixe este roteiro aberto noutra tela ou impresso.

### 0:00–0:30 · Abertura

*Fala: 67 palavras (~30 s).*

**NA TELA:** nível 1 aberto, nenhum passo dado. Aponte os dois cartões, P0 e P1.

**FALE:**

Olá, pessoal.

Vamos mostrar o nosso simulador de sincronização, comunicação e deadlock.

Ele tem três níveis, um para cada assunto.

Aqui eu faço o papel do escalonador.

O escalonador é a parte do sistema que decide quem roda a cada momento.

A cada passo, eu escolho qual processo executa uma linha.

O simulador intercala esses passos.

Cada processo representa um fluxo concorrente, como se estivesse noutra CPU.

(pausa)

### 0:30–1:50 · Nível 1: contador compartilhado

*Fala: 167 palavras (~1 min 17 s).*

**NA TELA:** aperte **1**, depois **2**.

**FALE:**

Os dois processos querem somar 1 no mesmo contador.

Só que `contador++` são dois passos: ler o valor e escrever o valor mais 1.

P0 leu zero.

P1 também leu zero.

**NA TELA:** aperte **1**, depois **2**. Aponte "atualizações perdidas: 1" e a linha
`kernel$ alerta`.

**FALE:**

P0 escreveu 1.

P1 escreveu 1 por cima.

O incremento de P0 sumiu: é uma atualização perdida.

(pausa)

Isso se chama condição de corrida: o resultado depende da ordem em que os processos rodam.

A tela mostra um alerta, mas o kernel não cai.

O erro é dos processos.

O trecho que mexe no contador é a seção crítica.

Só um processo pode estar nele por vez.

**NA TELA:** clique em **Ajustar**, marque **Proteger com lock (spinlock)** e clique em
**Aplicar e reiniciar**. Na pergunta, clique em **Continuar**.

**FALE:**

Para isso existe o lock, uma trava.

Quem entra na seção crítica fecha a trava, e quem sai abre.

**NA TELA:** aperte **1**, **2**, **1**, **2**.

**FALE:**

P0 pegou o lock.

P1 tentou pegar, encontrou o lock ocupado e girou.

Girar é testar de novo, gastando o passo sem avançar.

Por isso o nome spinlock.

(pausa)

Enquanto P0 não soltar o lock, P1 não chega perto do contador.

No xv6 é assim: `acquire` pega o spinlock e `release` solta.

### 1:50–3:25 · Nível 2: produtor e consumidor no pipe

*Fala: 208 palavras (~1 min 36 s).*

**NA TELA:** clique na aba **2 Pipe**. Na pergunta, clique em **Continuar**. Depois clique em
**Ajustar**, escolha em **Versão** a opção **Ingênua: teste e sleep separados, sem lock** e clique em
**Aplicar e reiniciar**.

**FALE:**

O segundo nível é comunicação.

Um processo produz itens, e outro consome, como no pipe do xv6.

Os itens ficam num buffer circular.

É um vetor pequeno que, quando chega ao fim, volta ao começo.

`nread` conta quantos itens já foram lidos, e `nwrite`, quantos foram escritos.

Com o buffer vazio, o consumidor dorme: isso é o `sleep`.

Quando chega item, o produtor acorda quem dorme: isso é o `wakeup`.

Nesta versão ingênua, testar e dormir são passos separados.

**NA TELA:** aperte **2**.

**FALE:**

O consumidor viu o buffer vazio e decidiu dormir.

Mas ainda não dormiu.

**NA TELA:** aperte **1** quatro vezes. Aponte o aviso "Wakeup perdido".

**FALE:**

O produtor escreveu dois itens e chamou `wakeup` duas vezes.

Ninguém estava dormindo ainda, então o aviso se perdeu.

**NA TELA:** aperte **1**, depois **2**, depois **1**. Aponte a linha
`kernel$ alerta: travado`.

**FALE:**

O produtor viu o buffer cheio e foi dormir.

O consumidor também dormiu, com dois itens esperando por ele.

(pausa)

Os dois dormem para sempre.

Esse é o lost wakeup, o aviso de acordar que se perdeu.

**NA TELA:** clique em **Ajustar**, escolha em **Versão** a opção **Correta (como o xv6)** e clique
em **Aplicar e reiniciar**. Na pergunta, clique em **Continuar**. Depois aperte **1** onze vezes,
com calma.

**FALE:**

Na versão correta, o produtor pega o lock antes de testar se o buffer está cheio.

Ele encheu o buffer e foi dormir.

Olhem a frase na tela: o `sleep` solta o lock e dorme de uma vez.

Ninguém consegue chamar `wakeup` no meio do caminho.

**NA TELA:** aperte **2** quatro vezes.

**FALE:**

O consumidor leu um item e chamou `wakeup`.

O produtor acordou, e nada se perdeu.

### 3:25–4:35 · Nível 3: filósofos e deadlock

*Fala: 157 palavras (~1 min 12 s).*

**NA TELA:** clique na aba **3 Filósofos**. Na pergunta, clique em **Continuar**. Depois aperte
**1**, **2**, **3**, **4**, **5**.

**FALE:**

O terceiro nível é deadlock, com o jantar dos filósofos.

São cinco filósofos e cinco garfos, e cada um precisa de dois garfos para comer.

Cada filósofo pegou o garfo da esquerda.

**NA TELA:** aperte **1**, **2**, **3**, **4**, **5** de novo. Aponte o ciclo vermelho no grafo e
as condições de Coffman.

**FALE:**

Agora cada um espera o garfo do vizinho, segurando o seu.

Ninguém avança.

Isso é um deadlock: cada um espera um recurso que está com outro do grupo.

(pausa)

No grafo, o ciclo aparece em vermelho.

Esse ciclo é a espera circular: um espera o outro, até voltar ao primeiro.

As quatro condições de Coffman estão presentes, e as quatro juntas dão deadlock.

**NA TELA:** clique em **Ajustar**, escolha em **Estratégia para pegar os garfos** a opção
**Ordem global (menor número primeiro)** e clique em **Aplicar e reiniciar**. Na pergunta, clique em
**Continuar**. Depois aperte **1**, **2**, **3**, **4**, **5**.

**FALE:**

A correção é a ordem global: todo mundo pega primeiro o garfo de menor número.

O último filósofo, F4, precisa do garfo zero primeiro.

Ele espera sem segurar nada.

**NA TELA:** aperte **4** três vezes.

**FALE:**

F3 pegou o segundo garfo, comeu e soltou os dois.

A espera circular não se forma.

No xv6, a regra para locks é a mesma: quem precisa de vários pega sempre na mesma ordem.

### 4:35–5:00 · Fechamento

*Fala: 48 palavras (~22 s).*

**NA TELA:** deixe o nível 3 na tela.

**FALE:**

O simulador simplifica algumas coisas.

Cada passo é uma linha que acontece inteira, e não há várias CPUs de verdade.

Não usamos semáforo porque o núcleo do xv6 também não usa.

Conferimos os casos à mão e com testes que percorrem todas as intercalações em casos pequenos.

Obrigado.

### Opcional, só se sobrar tempo · Fork bomb

*Fala: 48 palavras (~22 s). Fica fora dos 5 minutos.*

**NA TELA:** clique no campo `kernel$` do rodapé, digite `forkbomb` e aperte Enter. Não clique em
nada durante a animação, porque um clique fecha. Espere uns 9 segundos, até o cartão
"Calma: foi só um easter egg". Depois clique em **Reiniciar o sistema** e aperte **Esc**.

**FALE:**

Para fechar, um easter egg do terminal: um fork bomb.

São processos que se copiam sem parar.

(pausa)

Parece que o site caiu, mas é só animação.

No xv6, a tabela de processos tem 64 lugares.

Quando ela enche, `fork` devolve menos um, e o sistema continua de pé.

## Se algo der errado

- **Apertou a tecla errada:** aperte **Z** (Voltar 1 passo) e siga.
- **Clicou em Cancelar na pergunta:** clique de novo na aba ou em **Aplicar e reiniciar** e,
  desta vez, em **Continuar**.
- **Perdeu a sequência:** aperte **R** e refaça as teclas do trecho desde o começo. Se reiniciou sem
  querer, clique em **Desfazer reinício**.
- **A página travou ou ficou estranha:** aperte **F5**. O simulador volta ao início, no nível 1, e
  sem o modo Apresentar: aperte **P**, abra a aba do nível em que parou e refaça o **Ajustar** do
  trecho.
