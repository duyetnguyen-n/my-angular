import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTableFilterFn, NzTableModule, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
interface CriteriaGroup {
  id: string;
  name: string;
  count: number;
  role: string;
}

interface Rank {
  id: string;
  name: string;
  pointRangeStart: number;
  pointRangeEnd: number;
}

interface Criteria {
  id: string;
  name: string;
  points: number;
  notes: string;
  personCheck: string;
  criteriaGroupId: string;
}

interface User {
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
  selector: 'app-a',
  standalone: true,
  imports: [NzTableModule, CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './a.component.html',
  styleUrls: ['./a.component.css']
})
export class AComponent implements OnInit {
  @ViewChild(FullscreenFormComponent) fullScreenForm!: FullscreenFormComponent;
  listOfCriteriaGroup: CriteriaGroup[] = [];
  listOfRank: Rank[] = [];
  listOfCriteria: Criteria[] = [];
  listOfUsers: User[] = [];

  criteriaGroup_name: string = '';
  criteriaGroup_role: string = '';

  rank_name: string = '';
  point_range_start: number = 0;
  point_range_end: number = 0;

  criteria_name: string = '';
  criteria_points: number = 0;
  criteria_notes: string = '';
  criteria_PersonCheck: number = 1;
  criteria_group: number = 1;

  getUserNameById(userId: string): string {
    const user = this.listOfUsers.find(user => user.id === userId);
    return user ? user.name : 'Unknown User';
  }

  getCriteriaGroupNameById(criteriaGroupId: string): string {
    const group = this.listOfCriteriaGroup.find(group => group.id === criteriaGroupId);
    return group ? group.name : 'Unknown Group';
  }

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

  constructor(private service: LinkedService) { }



  isRankFormVisible: boolean = false;
  isCriteriaFormVisible: boolean = false;
  isCriteriaGroupFormVisible: boolean = false;
  isCriteriaGroupEditFormVisible: boolean = false;

  toggleForm(formType: string) {
     if (this.fullScreenForm) {
    this.fullScreenForm.hideForm();
  }
    this.isRankFormVisible = false;
    this.isCriteriaFormVisible = false;
    this.isCriteriaGroupFormVisible = false;
    this.isCriteriaGroupEditFormVisible = false;

  if (formType === 'rank') {
    this.isRankFormVisible = true;
    this.fullScreenForm.showForm();
  } else if (formType === 'criteria') {
    this.isCriteriaFormVisible = true;
    this.fullScreenForm.showForm();
  } else if (formType === 'criteriaGroup') {
    this.isCriteriaGroupFormVisible = true;
    this.fullScreenForm.showForm();
  } else if (formType === 'updateCriteriaGroup') {
    this.isCriteriaGroupEditFormVisible = true;
    this.fullScreenForm.showForm();
  }
}


  reloadListCriteriaGroup() {
    this.service.takeListCriteriaGroup().subscribe(data => {
      this.listOfCriteriaGroup = data;
    });
  }


  addCriteriaGroup() {
    console.log('Selected role:', this.criteriaGroup_role);
     var val = {
        Name:this.criteriaGroup_name,
        Role:this.criteriaGroup_role
    };
    this.service.addCriteriaGroup(val).subscribe(res => {
      alert(res.toString());
    })
    this.resetCriteriaGroupForm();
  }
  updateCriteriaGroup() {
    
  }

  reloadListRank() {
    this.service.takeListRank().subscribe(data => {
      this.listOfRank = data;
    });
  }

  addRank() {
    const newRank = {
      name: this.rank_name,
      pointRangeStart: this.point_range_start,
      pointRangeEnd: this.point_range_end
    };
    this.service.addRank(newRank).subscribe(res => {
      alert(res.toString());
    })
    this.resetRankForm();
  }

  reloadListCriteria() {
    this.service.takeListCriteria().subscribe(data => {
      this.listOfCriteria = data;
    });
  }

  addCriteria() {
    const newCriteria = {
      name: this.criteria_name,
      points: this.criteria_points,
      notes: this.criteria_notes,
      personCheck: this.criteria_PersonCheck,
      criteriaGroupId: this.criteria_group
    };
    this.service.addCriteria(newCriteria).subscribe(res => {
      alert(res.toString());
    })
    this.resetCriteriaForm();
  }


  reloadListUsers() {
    this.service.takeUser().subscribe(data => {
      this.listOfUsers = data;
    });
  }
  resetCriteriaGroupForm() {
    this.criteriaGroup_name = '';
    this.criteriaGroup_role = '';
  }

  resetRankForm() {
    this.rank_name = '';
    this.point_range_start = 0;
    this.point_range_end = 0;
  }

  resetCriteriaForm() {
    this.criteria_name = '';
    this.criteria_points = 0;
    this.criteria_notes = '';
    this.criteria_PersonCheck = 1;
    this.criteria_group = 1;
  }

  ngOnInit(): void {
    this.reloadListCriteriaGroup();
    this.reloadListRank();
    this.reloadListCriteria();
    this.reloadListUsers();
  }
}
