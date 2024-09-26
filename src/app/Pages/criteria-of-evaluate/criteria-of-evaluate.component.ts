import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../linked.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CriteriaOfEvaluateAddComponent } from './criteria-of-evaluate-add/criteria-of-evaluate-add.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

interface Criteria {
  id: string;
  name: string;
  points: number;
  notes: string;
  personCheck: string;
  criteriaGroupId: string;
}

interface CriteriaOfAEvaluation {
  id: string;
  evaluateId: string;
  criteriaId: string;
  quantity: number;
  total: number;
}

interface CriteriaGroup {
  id: string;
  name: string;
}

@Component({
  selector: 'app-criteria-of-evaluate',
  standalone: true,
  imports: [
    NzTableModule,
    CommonModule,
    FullscreenFormComponent,
    RouterModule,
    NzBreadCrumbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './criteria-of-evaluate.component.html',
  styleUrl: './criteria-of-evaluate.component.css',
  providers: [NzModalService]
})
export class CriteriaOfEvaluateComponent implements OnInit {
  checked = false;
  indeterminate = false;
  loading = false;
  setOfCheckedId = new Set<string>();
  evaluateId!: string;
  criteriaGroup_name: string = '';

  selectedCriteriaGroup: string = '';
  pointFilter: string = '';
  searchText: string = '';

  listOfCriteriaGroup: CriteriaGroup[] = [];
  listOfCriteriaOfAEvaluate: readonly CriteriaOfAEvaluation[] = [];
  listOfCurrentPageData: readonly Criteria[] = [];
  listOfFilteredCriteria: readonly Criteria[] = [];
  listOfCurrentPageCriteriaOfAEvaluate: readonly CriteriaOfAEvaluation[] = [];
  listOfCriteria: readonly Criteria[] = [];
  constructor(
    private service: LinkedService,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private location: Location
  ) {}

  getCriteriaGroupNameById(criteriaGroupId: string): string {
    if (!criteriaGroupId) return 'Unknown Group';
    const group = this.listOfCriteriaGroup.find(
      (group) => group.id === criteriaGroupId
    );
    return group ? group.name : 'Unknown Group';
  }
  applyFilter(): void {
  this.listOfFilteredCriteria = this.listOfCriteria
    .filter((criteria) =>
      this.pointFilter === 'positive'
        ? criteria.points > 0
        : this.pointFilter === 'negative'
        ? criteria.points < 0
        : true
    )
    .filter((criteria) =>
      this.selectedCriteriaGroup
        ? criteria.criteriaGroupId === this.selectedCriteriaGroup
        : true
    )
    .filter((criteria) =>
      this.searchText
        ? criteria.name.toLowerCase().includes(this.searchText.toLowerCase())
        : true
    );

  this.listOfCurrentPageData = this.listOfFilteredCriteria;
}

  onSearchChange(): void {
    this.applyFilter();
  }

  onGroupChange(): void {
    this.applyFilter();
  }

  onPointFilterChange(): void {
    this.applyFilter();
  }

  onBack(): void {
    this.location.back();
  }

  trackByCriteriaId(index: number, item: Criteria): string {
    return item.id;
  }

  trackByCriteriaOfAEvaluationId(index: number, item: CriteriaOfAEvaluation): string {
    return item.id;
  }

  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      },
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 !== 0)
        );
        this.refreshCheckedStatus();
      },
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 === 0)
        );
        this.refreshCheckedStatus();
      },
    },
  ];

  listOfSelectionCriteriaOfAEvaluate = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      },
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCriteriaOfAEvaluate.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 !== 0)
        );
        this.refreshCheckedStatusCriteriaOfAEvaluate();
      },
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCriteriaOfAEvaluate.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 === 0)
        );
        this.refreshCheckedStatusCriteriaOfAEvaluate();
      },
    },
  ];

  reloadListCriteria() {
    this.loading = true;
    this.service.takeListCriteria().subscribe(
      (data) => {
        this.listOfCriteria = data;
        this.applyFilter();
        this.updateDisplayCriteria();
        this.loading = false;
      },
      (error) => {
        console.error('Error loading criteria:', error);
        this.loading = false;
      }
    );
  }

  reloadListCriteriaOfEvaluate() {
    this.loading = true;
    this.service.takeListCriteriaOfEvaluate(this.evaluateId).subscribe(
      (data) => {
        this.listOfCriteriaOfAEvaluate = data;
        this.updateDisplayCriteriaOfAEvaluate();
        this.loading = false;
      },
      (error) => {
        console.error('Error loading criteria of evaluate:', error);
        this.loading = false;
      }
    );
  }

  reloadListCriteriaGroup() {
    this.service.takeListCriteriaGroup().subscribe((data) => {
      this.listOfCriteriaGroup = data;
    });
  }

  updateDisplayCriteria(): void {
    this.listOfCurrentPageData = this.listOfCriteria; // Apply pagination if necessary
    this.refreshCheckedStatus();
  }

  updateDisplayCriteriaOfAEvaluate(): void {
    this.listOfCurrentPageCriteriaOfAEvaluate = this.listOfCriteriaOfAEvaluate; // Apply pagination if necessary
    this.refreshCheckedStatusCriteriaOfAEvaluate();
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

  onItemCriteriaOfAEvaluateChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatusCriteriaOfAEvaluate();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onAllCriteriaOfAEvaluateChecked(value: boolean): void {
    this.listOfCriteriaOfAEvaluate.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatusCriteriaOfAEvaluate();
  }

  getCriteriaNameById(CriteriaId: string): string {
    const Criteria = this.listOfCriteria.find(tg => tg.id === CriteriaId);
    return Criteria ? Criteria.name : 'Unknown Criteria';
  }

  onCurrentPageDataChange($event: readonly CriteriaOfAEvaluation[]): void {
    this.listOfCurrentPageCriteriaOfAEvaluate = $event;
    this.refreshCheckedStatusCriteriaOfAEvaluate();
  }

  onCurrentPageCriteriaChange($event: readonly Criteria[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }

  refreshCheckedStatusCriteriaOfAEvaluate(): void {
    this.checked = this.listOfCurrentPageCriteriaOfAEvaluate.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageCriteriaOfAEvaluate.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }

  openCriteriaOfEvaluate(data: string) {
    const modalRef = this.modal.create({
      nzTitle: 'Thêm Số Lượng',
      nzContent: CriteriaOfEvaluateAddComponent,
      nzFooter: null,
      nzMaskClosable: true,
      nzMask: true,
      nzStyle: { borderRadius: '20px' },
      nzBodyStyle: { borderRadius: '20px' },
    });

    modalRef.componentInstance!.evaluateId = this.evaluateId;
    modalRef.componentInstance!.criteriaId = data;

    modalRef.componentInstance?.formSubmit.subscribe(() => {
      this.reloadListCriteriaOfEvaluate();
      modalRef.close();
    });
  }

  ngOnInit(): void {
    this.evaluateId = this.route.snapshot.paramMap.get('id')!;
    this.reloadListCriteria();
    this.reloadListCriteriaOfEvaluate();
    this.reloadListCriteriaGroup();
  }

  showConfirmDelete(data: CriteriaOfAEvaluation): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa nhóm tiêu chí này?',
      nzContent: `<b>${this.getCriteriaNameById(data.criteriaId)}</b> sẽ bị xóa vĩnh viễn.`,
      nzFooter: null,
      nzMaskClosable: true,
      nzMask: true,
      nzStyle: {
        borderRadius: '20px',
      },
      nzBodyStyle: {
        borderRadius: '20px',
      },
      nzOnOk: () => {
        this.service.deleteCriteriOfAEvaluate(data.id).subscribe(
          () => {
            this.reloadListCriteriaOfEvaluate();
          },
          (error) => {
            console.error('Error deleting criteria of evaluate:', error);
          }
        );
      },
    });
  }
}
