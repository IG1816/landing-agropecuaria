export type Favorite = {
  id: string;
  user_id: string;
  product_name: string;
  category: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  created_at: string;
  updated_at: string;
};

export const orderStatusLabel: Record<Order['status'], string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};
