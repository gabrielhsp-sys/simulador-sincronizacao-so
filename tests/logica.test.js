// Testes da lógica do simulador (node:test, já vem com o Node; nada a instalar).
// Como rodar, na raiz do projeto:  node --test
//
// O index.html continua sendo UM arquivo só: este teste lê o bloco
// <script id="logica"> de dentro dele e o executa num contexto isolado (vm).
// Os valores esperados vêm dos casos feitos à mão em VERIFICACAO.md (C1..C11),
// não são recalculados pelo mesmo caminho do código.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function carregarLogica() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const m = html.match(/<script id="logica">([\s\S]*?)<\/script>/);
  assert.ok(m, 'bloco <script id="logica"> não encontrado no index.html');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(m[1], ctx);
  return ctx.Logica;
}

const Logica = carregarLogica();

// Executa uma sequência de escolhas do "escalonador" (índices de processo).
function rodar(nivel, params, seq) {
  let e = nivel.criar(params);
  for (const pid of seq) {
    assert.ok(nivel.executaveis(e).includes(pid),
      `processo ${pid} não executável no passo ${e.passos + 1}`);
    e = nivel.passo(e, pid).estado;
  }
  return e;
}

// Busca em largura sobre TODAS as intercalações possíveis.
// Devolve o menor número de passos até um estado que satisfaz `alvo`
// (ou null) e a lista de todos os estados alcançáveis.
function explorar(nivel, params, alvo) {
  // passos e giros são só estatística (girar não muda o comportamento futuro);
  // fora da chave, a busca não confunde "girou mais uma vez" com estado novo.
  const chave = (e) => JSON.stringify(Object.assign({}, e, { passos: 0, giros: 0 }));
  const inicio = nivel.criar(params);
  const vistos = new Set([chave(inicio)]);
  let fila = [inicio];
  let minimo = alvo && alvo(inicio) ? 0 : null;
  const todos = [inicio];
  let dist = 0;
  while (fila.length) {
    dist++;
    const prox = [];
    for (const e of fila) {
      for (const pid of nivel.executaveis(e)) {
        const n = nivel.passo(e, pid).estado;
        const k = chave(n);
        if (vistos.has(k)) continue;
        vistos.add(k);
        todos.push(n);
        prox.push(n);
        if (alvo && minimo === null && alvo(n)) minimo = dist;
      }
    }
    fila = prox;
    assert.ok(vistos.size < 500000, 'espaço de estados grande demais para o teste');
  }
  return { minimo, todos };
}

function desafio(id) {
  const d = Logica.desafios.find((x) => x.id === id);
  assert.ok(d, `desafio ${id} não existe`);
  return d;
}

// ---------------------------------------------------------------- Nível 1
const C = () => Logica.niveis.contador;

test('C1: sem lock, ler-ler-escrever-escrever perde uma atualização (final 1)', () => {
  const e = rodar(C(), { processos: 2, incrementos: 1, lock: false }, [0, 1, 0, 1]);
  assert.equal(e.contador, 1);
  assert.equal(e.perdas, 1);
  assert.equal(C().situacao(e).terminou, true);
});

test('C3: sem lock, ordem serial dá o valor certo (final 2, sem perda)', () => {
  const e = rodar(C(), { processos: 2, incrementos: 1, lock: false }, [0, 0, 1, 1]);
  assert.equal(e.contador, 2);
  assert.equal(e.perdas, 0);
});

test('C2: com lock, quem tenta acquire com lock ocupado gira; final 2', () => {
  const e = rodar(C(), { processos: 2, incrementos: 1, lock: true },
    [0, 1, 0, 0, 1, 0, 1, 1, 1, 1]);
  assert.equal(e.contador, 2);
  assert.equal(e.perdas, 0);
  assert.equal(e.giros, 2);
  assert.equal(C().situacao(e).terminou, true);
});

test('C4: sem lock, 2 x 3 pode terminar em 2 e nunca em 1', () => {
  const p = { processos: 2, incrementos: 3, lock: false };
  const e = rodar(C(), p, [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1]);
  assert.equal(e.contador, 2);
  const finais = explorar(C(), p).todos
    .filter((x) => C().situacao(x).terminou).map((x) => x.contador);
  assert.equal(Math.min(...finais), 2);
  assert.equal(Math.max(...finais), 6);
});

test('C5: com lock, nenhuma intercalação perde atualização (2x2 e 3x1)', () => {
  for (const [n, k] of [[2, 2], [3, 1]]) {
    const { todos } = explorar(C(), { processos: n, incrementos: k, lock: true });
    assert.ok(todos.every((x) => x.perdas === 0));
    const finais = todos.filter((x) => C().situacao(x).terminou);
    assert.ok(finais.length > 0);
    assert.ok(finais.every((x) => x.contador === n * k));
  }
});

