import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { NzTableFilterFn, NzTableModule, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TeachGroupFormAddComponent } from './teach-group-form-add/teach-group-form-add.component';
import { LinkedService } from '../../linked.service';
import { TeachGroupFormEditComponent } from './teach-group-form-edit/teach-group-form-edit.component';

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
  selector: 'app-teach-group',
  standalone: true,
  imports: [NzTableModule, CommonModule, FormsModule, ReactiveFormsModule, TeachGroupFormAddComponent,TeachGroupFormEditComponent],
  templateUrl: './teach-group.component.html',
  styleUrl: './teach-group.component.css',
  providers: [NzModalService]
})
export class TeachGroupComponent implements OnInit {
  @Output() teachGroupSelected = new EventEmitter<string | null>();
  selectedTeachGroupId: string | null = null; // Để lưu ID của tổ dạy đang xem
  loading = true;
  listOfTeachGroup: TeachGroup[] = [];
  listOfDisplayData: TeachGroup[] = [];
  pageIndex = 1;
  pageSize = 5;
  TeachGroup: any;
  listOfTeachGroupColumns: ColumnItem[] = [
    {
      name: 'Tên',
      sortOrder: null,
      sortFn: (a: TeachGroup, b: TeachGroup) => a.name.localeCompare(b.name),
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Số lượng',
      sortOrder: null,
      sortFn: (a: TeachGroup, b: TeachGroup) => a.count - b.count,
      listOfFilter: [],
      filterFn: null
    }
  ];

  constructor(private service: LinkedService, private modal: NzModalService) { }

  toggleViewTeachGroup(teachGroup: TeachGroup): void {
    if (this.selectedTeachGroupId === teachGroup.id) {
      this.selectedTeachGroupId = null;
    } else {
      this.selectedTeachGroupId = teachGroup.id;
    }
    this.teachGroupSelected.emit(this.selectedTeachGroupId); // Truyền ID của nhóm được chọn
  }

  reloadListTeachGroup() {
    this.loading = true;
    this.service.takeListTeachGroups().subscribe(data => {
      this.listOfTeachGroup = data;
      this.updateDisplayData();
      this.loading = false;
    });
  }
  updateDisplayData(): void {
  const startIndex = (this.pageIndex - 1) * this.pageSize;
  const endIndex = this.pageIndex * this.pageSize;
  this.listOfDisplayData = this.listOfTeachGroup.slice(startIndex, endIndex);
  }
  onPageIndexChange(pageIndex: number): void {
  this.pageIndex = pageIndex;
  this.updateDisplayData();
  }

  openAddFormTeachGroup(): void {
  const modalRef = this.modal.create({
    nzTitle: 'Thêm Nhóm Tiêu Chí',
    nzContent: TeachGroupFormAddComponent,
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
    this.reloadListTeachGroup();
    modalRef.close();
  });
  }
  openEditFormTeachGroup(data: TeachGroup) {
  const modalRef = this.modal.create({
    nzTitle: 'Sửa Nhóm Tiêu Chí',
    nzContent: TeachGroupFormEditComponent,
    nzFooter: null,
    nzMaskClosable: true,
    nzMask: true,
    nzStyle: { borderRadius: '20px' },
    nzBodyStyle: { borderRadius: '20px' }
  });

  // Truyền giá trị sau khi modal đã được tạo
  modalRef.componentInstance!.TeachGroup_name = data.name;
  modalRef.componentInstance!.TeachGroup_id = data.id;

  modalRef.componentInstance?.formSubmit.subscribe(() => {
    this.reloadListTeachGroup();
    modalRef.close();
  });
  }

  showConfirmDelete(data: TeachGroup): void {
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
          this.service.deleteTeachGroup(data.id).subscribe(
            res => {
              this.reloadListTeachGroup(); // Tải lại danh sách sau khi xóa thành công
              resolve();
            },
            error => {
              console.error('Error:', error);
              reject(); // Nếu có lỗi xảy ra
            }
          );
        })
    });
  }


  ngOnInit(): void {
    this.reloadListTeachGroup();
  }
}
