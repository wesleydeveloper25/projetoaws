import { Component, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Tarefa, NovaTarefa } from './models/tarefa.model';
import { TarefaService } from './services/tarefa.service';
import { TarefaDialogComponent } from './components/tarefa-dialog/tarefa-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DatePipe, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatDialogModule, MatSnackBarModule],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span><mat-icon>check_circle</mat-icon> Minhas tarefas</span>
      <span class="spacer"></span>
      <button mat-flat-button class="add-button" (click)="novaTarefa()">
        <mat-icon>add</mat-icon> Nova tarefa
      </button>
    </mat-toolbar>

    <main class="container">
      <section class="intro">
        <div>
          <p class="eyebrow">ORGANIZAÇÃO PESSOAL</p>
          <h1>Minhas tarefas pendentes</h1>
          <p class="subtitle">Acompanhe o que precisa ser feito e mantenha sua rotina em dia.</p>
        </div>
        <div class="counter">
          <strong>{{ pendentes.length }}</strong>
          <span>{{ pendentes.length === 1 ? 'tarefa pendente' : 'tarefas pendentes' }}</span>
        </div>
      </section>

      <section class="task-list" *ngIf="pendentes.length; else vazio">
        <mat-card class="task-card" *ngFor="let tarefa of pendentes">
          <mat-card-content>
            <div class="task-info">
              <div class="task-icon"><mat-icon>radio_button_unchecked</mat-icon></div>
              <div class="task-text">
                <h2>{{ tarefa.nome }}</h2>
                <p><mat-icon>calendar_today</mat-icon> {{ tarefa.data | date:'dd/MM/yyyy':'':'pt-BR' }}</p>
              </div>
            </div>
            <div class="task-actions">
              <mat-chip class="status-chip">Nova</mat-chip>
              <button mat-icon-button color="primary" aria-label="Marcar como realizada" matTooltip="Marcar como realizada" (click)="concluir(tarefa)">
                <mat-icon>check_circle</mat-icon>
              </button>
              <button mat-icon-button aria-label="Editar tarefa" matTooltip="Editar tarefa" (click)="editar(tarefa)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" aria-label="Excluir tarefa" matTooltip="Excluir tarefa" (click)="excluir(tarefa)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </section>

      <ng-template #vazio>
        <mat-card class="empty-card">
          <mat-icon>task_alt</mat-icon>
          <h2>Tudo em dia!</h2>
          <p>Você não tem tarefas pendentes no momento.</p>
          <button mat-flat-button color="primary" (click)="novaTarefa()">Criar uma tarefa</button>
        </mat-card>
      </ng-template>
    </main>
  `,
  styles: [`
    .toolbar { padding: 0 max(24px, calc((100vw - 1080px) / 2)); }
    .toolbar span:first-child { display: flex; align-items: center; gap: 10px; font-weight: 500; }
    .spacer { flex: 1; }
    .add-button { background: white; color: #3949ab; }
    .container { max-width: 1080px; margin: 44px auto; padding: 0 24px; }
    .intro { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-bottom: 28px; }
    .eyebrow { color: #6874bd; font-size: 11px; letter-spacing: 1.5px; font-weight: 700; margin: 0 0 8px; }
    h1 { font-size: clamp(26px, 4vw, 34px); margin: 0 0 8px; color: #20243a; }
    .subtitle { margin: 0; color: #73788b; }
    .counter { background: #e9ebfa; border-radius: 14px; padding: 14px 20px; display: flex; flex-direction: column; min-width: 145px; }
    .counter strong { font-size: 28px; color: #3949ab; }
    .counter span { color: #555c80; font-size: 12px; }
    .task-list { display: grid; gap: 12px; }
    .task-card { border-radius: 12px; box-shadow: 0 3px 14px #20243a0c; }
    .task-card mat-card-content { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 14px 18px; }
    .task-info, .task-actions { display: flex; align-items: center; gap: 14px; }
    .task-icon { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: #f0f1fb; color: #6874bd; }
    .task-text h2 { margin: 0 0 7px; font-size: 16px; font-weight: 500; }
    .task-text p { margin: 0; display: flex; align-items: center; gap: 6px; color: #85899a; font-size: 13px; }
    .task-text p mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .status-chip { background: #fff3d8 !important; color: #956500 !important; font-size: 12px; }
    .empty-card { text-align: center; padding: 48px 20px; border-radius: 14px; color: #777d91; }
    .empty-card > mat-icon { font-size: 48px; width: 48px; height: 48px; color: #5c6bc0; }
    .empty-card h2 { color: #252a40; margin-bottom: 6px; }
    .empty-card p { margin-bottom: 22px; }
    @media (max-width: 640px) {
      .container { margin: 28px auto; padding: 0 14px; }
      .intro { align-items: flex-start; flex-direction: column; }
      .counter { flex-direction: row; align-items: baseline; gap: 8px; }
      .task-card mat-card-content { align-items: flex-start; flex-direction: column; }
      .task-actions { width: 100%; justify-content: flex-end; gap: 4px; }
      .status-chip { margin-right: auto; }
      .toolbar { padding: 0 12px; }
      .add-button { min-width: 0; padding: 0 10px; }
    }
  `]
})
export class AppComponent implements OnDestroy {
  tarefas: Tarefa[] = [];
  private subscription: Subscription;

  constructor(
    private tarefaService: TarefaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.subscription = this.tarefaService.tarefas$.subscribe(lista => this.tarefas = lista);
  }

  get pendentes(): Tarefa[] {
    return this.tarefas.filter(t => t.status === 'nova').sort((a, b) => a.data.localeCompare(b.data));
  }

  novaTarefa(): void {
    this.dialog.open(TarefaDialogComponent, { width: '420px', maxWidth: '95vw', data: null })
      .afterClosed().subscribe((dados: NovaTarefa | undefined) => {
        if (!dados) return;
        this.tarefaService.criar(dados);
        this.aviso('Tarefa criada com sucesso.');
      });
  }

  editar(tarefa: Tarefa): void {
    this.dialog.open(TarefaDialogComponent, { width: '420px', maxWidth: '95vw', data: { ...tarefa } })
      .afterClosed().subscribe((dados: NovaTarefa | undefined) => {
        if (!dados) return;
        this.tarefaService.atualizar({ ...tarefa, ...dados });
        this.aviso('Tarefa atualizada.');
      });
  }

  concluir(tarefa: Tarefa): void {
    this.tarefaService.atualizar({ ...tarefa, status: 'realizada' });
    this.aviso('Tarefa marcada como realizada.');
  }

  excluir(tarefa: Tarefa): void {
    if (!confirm(`Deseja excluir a tarefa "${tarefa.nome}"?`)) return;
    this.tarefaService.excluir(tarefa.id);
    this.aviso('Tarefa excluída.');
  }

  private aviso(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', { duration: 2500 });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}