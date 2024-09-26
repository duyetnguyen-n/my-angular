import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service'; // Đảm bảo đúng đường dẫn đến AuthService

@Component({

  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  sideMenuItems = [
    { id: 1, name: 'Trang Chủ', icon: 'bx bxs-dashboard', link: '/dashboard' },
    { id: 2, name: 'Người Dùng', icon: 'bx bxs-dashboard', link: '/nguoi-dung' },
    { id: 3, name: 'Tiêu Chí', icon: 'bx bxs-dashboard', link: '/tieu-chi' },
    { id: 4, name: 'Xếp Hạng', icon: 'bx bxs-dashboard', link: '/xep-hang' },
    { id: 5, name: 'Lịch Sử', icon: 'bx bxs-dashboard', link: '/lich-su' }
  ];

  activeIndex: number = 1;

  constructor(private authService: AuthService) {
    if (this.isBrowser()) {
      const savedIndex = localStorage.getItem('activeIndex');
      this.activeIndex = savedIndex ? +savedIndex : 1;
    }
  }

  setActive(index: number) {
    this.activeIndex = index;
    if (this.isBrowser()) {
      localStorage.setItem('activeIndex', index.toString());
    }
  }
  onLogout(): void {
    this.authService.logout();
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
