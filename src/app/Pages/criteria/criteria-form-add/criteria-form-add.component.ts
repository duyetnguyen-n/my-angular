import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  position: string;
}
@Component({
  selector: 'app-criteria-form-add',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './criteria-form-add.component.html',
  styleUrl: './criteria-form-add.component.css'
})
export class CriteriaFormAddComponent implements OnInit {
  listOfCriteriaGroup: CriteriaGroup[] = [];
  listOfUsers: User[] = [];
  @Output() formSubmit = new EventEmitter<void>();
  criteria_name: string = '';
  criteria_points: number = 0;
  criteria_notes: string = '';
  criteria_PersonCheck: string = '';
  criteria_group: string = '';

  constructor(private service: LinkedService) { }

  addCriteria() {
    if (this.criteria_name && this.criteria_notes && this.criteria_PersonCheck && this.criteria_group) {
      const val = {
        Name: this.criteria_name,
        Points: this.criteria_points,
        Notes: this.criteria_notes,
        PersonCheck: this.criteria_PersonCheck,
        CriteriaGroupId: this.criteria_group,
      };
      console.log('Form data being sent:', val); // Kiểm tra dữ liệu được gửi đi

      this.service.addCriteria(val).subscribe(res => {
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
