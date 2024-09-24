import { Component, OnInit } from '@angular/core';
import { NzTableFilterFn, NzTableModule, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LinkedService } from '../../linked.service';
import { RankFormAddComponent } from './rank-form-add/rank-form-add.component';
import { RankFormEditComponent } from './rank-form-edit/rank-form-edit.component';

interface Rank {
  id: string;
  name: string;
  pointRangeStart: number;
  pointRangeEnd: number;
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<any> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<any> | null;
}

@Component({
  selector: 'app-rank',
  standalone: true,
  imports: [NzTableModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './rank.component.html',
  styleUrl: './rank.component.css',
  providers: [NzModalService]

})
export class RankComponent implements OnInit {
  loading = true;
  listOfRank: Rank[] = [];
  listOfRankDataDisplay: Rank[] = [];
  pageIndex = 1;
  pageSize = 5;
  Rank: any;
  constructor(private service: LinkedService, private modal: NzModalService) { }

  listOfRankColumns: ColumnItem[] = [
  {
    name: 'Tên',
    sortOrder: null,
    sortFn: (a: Rank, b: Rank) => a.name.localeCompare(b.name),
    listOfFilter: [],
    filterFn: null
  },
  {
    name: 'Từ điểm',
    sortOrder: null,
    sortFn: (a: Rank, b: Rank) => a.pointRangeStart - b.pointRangeStart,
    listOfFilter: [],
    filterFn: null
  },
  {
    name: 'Đến điểm',
    sortOrder: null,
    sortFn: (a: Rank, b: Rank) => a.pointRangeEnd - b.pointRangeEnd,
    listOfFilter: [],
    filterFn: null
  }
  ];

  reloadListRank() {
    this.loading = true;
    this.service.takeListRank().subscribe(data => {
      this.listOfRank = data;
      this.updateDisplayData();
      this.loading = false;
    });
  }
  updateDisplayData(): void {
  const startIndex = (this.pageIndex - 1) * this.pageSize;
  const endIndex = this.pageIndex * this.pageSize;
  this.listOfRankDataDisplay = this.listOfRank.slice(startIndex, endIndex);
  }
  onPageIndexChange(pageIndex: number): void {
  this.pageIndex = pageIndex;
  this.updateDisplayData();
  }

  openAddFormRank(): void {
  const modalRef = this.modal.create({
    nzTitle: 'Thêm Mức Xét Tuyển',
    nzContent: RankFormAddComponent,
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
    this.reloadListRank();
    modalRef.close();
  });
  }
  openEditFormRank(data: Rank) {
  const modalRef = this.modal.create({
    nzTitle: 'Sửa Nhóm Tiêu Chí',
    nzContent: RankFormEditComponent,
    nzFooter: null,
    nzMaskClosable: true,
    nzMask: true,
    nzStyle: { borderRadius: '20px' },
    nzBodyStyle: { borderRadius: '20px' }
  });

  modalRef.componentInstance!.Rank_id = data.id;
  modalRef.componentInstance!.Rank_name = data.name;
  modalRef.componentInstance!.pointRangeStart = data.pointRangeStart;
  modalRef.componentInstance!.pointRangeEnd = data.pointRangeEnd;

  modalRef.componentInstance?.formSubmit.subscribe(() => {
    this.reloadListRank();
    modalRef.close();
  });
  }

  showConfirmDelete(data: Rank): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa xếp loại này?',
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
          this.service.deleteRank(data.id).subscribe(
            res => {
              this.reloadListRank(); // Tải lại danh sách sau khi xóa thành công
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
    this.reloadListRank();
  }
}
