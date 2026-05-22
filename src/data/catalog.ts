/** Produtos/categorias disponíveis para favoritar e pedidos */
export const catalogProducts = [
  { name: 'Ração e Nutrição Animal', category: 'Ração' },
  { name: 'Sementes e Mudas', category: 'Sementes' },
  { name: 'Medicamentos Veterinários', category: 'Veterinária' },
  { name: 'Defensivos Agrícolas', category: 'Defensivos' },
  { name: 'Ferramentas e Equipamentos', category: 'Ferramentas' },
  { name: 'Avicultura', category: 'Avicultura' },
  { name: 'Bovinocultura', category: 'Gado' },
  { name: 'Piscicultura', category: 'Piscicultura' },
  { name: 'Pet e Companhia', category: 'Pet' },
  { name: 'Ração', category: 'Destaque' },
  { name: 'Sementes', category: 'Destaque' },
  { name: 'Vacinas', category: 'Destaque' },
  { name: 'Equipamentos', category: 'Destaque' },
] as const;

export type CatalogProduct = (typeof catalogProducts)[number];
