import { Component, OnInit } from '@angular/core';
import { NzTableFilterFn, NzTableModule, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LinkedService } from '../../linked.service';
import { UserFormAddComponent } from './user-form-add/user-form-add.component';
import { UserFormEditComponent } from './user-form-edit/user-form-edit.component';
import { TeachGroupComponent } from '../teach-group/teach-group.component';
import {ActivatedRoute, RouterModule} from '@angular/router';

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
  point: number;
  avatar: string;
  avatarURL: string;
}

interface TeachGroup {
  id: string;
  name: string;
  count: number;
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<any> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<any> | null;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NzTableModule,RouterModule, CommonModule, FormsModule, ReactiveFormsModule, TeachGroupComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [NzModalService]
})
export class UserComponent implements OnInit {
  loading = true;
  listOfUsers: User[] = [];
  listOfDisplayData: User[] = [];
  pageIndex = 1;
  pageSize = 5;
  listOfTeachGroups: TeachGroup[] = [];
  selectedTeachGroupId: string | null = null; // Thêm thuộc tính này để lưu ID của nhóm được chọn


  getTeachGroupNameById(teachGroupId: string): string {
    const teachGroup = this.listOfTeachGroups.find(tg => tg.id === teachGroupId);
    return teachGroup ? teachGroup.name : 'Unknown TeachGroup';
  }

listOfUserColumns: ColumnItem[] = [
  {
    name: 'Tên',
    sortOrder: null,
    sortFn: (a: User, b: User) => a.name.localeCompare(b.name),
    listOfFilter: [],
    filterFn: null
  },
  {
    name: 'Số điện thoại',
    sortOrder: null,
    sortFn: (a: User, b: User) => a.numberPhone.localeCompare(b.numberPhone),
    listOfFilter: [],
    filterFn: null
  },

  {
    name: 'Vị trí',
    sortOrder: null,
    sortFn: (a: User, b: User) => a.position.localeCompare(b.position),
    listOfFilter: [],
    filterFn: null
  },

  {
    name: 'Email',
    sortOrder: null,
    sortFn: (a: User, b: User) => a.mail.localeCompare(b.mail),
    listOfFilter: [],
    filterFn: null
  },

  {
    name: 'Nhóm giảng dạy',
    sortOrder: null,
    sortFn: (a: User, b: User) => a.teachGroupId.localeCompare(b.teachGroupId),
    listOfFilter: [],
    filterFn: null
  },
  {
    name: 'Điểm',
    sortOrder: null,
    sortFn: (a: User, b: User) => a.point - b.point,
    listOfFilter: [],
    filterFn: null
  }
];


  constructor(private service: LinkedService, private modal: NzModalService) { }

  reloadListUser(): void {
    this.loading = true;
    this.service.takeListUser().subscribe(data => {
      this.listOfUsers = data;
      this.updateDisplayData();
      this.loading = false;
    });
  }

  updateDisplayData(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = this.pageIndex * this.pageSize;
    // Nếu không có tổ dạy nào được chọn, hiển thị tất cả người dùng
    if (this.selectedTeachGroupId === null) {
      this.listOfDisplayData = this.listOfUsers.slice(startIndex, endIndex);
    } else {
      // Nếu có tổ dạy được chọn, lọc người dùng theo tổ dạy
      const filteredUsers = this.listOfUsers.filter(user => user.teachGroupId === this.selectedTeachGroupId);
      this.listOfDisplayData = filteredUsers.slice(startIndex, endIndex);
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.updateDisplayData();
  }

  reloadListTeachGroups(): void {
    this.service.takeListTeachGroups().subscribe(data => {
      this.listOfTeachGroups = data;
    });
  }

  openAddFormUser(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Thêm người dùng',
      nzContent: UserFormAddComponent,
      nzFooter: null,
      nzMaskClosable: true,
      nzMask: true,
      nzStyle: { borderRadius: '20px' },
      nzBodyStyle: { borderRadius: '20px' }
    });

    modalRef.componentInstance?.formSubmit.subscribe(() => {
      this.reloadListUser();
      modalRef.close();
    });
  }

  openEditFormUser(data: User): void {
    const modalRef = this.modal.create({
      nzTitle: 'Sửa người dùng',
      nzContent: UserFormEditComponent,
      nzFooter: null,
      nzMaskClosable: true,
      nzMask: true,
      nzStyle: { borderRadius: '20px' },
      nzBodyStyle: { borderRadius: '20px' }
    });

    modalRef.componentInstance!.user = {
      id: data.id,
      name: data.name,
      numberPhone: data.numberPhone,
      password: data.password,
      position: data.position,
      age: data.age,
      mail: data.mail,
      gender: data.gender,
      teachGroupId: data.teachGroupId,
      point: data.point,
      avatar: data.avatar,
      avatarURL: data.avatarURL
    };// Truyền dữ liệu user vào component
    modalRef.componentInstance?.formSubmit.subscribe(() => {
      this.reloadListUser();
      modalRef.close();
    });
  }

  showConfirmDelete(data: User): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa người dùng này?',
      nzContent: `<b>${data.name}</b> sẽ bị xóa vĩnh viễn.`,
      nzFooter: null,
      nzMaskClosable: true,
      nzMask: true,
      nzStyle: { borderRadius: '20px' },
      nzBodyStyle: { borderRadius: '20px' },
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.service.deleteUser(data.id).subscribe(
            () => {
              this.reloadListUser();
              resolve();
            },
            error => {
              const errorMessage = error.error?.message || 'Đã xảy ra lỗi không xác định';
              alert(errorMessage); // Hiển thị thông báo lỗi
              console.error('Error:', error);
              reject();
            }
          );
        })
    });
  }

  ngOnInit(): void {
    this.reloadListTeachGroups();
    this.reloadListUser();
  }
}
