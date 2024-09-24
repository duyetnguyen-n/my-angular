import { Component, EventEmitter,Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-teach-group-form-edit',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './teach-group-form-edit.component.html',
  styleUrls: ['./teach-group-form-edit.component.css'],
})
export class TeachGroupFormEditComponent {

  @Output() formSubmit = new EventEmitter<void>();
  @Input() TeachGroup_id: string = '';
  @Input() TeachGroup_name: string = '';

  constructor(private service: LinkedService) {}

  editTeachGroup() {

      const val = {
        Id: this.TeachGroup_id,
        Name: this.TeachGroup_name,
      };
      this.service.updateTeachGroup(val).subscribe(res => {
        if (res) {
          alert(res.message);
        }
        this.formSubmit.emit();
      }, error => {
        console.error('Error:', error); // In ra thông tin lỗi chi tiết
        alert('Đã xảy ra lỗi: ' + error.message);
      });


  }
}
