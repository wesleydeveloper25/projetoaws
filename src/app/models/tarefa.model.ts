export type StatusTarefa = 'nova' | 'realizada';

export interface Tarefa {
  id: number;
  nome: string;
  status: StatusTarefa;
  data: string; // formato YYYY-MM-DD
}

export type NovaTarefa = Omit<Tarefa, 'id'>;