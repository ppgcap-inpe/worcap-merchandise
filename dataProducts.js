// dataProducts.js

const productsData = [
  {
    id: 37,
    name: "NOVO: Camiseta INPE",
    price: 65.00,
    category: "camiseta",
    description: "Camiseta 100% algodão, unisex, confortável e versátil para o dia a dia.",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    colors: {
      preta: "assets/produtos/camisetas/cam_inpe_preta.png",
      branca: "assets/produtos/camisetas/cam_inpe_branca.png",
    }
  },
  {
    id: 55,
    name: "NOVO: Camiseta Grace Hopper - A Imperatriz",
    price: 75.00,
    category: "camiseta",
    description: "Camiseta 100% algodão, unisex, confortável e versátil para o dia a dia.",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    colors: {
      preta: "assets/produtos/camisetas/cam_grace_imperatriz_preta.png",
      branca: "assets/produtos/camisetas/cam_grace_imperatriz_branca.png",
    }
  },
  {
    id: 38,
    name: "NOVO: Camiseta Chaleira de Russell",
    price: 75.00,
    category: "camiseta",
    description: "Camiseta 100% algodão, unisex, confortável e versátil para o dia a dia.",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    colors: {
      preta: "assets/produtos/camisetas/cam_russel_preta.png",
      branca: "assets/produtos/camisetas/cam_russel_branca.png",
    }
  },
  {
    id: 39,
    name: "NOVO: Camiseta LoTR",
    price: 75.00,
    category: "camiseta",
    description: "Camiseta 100% algodão, unisex, confortável e versátil para o dia a dia.",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    colors: {
      preta: "assets/produtos/camisetas/cam_lotr_preta.png",
      branca: "assets/produtos/camisetas/cam_lotr_branca.png",
    }
  },
  {
    id: 28,
    name: "Camiseta Vourukasha",
    price: 75.00,
    category: "camiseta",
    description: "Camiseta 100% algodão, unisex,  confortável e versátil para o dia a dia.",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    colors: {
      preta: "assets/produtos/camisetas/cam_vourukasha_preta.png",
      branca: "assets/produtos/camisetas/cam_vourukasha_branca.png",
    }
  },
  {
    id: 29,
    name: "Camiseta Cordel",
    price: 75.00,
    category: "camiseta",
    description: "Camiseta 100% algodão, unisex, confortável e versátil para o dia a dia.",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    colors: {
      preta: "assets/produtos/camisetas/cam_cordel_preta.png",
      branca: "assets/produtos/camisetas/cam_cordel_branca.png",
    }
  },
  {
    id: 30,
    name: "Camiseta Delírio Científico",
    price: 75.00,
    category: "camiseta",
    description: "Camiseta 100% algodão, unisex, confortável e versátil para o dia a dia.",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    colors: {
      preta: "assets/produtos/camisetas/cam_delcientifico_preta.png",
      branca: "assets/produtos/camisetas/cam_delcientifico_branca.png",
    }
  },
  {
    id: 31,
    name: "Camiseta Delírio INPEano",
    price: 75.00,
    category: "camiseta",
    description: "Camiseta 100% algodão, unisex, confortável e versátil para o dia a dia.",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    colors: {
      preta: "assets/produtos/camisetas/cam_delipeano_preta.png",
      branca: "assets/produtos/camisetas/cam_delipeano_branca.png",
    }
  },
  {
    id: 1,
    name: "Camiseta Gato na Caixa",
    price: 75.00,
    category: "camiseta",
    description: "Camiseta 100% algodão, unisex,  confortável e versátil para o dia a dia.",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    colors: {
      preta: "assets/produtos/camisetas/cam_gatocaixa_preta.png",
      branca: "assets/produtos/camisetas/cam_gatocaixa_branca.png",
    }
  },
  {
    id: 2,
    name: "Camiseta Troca Cultural",
    price: 75.00,
    category: "camiseta",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    description: "Camiseta 100% algodão, confortável e versátil para o dia a dia.",
    colors: {
      preta: "assets/produtos/camisetas/cam_trocacultu_preta.png",
      branca: "assets/produtos/camisetas/cam_trocacultu_branca.png"
    }
  },
  {
    id: 3,
    name: "Camiseta Schrödinger",
    price: 75.00,
    category: "camiseta",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    description: "Camiseta 100% algodão, confortável e versátil para o dia a dia.",
    colors: {
      preta: "assets/produtos/camisetas/cam_einsten_preta.png",
      branca: "assets/produtos/camisetas/cam_einsten_branca.png"
    }
  },
  {
    id: 4,
    name: "Camiseta Yemoja",
    price: 75.00,
    category: "camiseta",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    description: "Camiseta 100% algodão, confortável e versátil para o dia a dia.",
    colors: {
      preta: "assets/produtos/camisetas/cam_yemoja_preta.png",
      branca: "assets/produtos/camisetas/cam_yemoja_branca.png"
    }
  },

  {
    id: 5,
    name: "Copo 25 anos WorCAP",
    photo: "assets/produtos/copos/25_anos.gif",
    price: 15.00,
    category: "copo",
    description: "Copo de 500ml edição limitada de 25 anos do WorCAP",
  },
  {
    id: 6,
    name: "Copo Cordel",
    photo: "assets/produtos/copos/Cordel.gif",
    price: 15.00,
    category: "copo",
    description: "Copo de 500ml com temática cordel."
  },
  {
    id: 7,
    name: "Copo Delírio Científico",
    photo: "assets/produtos/copos/Delírio_científico_Translúcio.gif",
    price: 15.00,
    category: "copo",
    description: "Copo Translúcido de 500ml temático Delírio Científico, ilustrando um brainstorms de ideias."
  },
  {
    id: 8,
    name: "Copo Delírio Inpeano",
    photo: "assets/produtos/copos/Delírio_Inpeano.gif",
    price: 15.00,
    category: "copo",
    description: "Copo de 500ml temático Delírio Inpeano, ilustrando a diversidade de áreas de estudo existente no INPE."
  },
  {
    id: 32,
    name: "Caneca Yemoja",
    photo: "assets/produtos/canecas/Caneca_Yemoja.png",
    price: 45.00,
    category: "caneca",
    description: "Caneca de cerâmica de 300ml com estampa Yemoja, ideal para café ou chá.",
  },
  {
    id: 33,
    name: "Caneca Gato na Caixa",
    photo: "assets/produtos/canecas/Caneca_ GatoCaixaBranco.png",
    price: 45.00,
    category: "caneca",
    description: "Caneca de cerâmica de 300ml com estampa Gato na Caixa, ideal para café ou chá.",
  },
  {
    id: 34,
    name: "Caneca LoTR",
    photo: "assets/produtos/canecas/Caneca_LoTR.png",
    price: 45.00,
    category: "caneca",
    description: "Caneca de cerâmica de 300ml com estampa Senhor dos Anéis, ideal para café ou chá.",
  },
  {
    id: 35,
    name: "Caneca Schrödinger",
    photo: "assets/produtos/canecas/Caneca_Schrödinger.png",
    price: 45.00,
    category: "caneca",
    description: "Caneca de cerâmica de 300ml com estampa Schrödinger, ideal para café ou chá.",
  },
  {
    id: 36,
    name: "Caneca Pioneer",
    photo: "assets/produtos/canecas/Caneca_Pionner.png",
    price: 45.00,
    category: "caneca",
    description: "Caneca de cerâmica de 300ml com estampa Pioneer, ideal para café ou chá.",
  },
  {
    id: 9,
    name: "Caneca 25 anos WorCAP",
    photo: "assets/produtos/canecas/Caneca_25 anos.png",
    price: 45.00,
    category: "caneca",
    description: "Caneca de cerâmica de 300ml com estampa exclusiva de 25 anos do WorCAP, ideal para café ou chá.",
  },
  {
    id: 10,
    name: "Caneca Cordel",
    photo: "assets/produtos/canecas/Caneca_Cordel.png",
    price: 45.00,
    category: "caneca",
    description: "Caneca de cerâmica de 300ml com estampa Cordel, ideal para café ou chá.",
  },
  {
    id: 11,
    name: "Caneca Delírio Científico",
    photo: "assets/produtos/canecas/Caneca_Delírio_Científico.png",
    price: 45.00,
    category: "caneca",
    description: "Caneca de cerâmica de 300ml com estampa exclusiva do Delírio Científico, ideal para café ou chá.",
  },
  {
    id: 39,
    name: "NOVO: Poster - Chaleira de Russel",
    photo: "assets/produtos/posters/ChaleiraRussell.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 40,
    name: "NOVO: Poster - Grace Hopper A Imperatriz",
    photo: "assets/produtos/posters/Imperatriz.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 41,
    name: "NOVO: Poster - Defesa de Tese",
    photo: "assets/produtos/posters/DefesaTese.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 27,
    name: "Poster - Vourukasha",
    photo: "assets/produtos/posters/Vourukasha.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 12,
    name: "Poster Cordel - Tradicional",
    photo: "assets/produtos/posters/ Cordel.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 13,
    name: "Poster Cordel Foil",
    photo: "assets/produtos/posters/ Cordel Foil.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 14,
    name: "Poster Da Lama ao Caos",
    photo: "assets/produtos/posters/ Da Lama ao Caos.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 15,
    name: "Poster Delírio Científico",
    photo: "assets/produtos/posters/ Delírio Científico.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 16,
    name: "Poster Delírio Inpeano BW",
    photo: "assets/produtos/posters/ Delírio Inpeano BW.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 17,
    name: "Poster Delírio Inpeano",
    photo: "assets/produtos/posters/ Delírio Inpeano.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 18,
    name: "Poster Gato na Caixa",
    photo: "assets/produtos/posters/ Gato na Caixa.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 19,
    name: "Poster LoTR",
    photo: "assets/produtos/posters/ LoTR.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 20,
    name: "Poster Macaconv",
    photo: "assets/produtos/posters/ Mamaco.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 21,
    name: "Poster Método Científico",
    photo: "assets/produtos/posters/ Método Científico.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 22,
    name: "Poster Pioneer 1",
    photo: "assets/produtos/posters/ Pioneer 1.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 23,
    name: "Poster Pioneer 2",
    photo: "assets/produtos/posters/ Pioneer 2.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 24,
    name: "Poster Schrödinger",
    photo: "assets/produtos/posters/ Schrodinger.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 25,
    name: "Poster Troca Cultural",
    photo: "assets/produtos/posters/ Troca Cultural.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  {
    id: 26,
    name: "Poster Yemoja",
    photo: "assets/produtos/posters/ Yemoja.png",
    price: 10.00,
    category: "poster",
    description: "Poster A3 decorativo, sem moldura.",
  },
  
];
