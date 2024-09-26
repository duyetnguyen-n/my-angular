import { Component, OnInit } from '@angular/core';
import { NzTableFilterFn, NzTableModule, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LinkedService } from '../../linked.service';
import { TeachGroupComponent } from '../teach-group/teach-group.component';
import { ActivatedRoute, RouterModule } from '@angular/router';


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
  avatarURL: string;
  rank: number;
}

interface TeachGroup {
  id: string;
  name: string;
  count: number;
}
interface Evaluate {
  id: string;
  stt: number;
  userId: string;

}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<any> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<any> | null;
}

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [NzTableModule,RouterModule, CommonModule, FormsModule, ReactiveFormsModule, TeachGroupComponent],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  providers: [NzModalService]

})
export class RatingComponent implements OnInit {
  loading = true;
  listOfUsers: User[] = [];
  listOfDisplayData: User[] = [];
  pageIndex = 1;
  pageSize = 5;
  listOfTeachGroups: TeachGroup[] = [];
  evaluate!: Evaluate;
  listEvaluate: Evaluate[] = [];
  eva: string = '';

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
    sortFn: null,
    listOfFilter: [],
    filterFn: null
  },

  {
    name: 'Vị trí',
    sortOrder: null,
    sortFn: null,
    listOfFilter: [],
    filterFn: null
  },

  {
    name: 'Email',
    sortOrder: null,
    sortFn: null,
    listOfFilter: [],
    filterFn: null
  },

  {
    name: 'Nhóm giảng dạy',
    sortOrder: null,
    sortFn: null,
    listOfFilter: [],
    filterFn: null
  },
  {
    name: 'Điểm',
    sortOrder: null,
    sortFn: (a: User, b: User) => a.points - b.points,
    listOfFilter: [],
    filterFn: null
  }
  ];
  constructor(private service: LinkedService, private modal: NzModalService) { }

reloadListUser(): void {
  this.loading = true;

  Promise.all([
    this.service.takeListUser().toPromise(),
    this.service.takeListEvaluate().toPromise()
  ]).then(([users, evaluates]) => {
    if (!users || !evaluates) {
      console.error("Lỗi: Không thể tải danh sách users hoặc evaluates");
      this.loading = false;
      return;
    }

    // Gán dữ liệu
    this.listOfUsers = users.sort((a, b) => b.points - a.points);
    this.listEvaluate = evaluates;

    // Gán thứ tự từ evaluate cho người dùng
    this.listOfUsers.forEach((user, index) => {
      this.eva = this.listEvaluate.find(e => e.userId === user.id)?.id || '';
      // Cập nhật evaluate.stt

      // Lấy thứ tự (STT) từ evaluate
      user.rank = this.getSttByUserId(user.id);

      // Gọi API để cập nhật thứ tự vào bảng evaluate
      this.service.updateEvaluateStt(this.eva,index+1).subscribe(
        response => {
          console.log(`Cập nhật thứ tự cho user ${user.name} thành công!`);
        },
        error => {
          console.error(`Cập nhật thứ tự cho user ${user.name} thất bại!`, error);
        }
      );
    });

    // Cập nhật dữ liệu hiển thị
    this.updateDisplayData();
    this.loading = false;
  }).catch(error => {
    console.error("Lỗi khi tải danh sách:", error);
    this.loading = false;
  });
}

updateEvaluateStatus(evaluateId: string, newStt: number): void {
  this.service.updateEvaluateStt(evaluateId, newStt).subscribe(response => {
    if (response && response.code === 200) {
      console.log('Update thành công');
      this.reloadListUser(); // Tải lại danh sách người dùng sau khi update
    } else {
      console.error('Không thể cập nhật STT');
    }
  });
}


  updateDisplayData(): void {
  const startIndex = (this.pageIndex - 1) * this.pageSize;
  const endIndex = this.pageIndex * this.pageSize;
  this.listOfDisplayData = this.listOfUsers.slice(startIndex, endIndex);
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
  reloadListEvaluates(): void {
    this.service.takeListEvaluate().subscribe(data => {
      this.listEvaluate = data;
    });
  }
  getTeachGroupNameById(teachGroupId: string): string {
    const teachGroup = this.listOfTeachGroups.find(tg => tg.id === teachGroupId);
    return teachGroup ? teachGroup.name : 'Unknown TeachGroup';
  }
  getSttByUserId(userId: string): number {
    const evaluate = this.listEvaluate.find(e => e.userId === userId);
    return evaluate ? evaluate.stt : 0;
  }
  ngOnInit(): void {
    this.reloadListTeachGroups();
    this.reloadListUser();
    this.reloadListEvaluates();
  }




}
