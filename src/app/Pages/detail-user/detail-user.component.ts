import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTableFilterFn, NzTableModule, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { EvaluateFormAddComponent } from './evaluate-form-add/evaluate-form-add.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CriteriaOfEvaluateComponent } from '../criteria-of-evaluate/criteria-of-evaluate.component';
import { EvaluateFormEditComponent } from './evaluate-form-edit/evaluate-form-edit.component';
import { userInfo } from 'os';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

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
  point: number;
  avatar: string;
}
interface Rank {
  id: string;
  name: string;
}
interface PermissionRequests {
  id: string;
  userId: string;
  requetedPermissionId: string;
  status: string;
}
interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<any> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<any> | null;
}
@Component({
  selector: 'app-detail-user',
  standalone: true,
  imports: [CommonModule,HttpClientModule, RouterModule,NzTableModule, FullscreenFormComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './detail-user.component.html',
  styleUrl: './detail-user.component.css',
  providers: [NzModalService]

})
export class DetailUserComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private service: LinkedService,
    private modal: NzModalService,
    private router: Router,
    private authService: AuthService) { }
    isRequestSent: { [key: string]: boolean } = {};
  loading = true;
  listOfEvaluate: Evaluate[] = [];
  listOfDisplayData: Evaluate[] = [];
  pageIndex = 1;
  pageSize = 5;
  Evaluate: any;
  listOfRanks: Rank[] = [];
  listPermissionRepuests: PermissionRequests[] = [];
  UserInfo: User = {
    id: '',
    numberPhone: '',
    password: '',
    position: '',
    name: '',
    age: 0,
    mail: '',
    gender: '',
    teachGroupId: '',
    point: 0,
    avatar: ''
  };
  userPosition: string | null = null;
  canEditOrDelete(): boolean {
    return this.userPosition === 'Admin';
  }
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.reloadListPermissionRequests();
    this.userPosition = this.authService.getUserPosition();
    if (userId) {
      this.getUserById(userId);
    } else {
      console.error('User ID is null');
    }
    this.reloadListRank();
  }
  getUserById(userId: string) {
  this.service.takeUser(userId).subscribe((response: any) => {
    this.UserInfo = response.data;
    console.log('UserInfoaa:', this.UserInfo);
    this.reloadListEvaluate();
  }, error => {
      console.error('Error fetching user:', error);
  });
}
  getRankNameById(rankId: string): string {
    const rank = this.listOfRanks.find(r => r.id === rankId);
    return rank ? rank.name : 'Unknown Rank';
  }

  listOfEvaluateColumns: ColumnItem[] = [
    {
      name: 'Tên',
      sortOrder: null,
      sortFn: (a: Evaluate, b: Evaluate) => a.name.localeCompare(b.name),
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Xếp Hạng',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Tổng Điểm Trừ',
      sortOrder: null,
      sortFn: (a: Evaluate, b: Evaluate) => a.totalPointSubstraction - b.totalPointSubstraction,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Tổng Điểm Cộng',
      sortOrder: null,
      sortFn: (a: Evaluate, b: Evaluate) => a.totalPointAddition - b.totalPointAddition,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Tổng Điểm',
      sortOrder: null,
      sortFn: (a: Evaluate, b: Evaluate) => a.totalPoint - b.totalPoint,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Top',
      sortOrder: null,
      sortFn: (a: Evaluate, b: Evaluate) => a.stt - b.stt,
      listOfFilter: [],
      filterFn: null
    },
    {
  name: 'Từ',
  sortOrder: null,
  sortFn: (a: Evaluate, b: Evaluate) => new Date(a.from).getTime() - new Date(b.from).getTime(),
  listOfFilter: [],
  filterFn: null
},
{
  name: 'Đến',
  sortOrder: null,
  sortFn: (a: Evaluate, b: Evaluate) => new Date(a.to).getTime() - new Date(b.to).getTime(),
  listOfFilter: [],
  filterFn: null
}

  ];

  getRequestsFromEvaluateId(evaluateId: string): PermissionRequests {
  const requests = this.listPermissionRepuests.find(p => p.requetedPermissionId === evaluateId);
  return requests ?? { id: '', userId: '', requetedPermissionId: '', status: '' };
  }
  reloadListPermissionRequests() {
    this.service.takeListRequests().subscribe((data) => {
      this.listPermissionRepuests = Array.isArray(data) ? data : [];
    });
  }
  reloadListEvaluate() {
    this.loading = true;
     console.log('UserInfoID:', this.UserInfo.id);

    this.service.takeListEvaluateByUserId(this.UserInfo.id).subscribe(data => {
        console.log(data);
        this.listOfEvaluate = data;
        this.updateDisplayData();
        this.loading = false;
    }, error => {
        console.error('Error fetching evaluates:', error);
        this.loading = false;
    });
  }
  reloadListRank() {
    this.service.takeListRank().subscribe(data => {
      this.listOfRanks = data;
    },error => {
        console.error('Error fetching evaluates:', error);
        this.loading = false;
    });
  }

    updateDisplayData(): void {
      const startIndex = (this.pageIndex - 1) * this.pageSize;
      const endIndex = this.pageIndex * this.pageSize;
      this.listOfDisplayData = this.listOfEvaluate.slice(startIndex, endIndex);
    }
    onPageIndexChange(pageIndex: number): void {
      this.pageIndex = pageIndex;
      this.updateDisplayData();
    }
  openAddFormEvaluate(): void {
    const modalRef = this.modal.create({
    nzTitle: 'Thêm Tiêu Chí',
    nzContent: EvaluateFormAddComponent,
    nzFooter: null,
    nzMaskClosable: true, // Đóng khi click ra ngoài
    nzMask: true, // Hiển thị lớp phủ mờ
    nzStyle: {
      borderRadius: '20px',
    },
    nzBodyStyle: {
      borderRadius: '20px',
    }
    });
    modalRef.componentInstance!.userId = this.UserInfo.id;

    modalRef.componentInstance?.formSubmitAdd.subscribe((valuateId: string) => {
    this.router.navigate([`/nguoi-dung/danh-gia/${valuateId}`]);

    this.reloadListEvaluate();
    modalRef.close();
  });
  }

  openEditFormEvaluate(data: Evaluate): void {
    const modalRef = this.modal.create({
    nzTitle: 'Sửa Đánh Giá',
    nzContent: EvaluateFormEditComponent,
      nzFooter: null,
    nzWidth: 800 ,
    nzMaskClosable: true,
    nzMask: true,
    nzStyle: {
      borderRadius: '20px',
    },
    nzBodyStyle: {
      borderRadius: '20px',
      height: 'calc(100% - 55px)',  // Adjust height inside modal body
      overflowY: 'auto',  // Để cho nội dung có thể cuộn nếu quá dài
    }
    });
    modalRef.componentInstance!.evaluate_id = data.id;
    modalRef.componentInstance!.evaluate_name = data.name;
    modalRef.componentInstance!.evaluate_userId = data.userId;
    modalRef.componentInstance!.evaluate_rankId = data.rankId;
    modalRef.componentInstance!.evaluate_totalPointSubstraction = data.totalPointSubstraction;
    modalRef.componentInstance!.evaluate_totalPointAddition = data.totalPointAddition;
    const fromDate = new Date(data.from);
    const toDate = new Date(data.to);
    modalRef.componentInstance!.evaluate_from = fromDate.toISOString().split('T')[0];
    modalRef.componentInstance!.evaluate_to = toDate.toISOString().split('T')[0];


  modalRef.componentInstance?.formSubmit.subscribe(() => {
    this.reloadListEvaluate();
    modalRef.close();
  });
  }
  FormSend(data: Evaluate) {
    const val = {
      UserId: this.UserInfo.id,
      RequetedPermissionId: data.id,
      TimeStamp: Date.now,
      Status: 'Chờ duyệt'
    };
      console.log('Form data being sent:', val); // Kiểm tra dữ liệu được gửi đi
    this.service.addPermissionRequests(val).subscribe(res => {
          this.isRequestSent[val.RequetedPermissionId] = true;
        if (res) {
          alert(res.message);
        }
      }, error => {
        console.error('Error:', error); // In ra thông tin lỗi chi tiết
        alert('Đã xảy ra lỗi: ' + error.message);
      });
  }
  cancelRequest(eva: Evaluate): void {
    this.service.deletePermissionRequests(eva.id).subscribe(
      (response: any) => {
        this.isRequestSent[eva.id] = false;
        console.log('Yêu cầu đã được hủy:', response);
      },
      (error: any) => {
        console.error('Hủy yêu cầu thất bại:', error);
      }
    );
  }

  showConfirmDelete(data: Evaluate): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa đánh giá này?',
      nzContent: `<b>${data.name}</b> sẽ bị xóa vĩnh viễn.`,
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
          this.service.deleteEvaluate(data.id).subscribe(
            res => {
              this.reloadListEvaluate(); // Tải lại danh sách sau khi xóa thành công
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

}
