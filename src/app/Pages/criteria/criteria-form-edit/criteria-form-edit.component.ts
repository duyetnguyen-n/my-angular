import { Component, EventEmitter,Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
interface CriteriaGroup {
  id: string;
  name: string;
}
interface User {
  id: string;
  name: string;
}
@Component({
  selector: 'app-criteria-form-edit',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './criteria-form-edit.component.html',
  styleUrl: './criteria-form-edit.component.css'
})
export class CriteriaFormEditComponent implements OnInit {
  listOfCriteriaGroup: CriteriaGroup[] = [];
  listOfUsers: User[] = [];
  @Output() formSubmit = new EventEmitter<void>();
  @Input() criteria_id: string = '';
  @Input() criteria_name: string = '';
  @Input() criteria_points: number | null = null;
  @Input() criteria_notes: string = '';
  @Input() criteria_PersonCheck: string = '';
  @Input() criteria_group: string = '';

  constructor(private service: LinkedService) {}

  editCriteria() {
    if (this.criteria_name && this.criteria_notes && this.criteria_PersonCheck && this.criteria_group) {
      const val = {
        Id: this.criteria_id,
        Name: this.criteria_name,
        Points: this.criteria_points,
        Notes: this.criteria_notes,
        PersonCheck: this.criteria_PersonCheck,
        CriteriaGroupId: this.criteria_group,
      };
      this.service.updateCriteria (val).subscribe(res => {
        if (res) {
          alert(res.message);
        }
        this.formSubmit.emit();
      }, error => {
        console.error('Error:', error); // In ra thông tin lỗi chi tiết
        alert('Đã xảy ra lỗi: ' + error.message);
      });

    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
  reloadListCriteriaGroup() {
  this.service.takeListCriteriaGroup().subscribe(data => {
    console.log('Criteria Group Data:', data);
    this.listOfCriteriaGroup = Array.isArray(data) ? data : []; // Đảm bảo là mảng
  });
}

  reloadListUsers() {
    this.service.takeListUser().subscribe(data => {
      this.listOfUsers = data;
    });
  }
  ngOnInit(): void {
    this.reloadListCriteriaGroup();
    this.reloadListUsers();
  }
}
