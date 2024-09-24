import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LinkedService } from './linked.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './Services/auth.service';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './Services/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MainComponent,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-angular';
  isLoggedIn: boolean;

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.hasToken();
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated; // Cập nhật trạng thái đăng nhập
    });
  }
}
