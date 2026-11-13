# Como publicar

Checklist para o autor. Publicar é uma ação manual: nada aqui foi feito automaticamente.
`USUARIO` e `REPOSITORIO` são exemplos; troque pelos seus.

## 1. Conferir antes de publicar

- [ ] Abra o `index.html` direto do disco (dois cliques, ou arraste para o navegador). O endereço
      deve começar com `file://`.
- [ ] Teste os três níveis: execute alguns passos, use Voltar, Reiniciar e Auto.
- [ ] Abra um desafio e conclua; veja se as estrelas aparecem.
- [ ] Teste no Chrome, no Edge e no Firefox.
- [ ] Opcional, se o Node estiver instalado: `node --test` na pasta do projeto deve mostrar
      `pass 18` e `fail 0`.

## 2. Publicar no GitHub Pages

1. [ ] Entre no GitHub e crie um repositório **público** (botão **New**). Por exemplo,
       `REPOSITORIO`. Não marque "Add a README" (o projeto já tem um).
2. [ ] Na página do repositório vazio, clique em **uploading an existing file**.
3. [ ] Arraste estes arquivos e a pasta `tests`:
       `index.html`, `README.md`, `VERIFICACAO.md`, `DECISOES.md`, `PROMPTS.md`, `NIELSEN.md`,
       `ROTEIRO-APRESENTACAO.md`, `PUBLICAR.md`, `VIDEO.md`, `tests/logica.test.js`.
       **Não envie** o `prompt.md`: ele tem o seu nome, e o texto dele já está em `PROMPTS.md`
       com o nome trocado.
4. [ ] Escreva uma mensagem (por exemplo, "Simulador v1") e clique em **Commit changes**.
5. [ ] Vá em **Settings → Pages**. Em **Build and deployment → Source**, escolha **Deploy from a
       branch**. Em **Branch**, escolha **main** e a pasta **/ (root)**. Clique em **Save**.
6. [ ] Espere alguns minutos. O endereço aparece no topo da mesma página:
       `https://USUARIO.github.io/REPOSITORIO/`.
7. [ ] Abra o link numa **janela anônima** (`Ctrl+Shift+N` no Chrome e no Edge,
       `Ctrl+Shift+P` no Firefox) e, se possível, noutro computador ou no celular.
8. [ ] Cole o link no Padlet.

Alternativa por linha de comando (o projeto já tem git local com histórico): crie o repositório
vazio no GitHub e siga as instruções que ele mostra para "push an existing repository". O
`prompt.md` não está no histórico do git, então não vai junto.

## 3. Alternativa: anexar no Padlet

1. [ ] No Padlet, anexe o `index.html` (o limite é 20 MB; o arquivo tem bem menos).
2. [ ] Escreva junto: **"Baixe e abra no navegador."**
3. [ ] Baixe o arquivo do próprio Padlet e abra para conferir. Funciona sem internet.

## 4. Depois de publicar

- [ ] Envie o link para quem vai apresentar (Pessoa 2) e para quem vai escrever a justificativa
      (Pessoa 3), junto com `ROTEIRO-APRESENTACAO.md`, `DECISOES.md`, `PROMPTS.md` e
      `VERIFICACAO.md`.
- [ ] Se mudar o `index.html` depois (até 25/11), envie o arquivo de novo pelo mesmo caminho. O
      Pages atualiza em alguns minutos.
