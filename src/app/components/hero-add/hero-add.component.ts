import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialogContent, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-hero-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './hero-add.component.html',
  styleUrl: './hero-add.component.sass',
})
export class HeroAddComponent {
  public heroeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HeroAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.heroeForm = this.fb.group({
    id: [data?.id],
    nombre: [data?.nombre || '', Validators.required],
    imagen: [data?.imagen || '', Validators.required],
    descripcion: [data?.descripcion || '', Validators.required],
  });
  }

  onSubmit() {
    if (this.heroeForm.valid) {
      this.dialogRef.close(this.heroeForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
