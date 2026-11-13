# Publicação: registro do que foi feito

O simulador está publicado no GitHub Pages:

- **Simulador:** https://gabrielhsp-sys.github.io/simulador-sincronizacao-so/
- **Repositório (público):** https://github.com/gabrielhsp-sys/simulador-sincronizacao-so

## O que foi feito (12/11/2026, com autorização explícita do autor)

1. Conferências só de leitura antes de qualquer escrita:
   - login do `gh` ativo;
   - dono da conta confirmado;
   - repositório ainda inexistente;
   - portfólio sem domínio próprio, o que dá o endereço final `https://<login>.github.io/simulador-sincronizacao-so/`.
2. Privacidade:
   - O histórico local tinha o e-mail pessoal do autor, então **não foi publicado**. Ele ficou só na
     branch local `historico-local`.
   - A branch `main` publicada nasceu órfã, com **um commit** do estado final, autorado pelo e-mail
     `noreply` do GitHub. O `git config` não foi alterado.
   - `prompt.md`, `mockups/` e `screenshots/` ficaram fora do commit (`.gitignore`).
   - Uma varredura nos arquivos versionados não achou e-mails nem nomes.
3. Repositório criado como público e `main` enviada, sem `--force` e sem tocar em nenhum outro
   repositório.
4. GitHub Pages ligado em `main` / `(root)`. Depois do build, o endereço respondeu `200` e abriu no
   Edge sem erro de JavaScript (veja `VERIFICACAO.md`).

## O que continua manual

- [ ] **Padlet:** colar o link do simulador. Alternativa: anexar o `index.html` (bem abaixo de 20 MB)
      com o aviso **"Baixe e abra no navegador."**
- [ ] Abrir o link numa janela anônima e noutro computador ou no celular.
- [ ] Testar no Chrome e no Firefox (a verificação automática usou só o Edge).
- [ ] Enviar o link para a Pessoa 2 (apresentação), com `ROTEIRO-APRESENTACAO.md`, e para a
      Pessoa 3 (justificativa técnica), com `DECISOES.md`, `PROMPTS.md`, `NIELSEN.md` e
      `VERIFICACAO.md`.

## Como atualizar até 25/11

Na pasta do projeto, depois de mudar e testar (`node --test` e abrir o `index.html` do disco):

```bash
git add <arquivos alterados>
git -c user.name="<login>" -c user.email="<id>+<login>@users.noreply.github.com" commit -m "<o que mudou>"
git push
```

Use sempre o e-mail `noreply` para não publicar o e-mail pessoal. O Pages atualiza sozinho em
alguns minutos. Nunca use `git push --force` e não envie a branch `historico-local`.
