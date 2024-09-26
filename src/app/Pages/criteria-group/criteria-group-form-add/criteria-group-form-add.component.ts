import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-criteria-group-form-add',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './criteria-group-form-add.component.html',
  styleUrls: ['./criteria-group-form-add.component.css'],
})
export class CriteriaGroupFormAddComponent {

  @Output() formSubmit = new EventEmitter<void>();
  criteriaGroup_name: string = '';
  criteriaGroup_role: string = '';

  constructor(private service: LinkedService) {}

  addCriteriaGroup() {
    if (this.criteriaGroup_name && this.criteriaGroup_role) {
      const val = {
        Name: this.criteriaGroup_name,
        Role: this.criteriaGroup_role,
      };
      this.service.addCriteriaGroup(val).subscribe(res => {
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
}
