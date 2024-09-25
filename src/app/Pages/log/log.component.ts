import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { LinkedService } from '../../linked.service';
import { NzModalService } from 'ng-zorro-antd/modal';

interface Log {
  id: string;
  userId: string;
  action: number;
  timeStamp: Date;
  status: string;
  description: string;
}
interface User {
  id: string;
  name: string;
}
@Component({
  selector: 'app-log',
  standalone: true,
  imports: [NzTableModule, CommonModule],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
  providers: [NzModalService]
})
export class LogComponent implements OnInit {
  trackById(index: number, item: Log): string {
    return item.id;
  }
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];

  checked = false;
  indeterminate = false;
  loading = false;
  listOfCurrentPageData: readonly Log[] = [];
  listOfLog: readonly Log[] = [];
  setOfCheckedId = new Set<string>();
  listOfUsers: User[] = [];

  constructor(private service: LinkedService, private modal: NzModalService) { }


  getUserNameById(userId: string): string {
    const user = this.listOfUsers.find(user => user.id === userId);
    return user ? user.name : 'Unknown User';
  }

  reloadListLog() {
    this.loading = true;
    this.service.takeListLog().subscribe(
      data => {
        this.listOfLog = data;
        this.updateDisplayData();
        this.loading = false;
      },
      error => {
        console.error('Error loading logs:', error);
        this.loading = false;
      }
    );
  }

  reloadListUsers() {
    this.service.takeListUser().subscribe(data => {
      this.listOfUsers = data;
    });
  }

  updateDisplayData(): void {
    this.listOfCurrentPageData = this.listOfLog; // Hoặc áp dụng phân trang nếu cần
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly Log[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  showConfirmDelete(data: Log): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa hành động này?',
      nzContent: `Hành động "<b>${data.action}</b>" sẽ bị xóa vĩnh viễn.`,
      nzFooter: null,
      nzMaskClosable: true, // Đóng khi click ra ngoài
      nzMask: true, // Hiển thị lớp phủ mờ
      nzStyle: {
        borderRadius: '20px',
      },
      nzBodyStyle: {
        borderRadius: '20px',
      },
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.service.deleteLog(data.id).subscribe(
            res => {
              alert(res.message);
              this.reloadListLog();
              resolve();
            },
            error => {
              const errorMessage = error.error?.message || 'Đã xảy ra lỗi không xác định';
              alert(errorMessage); // Hiển thị thông báo lỗi
              console.error('Error:', error);
              reject(); // Nếu có lỗi xảy ra
            }
          );
        })
    });
  }
  showConfirmDeleteAll(): void {
  const selectedIds = Array.from(this.setOfCheckedId); // Lấy danh sách các id được chọn
  if (selectedIds.length === 0) {
    alert('Vui lòng chọn ít nhất một mục để xóa.');
    return;
  }

  this.modal.confirm({
    nzTitle: 'Bạn có chắc chắn muốn xóa tất cả các mục đã chọn?',
    nzContent: 'Các mục đã chọn sẽ bị xóa vĩnh viễn.',
    nzOnOk: () =>
      new Promise((resolve, reject) => {
        this.service.deleteMultipleLogs(selectedIds).subscribe(
          res => {
            alert(res.message);
            this.reloadListLog(); // Tải lại danh sách sau khi xóa
            resolve();
          },
          error => {
            const errorMessage = error.error?.message || 'Đã xảy ra lỗi không xác định';
            alert(errorMessage);
            console.error('Error:', error);
            reject(); // Nếu có lỗi
          }
        );
      })
  });
}

  ngOnInit(): void {
    this.reloadListLog();
    this.reloadListUsers();
  }
}
