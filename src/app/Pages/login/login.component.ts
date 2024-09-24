import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,        // Import NzFormModule
    NzInputModule,       // Import NzInputModule
    NzCheckboxModule,    // Import NzCheckboxModule
    NzButtonModule       // Import NzButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    // Khởi tạo FormGroup trong ngOnInit để tránh lỗi 'fb' sử dụng trước khi khởi tạo
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  onSubmit() {
  if (this.validateForm.valid) {
    console.log('submit', this.validateForm.value);

    // Sử dụng toán tử '!' để đảm bảo các giá trị không phải undefined
    const { userName, password } = this.validateForm.value;

    this.authService.login({ numberPhone: userName!, password: password! }).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        alert('Invalid credentials');
      }
    );
  } else {
    Object.values(this.validateForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}

}
