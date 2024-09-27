import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../linked.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

interface Rank {
  id: string;
  name: string;
}
interface Criteria {
  id: string;
  name: string;
}
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

interface PermissionRequests {
  id: string;
  userId: string;
  requetedPermissionId: string;
  status: string;
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
  imports: [CommonModule, NzTableModule, RouterModule, FullscreenFormComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './requests-permission.component.html',
  styleUrls: ['./requests-permission.component.css'],
  providers: [NzModalService]
})
export class RequestsPermissionComponent implements OnInit {
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
  listPermissionRepuests: PermissionRequests[] = [];
  userCurrentId: string | null = null;


  @Output() formSubmit = new EventEmitter<void>();

  evaluate_id: string = '';
  evaluate_name: string = '';
  evaluate_from: string = '';
  evaluate_to: string = '';

  constructor(private service: LinkedService,
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
  private authService: AuthService) { }

  onEvaluateChange() {
    const currentYear = new Date().getFullYear();
    if (this.evaluate_name === 'Đánh giá học kì 1') {
      this.evaluate_from = new Date(currentYear, 4, 20).toISOString().split('T')[0];
      this.evaluate_to = new Date(currentYear, 11, 15).toISOString().split('T')[0];
    } else if (this.evaluate_name === 'Đánh giá học kì 2') {
      this.evaluate_from = new Date(currentYear, 11, 16).toISOString().split('T')[0];
      this.evaluate_to = new Date(currentYear + 1, 4, 19).toISOString().split('T')[0];
    }
  }

  editEvaluate() {
    const val = {
      Id: this.evaluate_id,
      Name: this.evaluate_name,
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
        console.log("abc: " + val.Id);
        console.error('Error:', error);
        alert('Đã xảy ra lỗi: ' + error.message );
      }
    );
  }
  getRequestsFromEvaluateId(evaluateId: string): PermissionRequests {
  const requests = this.listPermissionRepuests.find(p => p.requetedPermissionId === evaluateId);
  return requests ?? { id: '', userId: '', requetedPermissionId: '', status: '' };
}


  approvePermission() {
    const userId = this.userCurrentId;
    const val = {
      Id: this.getRequestsFromEvaluateId(this.evaluate_id).id,
      evaluateId: this.evaluate_id,
      reviewerId: userId,
      status: 'đã cấp phép'
    };

    this.service.updatePermissionRequests(val).subscribe(
      (res) => {
        if (res) {
          alert('Cấp quyền thành công!');
        }
      },
      (error) => {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi: ' + error.message );
      }
    );
  }

  reloadListRanks() {
    this.service.takeListRank().subscribe((data) => {
      this.listOfRanks = Array.isArray(data) ? data : [];
    });
  }
  reloadListPermissionRequests() {
    this.service.takeListRequests().subscribe((data) => {
      this.listPermissionRepuests = Array.isArray(data) ? data : [];
    });
  }

  reloadListUsers() {
    this.service.takeListUser().subscribe((data) => {
      this.listOfUsers = Array.isArray(data) ? data : [];
    });
  }

  reloadListCriterias() {
    this.service.takeListCriteria().subscribe((data) => {
      console.log("aa" + this.evaluate_id);
      this.listOfCriterias = Array.isArray(data) ? data : [];
    });
  }

  reloadListCriteriaOfEvaluate() {
    this.service.takeListCriteriaOfEvaluate(this.evaluate_id).subscribe((data) => {
  this.listOfCriteriaOfAevaluate = Array.isArray(data) ? data : [];
});
  }

  ngOnInit(): void {
    this.evaluate_id = this.route.snapshot.paramMap.get('id') || '';
    this.reloadListRanks();
    this.reloadListPermissionRequests();
    this.reloadListUsers();
    this.reloadListCriteriaOfEvaluate();
    this.reloadListCriterias();
    this.userCurrentId = this.authService.getCurrentUserId();
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly CriteriaOfAEvaluate[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
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

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach((item) => this.updateCheckedSet(item.id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some((item) => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  getCriteriaNameById(criteriaId: string): string {
    const criteria = this.listOfCriterias.find(criteria => criteria.id === criteriaId);
    return criteria ? criteria.name : '';
  }
}
