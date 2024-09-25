import { Component, OnInit } from '@angular/core';
import { NzTableFilterFn, NzTableModule, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CriteriaGroupFormAddComponent } from './criteria-group-form-add/criteria-group-form-add.component';
import { LinkedService } from '../../linked.service';
import { CriteriaGroupFormEditComponent } from './criteria-group-form-edit/criteria-group-form-edit.component';

interface CriteriaGroup {
  id: string;
  name: string;
  count: number;
  role: string;
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<any> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<any> | null;
}

@Component({
  selector: 'app-criteria-group',
  standalone: true,
  imports: [NzTableModule, CommonModule, FormsModule, ReactiveFormsModule, CriteriaGroupFormAddComponent],
  templateUrl: './criteria-group.component.html',
  styleUrl: './criteria-group.component.css',
  providers: [NzModalService]
})
export class CriteriaGroupComponent implements OnInit {
  loading = true;
  listOfCriteriaGroup: CriteriaGroup[] = [];
  listOfDisplayData: CriteriaGroup[] = [];
  pageIndex = 1;
  pageSize = 5;
  CriteriaGroup: any;
  listOfCriteriaGroupColumns: ColumnItem[] = [
    {
      name: 'Tên',
      sortOrder: null,
      sortFn: (a: CriteriaGroup, b: CriteriaGroup) => a.name.localeCompare(b.name),
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Số lượng',
      sortOrder: null,
      sortFn: (a: CriteriaGroup, b: CriteriaGroup) => a.count - b.count,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Loại',
      sortOrder: null,
      sortFn: (a: CriteriaGroup, b: CriteriaGroup) => a.role.localeCompare(b.role),
      listOfFilter: [],
      filterFn: null
    }
  ];

  constructor(private service: LinkedService, private modal: NzModalService) { }

  reloadListCriteriaGroup() {
    this.loading = true;
    this.service.takeListCriteriaGroup().subscribe(data => {
      this.listOfCriteriaGroup = data;
      this.updateDisplayData();
      this.loading = false;
    });
  }
  updateDisplayData(): void {
  const startIndex = (this.pageIndex - 1) * this.pageSize;
  const endIndex = this.pageIndex * this.pageSize;
  this.listOfDisplayData = this.listOfCriteriaGroup.slice(startIndex, endIndex);
  }
  onPageIndexChange(pageIndex: number): void {
  this.pageIndex = pageIndex;
  this.updateDisplayData();
  }

  openAddFormCriteriaGroup(): void {
  const modalRef = this.modal.create({
    nzTitle: 'Thêm Nhóm Tiêu Chí',
    nzContent: CriteriaGroupFormAddComponent,
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
    this.reloadListCriteriaGroup();
    modalRef.close();
  });
  }
  openEditFormCriteriaGroup(data: CriteriaGroup) {
  const modalRef = this.modal.create({
    nzTitle: 'Sửa Nhóm Tiêu Chí',
    nzContent: CriteriaGroupFormEditComponent,
    nzFooter: null,
    nzMaskClosable: true,
    nzMask: true,
    nzStyle: { borderRadius: '20px' },
    nzBodyStyle: { borderRadius: '20px' }
  });

  // Truyền giá trị sau khi modal đã được tạo
  modalRef.componentInstance!.criteriaGroup_name = data.name;
  modalRef.componentInstance!.criteriaGroup_id = data.id;
  modalRef.componentInstance!.criteriaGroup_role = data.role;

  modalRef.componentInstance?.formSubmit.subscribe(() => {
    this.reloadListCriteriaGroup();
    modalRef.close();
  });
  }

  showConfirmDelete(data: CriteriaGroup): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa nhóm tiêu chí này?',
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
          this.service.deleteCriteriaGroup(data.id).subscribe(
            res => {
              this.reloadListCriteriaGroup(); // Tải lại danh sách sau khi xóa thành công
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
    this.reloadListCriteriaGroup();
  }
}
