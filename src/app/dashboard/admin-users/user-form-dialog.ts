import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export interface UserFormData {
  mode: 'create' | 'edit';
  user?: any;
  isEmailTaken: (email: string, currentId?: string) => boolean;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './user-form-dialog.html'
})
export class UserFormDialog {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    role: ['user', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormData
  ) {
    if (data?.user) {
      const { name, email, company, role } = data.user;
      this.form.patchValue({ name, email, company: company || '', role });
    }
    // Validator de email único en submit (sin async por simplicidad)
    this.form.get('email')?.valueChanges.subscribe(() => {
      const control = this.form.get('email');
      if (!control) return;
      const taken = this.data.isEmailTaken(control.value || '', this.data.user?.id);
      if (taken) {
        control.setErrors({ ...(control.errors || {}), emailTaken: true });
      } else {
        if (control.hasError('emailTaken')) {
          const { emailTaken, ...rest } = control.errors || {};
          control.setErrors(Object.keys(rest).length ? rest : null);
        }
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = {
      ...this.data.user,
      ...this.form.value,
      updatedAt: new Date()
    };
    this.dialogRef.close(payload);
  }
}
