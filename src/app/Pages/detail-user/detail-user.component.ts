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
  constructor(private route: ActivatedRoute,private service: LinkedService, private modal: NzModalService) { }
  loading = true;
  listOfEvaluate: Evaluate[] = [];
  listOfDisplayData: Evaluate[] = [];
  pageIndex = 1;
  pageSize = 5;
  Evaluate: any;
  listOfRanks: Rank[] = [];
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
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) { // Kiểm tra nếu userId không phải là null
      this.getUserNameById(userId);
    } else {
      console.error('User ID is null'); // Thông báo lỗi nếu userId là null
    }
    this.reloadListEvaluate();
  }
  getUserNameById(userId: string) {
  this.service.takeUser(userId).subscribe((response: any) => {
    this.UserInfo = response.data;
    console.log('UserInfo:', this.UserInfo);  // Kiểm tra giá trị sau khi gán

  }, error => {
      console.error('Error fetching user:', error);  // Kiểm tra lỗi
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
  reloadListEvaluate() {
    this.loading = true;
    this.service.takeListEvaluate().subscribe(data => {
        console.log(data);  // Kiểm tra phản hồi từ API
        this.listOfEvaluate = data;
        this.updateDisplayData();
        this.loading = false;
    }, error => {
        console.error('Error fetching evaluates:', error);  // Kiểm tra lỗi
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

  modalRef.componentInstance?.formSubmit.subscribe(() => {
    this.reloadListEvaluate();
    modalRef.close();
  });
  }
  openEditFormEvaluate(data: Evaluate): void {
    const modalRef = this.modal.create({
    nzTitle: 'Thêm Tiêu Chí',
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
    }
    });
    modalRef.componentInstance!.evaluate_id = data.id;
    modalRef.componentInstance!.evaluate_name = data.name;
    modalRef.componentInstance!.evaluate_userId = data.userId;
    modalRef.componentInstance!.evaluate_rankId = data.rankId;
    modalRef.componentInstance!.evaluate_totalPointSubstraction = data.totalPointSubstraction;
    modalRef.componentInstance!.evaluate_totalPointAddition = data.totalPointAddition;
    modalRef.componentInstance!.evaluate_from = data.from;
    modalRef.componentInstance!.evaluate_to = data.to;

  modalRef.componentInstance?.formSubmit.subscribe(() => {
    this.reloadListEvaluate();
    modalRef.close();
  });
  }



}
