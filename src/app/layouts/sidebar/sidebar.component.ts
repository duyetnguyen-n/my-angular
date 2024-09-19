import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  sideMenuItems = [
    { id: 1, name: 'Trang Chủ', icon: 'bx bxs-dashboard', link: '/' },
    { id: 2, name: 'Người Dùng', icon: 'bx bxs-dashboard', link: '/nguoi-dung' },
    { id: 3, name: 'Tiêu Chí', icon: 'bx bxs-dashboard', link: '/tieu-chi' },
    { id: 4, name: 'Đánh Giá', icon: 'bx bxs-dashboard', link: '/danh-gia' },
    { id: 5, name: 'Lịch Sử', icon: 'bx bxs-dashboard', link: '/lich-su' }
  ];

  activeIndex: number = 1;

  constructor() {
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

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
