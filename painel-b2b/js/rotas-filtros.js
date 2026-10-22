/* ============================================================
   rotas-filtros.js — endpoints novos da API (Express + PostgreSQL)

   GET /api/filtros                      -> valores distintos de UF, região e grupo
   GET /api/contagem?uf=&regiao=&grupo=  -> { total: N } conforme os filtros enviados
                                            (filtro vazio/ausente = não filtra)

   COMO LIGAR no seu server.js (depois de criar o "pool" do pg e antes do app.listen):
       app.use('/api', require('./rotas-filtros')(pool));
   ============================================================ */
const express = require('express');

// >>> AJUSTE AQUI <<<
const TABELA  = 'NOME_DA_TABELA';                       // a tabela onde importou os 12.168 registros
const COLUNAS = { uf: 'uf', regiao: 'regiao', grupo: 'grupo' };  // nome de cada coluna na tabela
// (maiúsculas/minúsculas e acentos não importam; se algo não bater, o erro lista as colunas reais)

const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const q = s => '"' + String(s).replace(/"/g, '""') + '"';   // aspas de identificador do PostgreSQL

module.exports = function (pool) {
  const router = express.Router();
  let cache = null;

  // Descobre o nome real da tabela e das colunas (uma vez só)
  async function resolver() {
    if (cache) return cache;
    const r = await pool.query(
      `SELECT table_schema, table_name, column_name
         FROM information_schema.columns
        WHERE lower(table_name) = lower($1)
          AND table_schema NOT IN ('pg_catalog','information_schema')`, [TABELA]);
    if (!r.rows.length)
      throw new Error(`Tabela "${TABELA}" não encontrada. Ajuste a constante TABELA em rotas-filtros.js.`);
    const { table_schema, table_name } = r.rows[0];
    const existentes = r.rows.map(x => x.column_name);
    const cols = {};
    for (const [chave, nome] of Object.entries(COLUNAS)) {
      const achou = existentes.find(c => norm(c) === norm(nome));
      if (!achou)
        throw new Error(`Coluna "${nome}" (filtro ${chave}) não existe. Colunas da tabela: ${existentes.join(', ')}`);
      cols[chave] = achou;
    }
    cache = { tabela: `${q(table_schema)}.${q(table_name)}`, cols };
    return cache;
  }

  router.get('/filtros', async (req, res) => {
    try {
      const { tabela, cols } = await resolver();
      const out = {};
      for (const [chave, col] of Object.entries(cols)) {
        const r = await pool.query(
          `SELECT DISTINCT ${q(col)}::text AS v FROM ${tabela}
            WHERE ${q(col)} IS NOT NULL AND TRIM(${q(col)}::text) <> '' ORDER BY 1`);
        out[chave] = r.rows.map(x => x.v);
      }
      res.json(out);
    } catch (e) { console.error(e); res.status(500).json({ erro: e.message }); }
  });

  router.get('/contagem', async (req, res) => {
    try {
      const { tabela, cols } = await resolver();
      const where = [], vals = [];
      for (const [chave, col] of Object.entries(cols)) {
        const v = req.query[chave];
        if (typeof v === 'string' && v.trim() !== '') {
          vals.push(v);
          where.push(`${q(col)}::text = $${vals.length}`);
        }
      }
      const sql = `SELECT COUNT(*)::int AS total FROM ${tabela}` + (where.length ? ' WHERE ' + where.join(' AND ') : '');
      const r = await pool.query(sql, vals);
      res.json({ total: r.rows[0].total });
    } catch (e) { console.error(e); res.status(500).json({ erro: e.message }); }
  });

  return router;
};
