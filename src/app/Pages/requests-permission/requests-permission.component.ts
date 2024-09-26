import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../linked.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import {ActivatedRoute, RouterModule} from '@angular/router';
interface Rank {
  id: string;
  name: string;
}
interface Criteria {
  id: string;
  name: string;
}
interface CriteriaOfAEvaluate {
  id: string;
  evaluateId: string;
  criteriaId: string;
  name: string;
  quantity: number;
  total: number;
}

interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-requests-permission',
  standalone: true,
  imports: [CommonModule,NzTableModule,RouterModule, FullscreenFormComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './requests-permission.component.html',
  styleUrl: './requests-permission.component.css',
  providers: [NzModalService]

})
export class RequestsPermissionComponent implements OnInit  {
trackById(index: number, item: CriteriaOfAEvaluate): string {
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
  listOfCurrentPageData: readonly CriteriaOfAEvaluate[] = [];
  listOfCriteriaOfAevaluate: readonly CriteriaOfAEvaluate[] = [];
  setOfCheckedId = new Set<string>();
  listOfRanks: Rank[] = [];
  listOfUsers: User[] = [];
  listOfCriterias: Criteria[] = [];

  @Output() formSubmit = new EventEmitter<void>();

  @Input() evaluate_id: string = '';
  @Input() evaluate_name: string = '';
  @Input() evaluate_userId: string = '';
  @Input() evaluate_rankId: string = '';
  @Input() evaluate_totalPointSubstraction: number | null = null;
  @Input() evaluate_totalPointAddition: number | null = null;
  @Input() evaluate_from: string ='';
  @Input() evaluate_to: string = '';



  constructor(private service: LinkedService, private modal: NzModalService) { }
  onEvaluateChange() {
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
  if (this.evaluate_name === 'Đánh giá học kì 1') {
    this.evaluate_from = new Date(currentYear, 4, 20).toISOString().split('T')[0]; // 20/5
    this.evaluate_to = new Date(currentYear, 11, 15).toISOString().split('T')[0]; // 15/12
  } else if (this.evaluate_name === 'Đánh giá học kì 2') {
    this.evaluate_from = new Date(currentYear, 11, 16).toISOString().split('T')[0]; // 16/12
    this.evaluate_to = new Date(currentYear + 1, 4, 19).toISOString().split('T')[0]; // 19/5
  }
}

  editEvaluate() {
    if (this.evaluate_name && this.evaluate_userId && this.evaluate_rankId && this.evaluate_from && this.evaluate_to) {
      const val = {
        Id: this.evaluate_id,
        From: this.evaluate_from,
        To: this.evaluate_to
      };

      this.service.updateEvaluate(val).subscribe(
        (res) => {
          if (res) {
            alert(res.message);
          }
          this.formSubmit.emit();
        },
        (error) => {
          console.error('Error:', error);
          alert('Đã xảy ra lỗi: ' + error.message);
        }
      );
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }

  reloadListRanks() {
    this.service.takeListRank().subscribe((data) => {
      this.listOfRanks = Array.isArray(data) ? data : [];
    });
  }

  reloadListUsers() {
    this.service.takeListUser().subscribe((data) => {
      this.listOfUsers = Array.isArray(data) ? data : [];
    });
  }
  reloadListCriterias() {
    this.service.takeListCriteria().subscribe((data) => {
      this.listOfCriterias = Array.isArray(data) ? data : [];
    });
  }

  reloadListCriteriaOfEvaluate() {
    this.loading = true;
    this.service.takeListCriteriaOfEvaluate(this.evaluate_id).subscribe(
      data => {
        this.listOfCriteriaOfAevaluate = data;
        this.updateDisplayData();
        this.loading = false;
      },
      error => {
        console.error('Error loading logs:', error);
        this.loading = false;
      }
    );
  }

  updateDisplayData(): void {
    this.listOfCurrentPageData = this.listOfCriteriaOfAevaluate; // Hoặc áp dụng phân trang nếu cần
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

  onCurrentPageDataChange($event: readonly CriteriaOfAEvaluate[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
  getCriteriaNameById(criteriaId: string): string {
  if (!criteriaId) return 'Unknown Criteria';
  const criteria = this.listOfCriterias.find(c => c.id === criteriaId);
  return criteria ? criteria.name : 'Unknown Criteria';
  }

  ngOnInit(): void {
    this.reloadListRanks();
    this.reloadListUsers();
    this.reloadListCriteriaOfEvaluate();
    this.reloadListCriterias();
  }
}
