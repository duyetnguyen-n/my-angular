import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTableFilterFn, NzTableModule, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CriteriaGroupComponent } from '../criteria-group/criteria-group.component';
import { RankComponent } from "../rank/rank.component";
import { CriteriaFormAddComponent } from './criteria-form-add/criteria-form-add.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CriteriaFormEditComponent } from './criteria-form-edit/criteria-form-edit.component';
import { AuthService } from '../../Services/auth.service';

interface Criteria {
  id: string;
  name: string;
  points: number;
  notes: string;
  personCheck: string;
  criteriaGroupId: string;

}
interface CriteriaGroup {
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
  selector: 'app-criteria',
  standalone: true,
  imports: [NzTableModule, CommonModule, FullscreenFormComponent, FormsModule, ReactiveFormsModule, CriteriaGroupComponent, RankComponent],
  templateUrl: './criteria.component.html',
  styleUrl: './criteria.component.css',
  providers: [NzModalService]
})
export class CriteriaComponent implements OnInit {
  loading = true;
  listOfCriteria: Criteria[] = [];
  listOfDisplayData: Criteria[] = [];
  pageIndex = 1;
  pageSize = 5;
  Criteria: any;
  listOfCriteriaGroup: CriteriaGroup[] = [];
  userPosition: string | null = null;

  getCriteriaGroupNameById(criteriaGroupId: string): string {
  if (!criteriaGroupId) return 'Unknown Group'; // Xử lý giá trị không hợp lệ
  const group = this.listOfCriteriaGroup.find(group => group.id === criteriaGroupId);
  return group ? group.name : 'Unknown Group';
}


    listOfCriteriaColumns: ColumnItem[] = [
    {
      name: 'Tên',
      sortOrder: null,
      sortFn: (a: Criteria, b: Criteria) => a.name.localeCompare(b.name),
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Điểm',
      sortOrder: null,
      sortFn: (a: Criteria, b: Criteria) => a.points - b.points,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Ghi chú',
      sortOrder: null,
      sortFn: (a: Criteria, b: Criteria) => a.notes.localeCompare(b.notes),
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Người kiểm tra',
      sortOrder: null,
      sortFn: (a: Criteria, b: Criteria) => a.personCheck.localeCompare(b.personCheck),
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Nhóm tiêu chí',
      sortOrder: null,
      sortFn: (a: Criteria, b: Criteria) => a.criteriaGroupId.localeCompare(b.criteriaGroupId),
      listOfFilter: [],
      filterFn: null
    }
    ];
  constructor(private service: LinkedService,
    private modal: NzModalService,
    private authService: AuthService) { }

  canEditOrDelete(): boolean {
    return this.userPosition === 'Admin';
  }

  reloadListCriteria() {
    this.loading = true;
    this.service.takeListCriteria().subscribe(data => {
      console.log(data);
      this.listOfCriteria = data;
      this.updateDisplayData();
      this.loading = false;
    });
  }
    updateDisplayData(): void {
      const startIndex = (this.pageIndex - 1) * this.pageSize;
      const endIndex = this.pageIndex * this.pageSize;
      this.listOfDisplayData = this.listOfCriteria.slice(startIndex, endIndex);
    }
    onPageIndexChange(pageIndex: number): void {
  this.pageIndex = pageIndex;
  this.updateDisplayData();
  }

  openAddFormCriteria(): void {
    const modalRef = this.modal.create({
    nzTitle: 'Thêm Tiêu Chí',
    nzContent: CriteriaFormAddComponent,
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
    this.reloadListCriteria();
    modalRef.close();
  });
  }
  reloadListCriteriaGroup() {
  this.service.takeListCriteriaGroup().subscribe(data => {
    console.log('Criteria Group Data:', data);
    this.listOfCriteriaGroup = Array.isArray(data) ? data : []; // Đảm bảo là mảng
  });
}



  openEditFormCriteria(data: Criteria) {
  const modalRef = this.modal.create({
    nzTitle: 'Sửa Nhóm Tiêu Chí',
    nzContent: CriteriaFormEditComponent,
    nzFooter: null,
    nzMaskClosable: true,
    nzMask: true,
    nzStyle: { borderRadius: '20px' },
    nzBodyStyle: { borderRadius: '20px' }
  });

  // Truyền giá trị sau khi modal đã được tạo
  modalRef.componentInstance!.criteria_id = data.id;
  modalRef.componentInstance!.criteria_name = data.name;
  modalRef.componentInstance!.criteria_points = data.points;
  modalRef.componentInstance!.criteria_notes = data.notes;
  modalRef.componentInstance!.criteria_PersonCheck = data.personCheck;
  modalRef.componentInstance!.criteria_group = data.criteriaGroupId;

  modalRef.componentInstance?.formSubmit.subscribe(() => {
    this.reloadListCriteria();
    modalRef.close();
  });
  }

  showConfirmDelete(data: Criteria): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa tiêu chí này?',
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
          this.service.deleteCriteria(data.id).subscribe(
            res => {
              alert(res.message);
              this.reloadListCriteria();
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

  ngOnInit(): void {
    this.reloadListCriteria();
    this.reloadListCriteriaGroup();
    this.userPosition = this.authService.getUserPosition();

  }

}
