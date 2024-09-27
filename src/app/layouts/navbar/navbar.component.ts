import { Component, OnInit } from '@angular/core';
import { LinkedService } from '../../linked.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Evaluate {
  id: string;
  name: string;
  userId: string;
  rankId: string;
  stt: number;
  totalPointSubstraction: number;
  totalPointAddition: number;
  from: string;
  to: string;
  totalPoint: number;
}
interface User {
  id: string;
  numberPhone: string;
  password: string;
  position: string;
  name: string;
  age: number;
  mail: string;
  gender: string;
  teachGroupId: string;
  points: number;
  avatar: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isDropdownVisible: boolean = false;
  requestedPermissions: any[] = [];
  listUser: User[] = [];
  listEvaluate: Evaluate[] = [];

  constructor(private service: LinkedService) {}

   getUserById(UserId: string): string {
  const user = this.listUser.find(u => u.id === UserId);
  return user ? user.name : 'Unknown User';
   }
  reloadListUser() {
    this.service.takeListUser().subscribe(data => {
      this.listUser = Array.isArray(data) ? data : []; // Đảm bảo là mảng
    });
  }
  getEvaluateById(EvaluateId: string): string {
  const eva = this.listEvaluate.find(e => e.id === EvaluateId);
  return eva ? eva.name : 'Unknown Evaluate';
   }
  reloadListEvaluate() {
    this.service.takeListEvaluate().subscribe(data => {
      this.listEvaluate = Array.isArray(data) ? data : []; // Đảm bảo là mảng
    });
  }
  // Hàm bật/tắt dropdown
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
    if (this.isDropdownVisible) {
      this.loadRequestedPermissions();
    }
  }

  // Gọi API để lấy danh sách RequestedPermission
  loadRequestedPermissions() {
    this.service.takeListRequests().subscribe(
      (data: any) => {
        this.requestedPermissions = data;
      },
      (error) => {
        console.error('Error fetching requested permissions:', error);
      }
    );
  }
  ngOnInit(): void {
    this.loadRequestedPermissions();
    this.reloadListUser();
    this.reloadListEvaluate();
  }

}
