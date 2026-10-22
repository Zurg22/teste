/* ============================================================
   CONFIGURAÇÃO DO PAINEL  (é o único arquivo que você precisa editar)
   ------------------------------------------------------------
   Para ligar um dashboard do Power BI:
   1) No Power BI Service abra o relatório > Arquivo > Incorporar relatório
      > "Site ou portal" (ou "Publicar na Web", se os dados não forem sigilosos)
   2) Copie o link (começa com https://app.powerbi.com/reportEmbed?...)
   3) Cole em "pbi" da empresa, em planta e/ou reparo.
   ============================================================ */
window.CONFIG = {
  // Endereço da API Node/Express (npm start no projeto da API)
  api: "http://localhost:3000",

  titulo: "Painel B2B Avançado",
  subtitulo: "_LESTE DO JEITO CERTO",

  // Listas dos filtros (slide 4 da apresentação)
  ufs: ["RJ", "ES"],
  regioes: [
    "RJ - Capital (Zona Norte)", "RJ - Capital (Zona Oeste)", "RJ - Capital (Zona Sul)",
    "RJ - Capital (Centro)", "RJ - Baixada Fluminense", "RJ - Leste Fluminense",
    "RJ - Interior Norte", "RJ - Interior Sul", "RJ - Região dos Lagos", "RJ - Região Serrana",
    "RJ - Costa Verde", "ES - Grande Vitória", "ES - Norte", "ES - Sul"
  ],
  plantas: [],   // ex.: ["Planta A", "Planta B"]

  // (Opcional) Faz os filtros acima funcionarem DENTRO do Power BI.
  // Informe a Tabela e a Coluna do seu modelo. Deixe "" para não filtrar.
  // Obs.: filtro por URL não funciona com "Publicar na Web".
  filtroPowerBI: {
    uf:     { tabela: "", coluna: "" },
    regiao: { tabela: "", coluna: "" },
    grupo:  { tabela: "", coluna: "" },
    planta: { tabela: "", coluna: "" }
  },

  // Grupos (cards da página principal) e suas empresas.
  // icone/logo: nome de uma imagem embutida OU caminho/URL de imagem (ex.: "logos/claro.png")
  grupos: [
    { id: "bancos", nome: "BANCOS", icone: "bancos", empresas: [
      { nome: "Itaú",      logo: "logos/itau.png",      pbi: { planta: "", reparo: "" } },
      { nome: "Santander", logo: "logos/santander.png", pbi: { planta: "", reparo: "" } },
      { nome: "Bradesco",  logo: "logos/bradesco.png",  pbi: { planta: "", reparo: "" } },
      { nome: "Banco do Brasil", logo: "logos/bb.png",  pbi: { planta: "", reparo: "" } }
    ]},
    { id: "restaurantes", nome: "RESTAURANTES", icone: "restaurantes", empresas: [] },
    { id: "farmacias",    nome: "FARMÁCIAS",    icone: "farmacias",    empresas: [] },
    { id: "hospitais",    nome: "HOSPITAIS",    icone: "hospitais",    empresas: [] },
    { id: "energia",      nome: "ENERGIA",      icone: "energia",      empresas: [] },
    { id: "governo",      nome: "GOVERNO",      icone: "governo",      empresas: [] },
    { id: "moda",         nome: "MODA",         icone: "moda",         empresas: [] },
    { id: "tecnologia",   nome: "TECNOLOGIA",   icone: "tecnologia",   empresas: [] },
    { id: "varejo",       nome: "VAREJO",       icone: "varejo",       empresas: [] },
    { id: "supermercado", nome: "SUPERMERCADO", icone: "supermercado", empresas: [] },
    { id: "educacao",     nome: "EDUCAÇÃO",     icone: "educacao",     empresas: [] }
  ]
};
