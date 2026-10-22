/* ============================================================
   api.js — comunicação com a API (Node + PostgreSQL)
   Endpoints usados:  GET /api/grupos   e   GET /api/grupo/:nome
   ============================================================ */
const API = (window.CONFIG && window.CONFIG.api) || 'http://localhost:3000';

// Estado compartilhado com o app.js
const DB = { grupos: null, qtd: {}, erro: '' };

async function getJson(caminho) {
  const r = await fetch(API + caminho);
  if (!r.ok) throw new Error('HTTP ' + r.status + ' em ' + caminho);
  return r.json();
}

// Aceita ["BANCOS", ...] ou [{nome|grupo: "BANCOS", total|quantidade: 10}, ...]
function normalizarGrupos(dados) {
  const lista = Array.isArray(dados) ? dados : (dados.grupos || []);
  return lista.map(x => typeof x === 'string'
    ? { nome: x, total: null }
    : { nome: x.nome ?? x.grupo ?? x.GRUPO, total: numero(x) });
}

// Descobre a quantidade: lista de registros (conta) ou objeto com total
function numero(o) {
  if (Array.isArray(o)) return o.length;
  for (const k of ['total', 'quantidade', 'qtd', 'qtde', 'count']) {
    if (o && o[k] != null) return Number(o[k]);
  }
  if (o && Array.isArray(o.registros)) return o.registros.length;
  return null;
}

async function carregarGrupos() {
  try {
    DB.grupos = normalizarGrupos(await getJson('/api/grupos'));
    DB.erro = '';
  } catch (e) {
    DB.erro = e.message;
    console.error('Falha ao carregar grupos:', e);
  }
  route();
}

async function carregarQtd(nome) {
  if (!nome || DB.qtd[nome] !== undefined) return route();
  try {
    DB.qtd[nome] = numero(await getJson('/api/grupo/' + encodeURIComponent(nome)));
  } catch (e) {
    DB.qtd[nome] = null;
    console.error('Falha ao carregar grupo ' + nome + ':', e);
  }
  route();
}