test('Desafios 1.1, 1.2, 1.3: mínimo de passos confere com a tabela feita à mão', () => {
  for (const [id, esperado] of [['1.1', 4], ['1.2', 16], ['1.3', 12]]) {
    const d = desafio(id);
    assert.equal(d.minimo, esperado, `minimo declarado de ${id}`);
    const { minimo } = explorar(Logica.niveis[d.nivel], d.params, d.objetivo);
    assert.equal(minimo, esperado, `minimo por BFS de ${id}`);
  }
});

// ---------------------------------------------------------------- Nível 2
// Processos: produtores primeiro (P1, P2...), depois consumidores (C1, C2...).
// Com 1 produtor e 1 consumidor: índice 0 = P1, índice 1 = C1.
const P = () => Logica.niveis.pipe;
const rep = (pid, n) => Array(n).fill(pid);
const umPum = (versao, tamanho, itens) =>
  ({ tamanho, produtores: 1, consumidores: 1, itens, versao });

test('C6: pipe correto, PIPESIZE 2, 3 itens: produtor dorme cheio, FIFO, 31 passos', () => {
  const p = umPum('correta', 2, 3);
  let e = rodar(P(), p, rep(0, 11));
  assert.equal(e.procs[0].estado, 'dormindo');
  assert.equal(e.procs[0].canal, 'nwrite');
  assert.equal(e.lock, null, 'sleep solta o lock');
  assert.deepEqual(Array.from(P().executaveis(e)), [1]);
  e = rodar(P(), p, [...rep(0, 11), ...rep(1, 4)]);
  assert.equal(e.procs[0].estado, 'pronto', 'wakeup(&nwrite) acorda o produtor');
  e = rodar(P(), p, [...rep(0, 11), ...rep(1, 4), ...rep(0, 5), ...rep(1, 11)]);
  assert.deepEqual(Array.from(e.consumidos), ['A1', 'A2', 'A3']);
  assert.equal(e.nread, 3);
  assert.equal(e.nwrite, 3);
  assert.equal(e.sobrescritas + e.leiturasVazias, 0);
  assert.equal(P().situacao(e).terminou, true);
  assert.equal(e.passos, 31);
});

test('C7: pipe correto, consumidor com buffer vazio dorme e solta o lock', () => {
  const e = rodar(P(), umPum('correta', 2, 3), [1, 1, 1]);
  assert.equal(e.procs[1].estado, 'dormindo');
  assert.equal(e.procs[1].canal, 'nread');
  assert.equal(e.lock, null);
  assert.deepEqual(Array.from(P().executaveis(e)), [0]);
});

test('C8: sem checagem, o 3º item sobrescreve A1 não lido; ler vazio é erro', () => {
  const e = rodar(P(), umPum('semChecagem', 2, 3), rep(0, 8));
  assert.equal(e.sobrescritas, 1);
  assert.equal(e.data[0], 'A3');
  const v = rodar(P(), umPum('semChecagem', 2, 3), [1, 1]);
  assert.equal(v.leiturasVazias, 1);
});

test('C9: versão ingênua, lost wakeup trava os dois em 8 passos', () => {
  const e = rodar(P(), umPum('ingenua', 2, 3), [1, 0, 0, 0, 0, 0, 1, 0]);
  assert.equal(e.wakeupsPerdidos, 2);
  assert.equal(e.procs[0].estado, 'dormindo');
  assert.equal(e.procs[1].estado, 'dormindo');
  assert.equal(e.nwrite - e.nread, 2, 'consumidor dorme com 2 itens no buffer');
  assert.equal(P().situacao(e).travado, true);
});

test('A3: pipe correto nunca trava, nunca erra e respeita 0 <= nwrite-nread <= PIPESIZE', () => {
  const configs = [
    umPum('correta', 1, 2), umPum('correta', 2, 3),
    { tamanho: 1, produtores: 2, consumidores: 1, itens: 1, versao: 'correta' },
    { tamanho: 2, produtores: 1, consumidores: 2, itens: 2, versao: 'correta' }
  ];
  for (const p of configs) {
    const { todos } = explorar(P(), p);
    const total = p.produtores * p.itens;
    for (const x of todos) {
      const ocup = x.nwrite - x.nread;
      assert.ok(ocup >= 0 && ocup <= p.tamanho, 'invariante do buffer');
      assert.equal(x.sobrescritas + x.leiturasVazias, 0);
      assert.equal(P().situacao(x).travado, false, 'nunca trava');
      if (P().situacao(x).terminou) assert.equal(x.consumidos.length, total);
    }
    if (p.produtores === 1 && p.consumidores === 1) {
      const fim = todos.filter((x) => P().situacao(x).terminou);
      assert.ok(fim.every((x) => x.consumidos.join() === ['A1', 'A2', 'A3'].slice(0, total).join()),
        'FIFO');
    }
  }
});

