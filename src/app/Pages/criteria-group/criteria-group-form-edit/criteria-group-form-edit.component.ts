import { Component, EventEmitter,Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-criteria-group-form-edit',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './criteria-group-form-edit.component.html',
  styleUrls: ['./criteria-group-form-edit.component.css'],
})
export class CriteriaGroupFormEditComponent {

  @Output() formSubmit = new EventEmitter<void>();
  @Input() criteriaGroup_id: string = '';
  @Input() criteriaGroup_name: string = '';
  @Input() criteriaGroup_role: string = '';

  constructor(private service: LinkedService) {}

  editCriteriaGroup() {
    if (this.criteriaGroup_name && this.criteriaGroup_role) {
      const val = {
        Id: this.criteriaGroup_id,
        Name: this.criteriaGroup_name,
        Role: this.criteriaGroup_role,
      };
      this.service.updateCriteriaGroup(val).subscribe(res => {
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
