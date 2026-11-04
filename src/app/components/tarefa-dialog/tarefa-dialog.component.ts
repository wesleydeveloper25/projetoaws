import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Tarefa, StatusTarefa } from '../../models/tarefa.model';

@Component({
  selector: 'app-tarefa-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar tarefa' : 'Nova tarefa' }}</h2>
    <form [formGroup]="form" (ngSubmit)="salvar()">
      <mat-dialog-content class="dialog-content">
        <mat-form-field appearance="outline">
          <mat-label>Nome da tarefa</mat-label>
          <input matInput formControlName="nome" maxlength="100" placeholder="Ex.: Estudar Angular">
          <mat-error>Informe o nome da tarefa.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Data</mat-label>
          <input matInput type="date" formControlName="data">
          <mat-error>Informe uma data válida.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="nova">Nova</mat-option>
            <mat-option value="realizada">Realizada</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Salvar</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .dialog-content { display: flex; flex-direction: column; gap: 8px; min-width: min(360px, 75vw); padding-top: 8px; }
    mat-form-field { width: 100%; }
  `]
})
export class TarefaDialogComponent {
  readonly form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TarefaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tarefa | null
  ) {
    this.form = this.fb.group({
      nome: [this.data?.nome ?? '', [Validators.required, Validators.maxLength(100)]],
      data: [this.data?.data ?? new Date().toISOString().slice(0, 10), Validators.required],
      status: [this.data?.status ?? 'nova' as StatusTarefa, Validators.required]
    });
  }

  salvar(): void {
    if (this.form.invalid) return;
    const valor = this.form.getRawValue();
    this.dialogRef.close({
      nome: valor.nome!.trim(),
      data: valor.data!,
      status: valor.status as StatusTarefa
    });
  }
}