test('Versão ingênua: existe intercalação que trava (BFS)', () => {
  const { minimo } = explorar(P(), umPum('ingenua', 2, 3), (x) => P().situacao(x).travado);
  assert.equal(minimo, 8);
});

test('Desafios 2.1, 2.2, 2.3: mínimo de passos confere com a tabela feita à mão', () => {
  for (const [id, esperado] of [['2.1', 8], ['2.2', 8], ['2.3', 31]]) {
    const d = desafio(id);
    assert.equal(d.minimo, esperado, `minimo declarado de ${id}`);
    const { minimo } = explorar(Logica.niveis[d.nivel], d.params, d.objetivo);
    assert.equal(minimo, esperado, `minimo por BFS de ${id}`);
  }
});

// ---------------------------------------------------------------- Nível 3
const F = () => Logica.niveis.filosofos;
const ciclo = (e) => F().situacao(e).ciclo;

test('C10: 3 filósofos "todos pegam o esquerdo" formam ciclo em 6 passos', () => {
  const e = rodar(F(), { filosofos: 3, estrategia: 'esquerdo' }, [0, 1, 2, 0, 1, 2]);
  assert.deepEqual(Array.from(ciclo(e)), ['F0', 'G1', 'F1', 'G2', 'F2', 'G0']);
  assert.equal(F().situacao(e).deadlock, true);
  assert.equal(F().executaveis(e).length, 0);
  const c = F().situacao(e).coffman;
  assert.equal(c.exclusaoMutua && c.posseEEspera && c.naoPreempcao && c.esperaCircular, true);
});

test('C11: 3 filósofos "ordem global": F2 espera sem segurar nada; todos comem em 13 passos', () => {
  const seq = [0, 1, 2];
  let e = rodar(F(), { filosofos: 3, estrategia: 'ordem' }, seq);
  assert.equal(e.procs[2].estado, 'esperando');
  assert.equal(e.procs[2].espera, 0, 'F2 pede G0 primeiro');
  assert.equal(e.garfos.filter((g) => g === 2).length, 0, 'F2 não segura nenhum garfo');
  e = rodar(F(), { filosofos: 3, estrategia: 'ordem' }, [0, 1, 2, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2]);
  assert.equal(F().situacao(e).terminou, true);
  assert.equal(e.passos, 13);
});

test('A5: "ordem global" e "um canhoto" nunca formam ciclo e sempre podem terminar (3 a 5)', () => {
  for (const estrategia of ['ordem', 'canhoto']) {
    for (const n of [3, 4, 5]) {
      const { todos } = explorar(F(), { filosofos: n, estrategia });
      assert.ok(todos.every((x) => ciclo(x) === null), `${estrategia} ${n}: sem ciclo`);
      assert.ok(todos.every((x) => !F().situacao(x).deadlock), `${estrategia} ${n}: sem deadlock`);
      assert.ok(todos.some((x) => F().situacao(x).terminou));
    }
  }
});

test('A5: "todos pegam o esquerdo" pode travar, com ciclo, para 3 a 5 filósofos', () => {
  for (const n of [3, 4, 5]) {
    const { minimo, todos } = explorar(F(), { filosofos: n, estrategia: 'esquerdo' },
      (x) => F().situacao(x).deadlock);
    assert.equal(minimo, 2 * n);
    // instância única: travou <=> há ciclo
    for (const x of todos) {
      const s = F().situacao(x);
      const semSaida = !s.terminou && F().executaveis(x).length === 0;
      assert.equal(semSaida, ciclo(x) !== null);
    }
  }
});

test('Desafios 3.1 e 3.2: mínimo de passos confere com a tabela feita à mão', () => {
  for (const [id, esperado] of [['3.1', 10], ['3.2', 20]]) {
    const d = desafio(id);
    assert.equal(d.minimo, esperado, `minimo declarado de ${id}`);
    const { minimo } = explorar(Logica.niveis[d.nivel], d.params, d.objetivo);
    assert.equal(minimo, esperado, `minimo por BFS de ${id}`);
  }
});
