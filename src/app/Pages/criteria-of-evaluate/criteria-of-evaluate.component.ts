import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTableFilterFn, NzTableModule, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CriteriaGroupComponent } from '../criteria-group/criteria-group.component';
import { RankComponent } from "../rank/rank.component";
import { NzModalService } from 'ng-zorro-antd/modal';
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
@Component({
  selector: 'app-criteria-of-evaluate',
  standalone: true,
  imports: [NzTableModule, CommonModule, FullscreenFormComponent, FormsModule, ReactiveFormsModule, CriteriaGroupComponent,],
  templateUrl: './criteria-of-evaluate.component.html',
  styleUrl: './criteria-of-evaluate.component.css',
  providers: [NzModalService]

})
export class CriteriaOfEvaluateComponent implements OnInit {
  checked = false;
  indeterminate = false;
  loading = false;
  listOfCurrentPageData: readonly Criteria[] = [];
  listOfCriteria: readonly Criteria[] = [];
  setOfCheckedId = new Set<string>();
  listOfCriteriaGroup: CriteriaGroup[] = [];
  constructor(private service: LinkedService, private modal: NzModalService) { }

  getCriteriaGroupNameById(criteriaGroupId: string): string {
  if (!criteriaGroupId) return 'Unknown Group'; // Xử lý giá trị không hợp lệ
  const group = this.listOfCriteriaGroup.find(group => group.id === criteriaGroupId);
  return group ? group.name : 'Unknown Group';
  }
  trackById(index: number, item: Criteria): string {
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

  reloadListCriteria() {
    this.loading = true;
    this.service.takeListCriteria().subscribe(
      data => {
        this.listOfCriteria = data;
        this.updateDisplayData();
        this.loading = false;
      },
      error => {
        console.error('Error loading criteries:', error);
        this.loading = false;
      }
    );
  }

  reloadListCriteriaGroup() {
    this.service.takeListCriteriaGroup().subscribe(data => {
      this.listOfCriteriaGroup = data;
    });
  }

  updateDisplayData(): void {
    this.listOfCurrentPageData = this.listOfCriteria; // Hoặc áp dụng phân trang nếu cần
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

  onCurrentPageDataChange($event: readonly Criteria[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  ngOnInit(): void {
    this.reloadListCriteria();
    this.reloadListCriteriaGroup();
  }

}
