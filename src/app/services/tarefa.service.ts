import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NovaTarefa, Tarefa } from '../models/tarefa.model';

const TAREFAS_INICIAIS: Tarefa[] = [
  { id: 1, nome: 'Preparar o planejamento semanal', status: 'nova', data: '2026-11-04' },
  { id: 2, nome: 'Revisar os materiais da aula', status: 'nova', data: '2026-11-05' },
  { id: 3, nome: 'Enviar relatório', status: 'realizada', data: '2026-11-02' }
];

@Injectable({ providedIn: 'root' })
export class TarefaService {
  // A lista em memória simula uma fonte JSON local. Não há backend neste projeto.
  private tarefas: Tarefa[] = [...TAREFAS_INICIAIS];
  private readonly tarefasSubject = new BehaviorSubject<Tarefa[]>(this.tarefas);
  readonly tarefas$ = this.tarefasSubject.asObservable();

  listar(): Tarefa[] {
    return [...this.tarefas];
  }

  criar(dados: NovaTarefa): void {
    const nova: Tarefa = {
      ...dados,
      id: this.tarefas.length ? Math.max(...this.tarefas.map(t => t.id)) + 1 : 1
    };
    this.atualizarLista([...this.tarefas, nova]);
  }

  atualizar(tarefaAtualizada: Tarefa): void {
    this.atualizarLista(
      this.tarefas.map(t => t.id === tarefaAtualizada.id ? { ...tarefaAtualizada } : t)
    );
  }

  excluir(id: number): void {
    this.atualizarLista(this.tarefas.filter(t => t.id !== id));
  }

  private atualizarLista(lista: Tarefa[]): void {
    this.tarefas = lista;
    this.tarefasSubject.next([...this.tarefas]);
  }
}