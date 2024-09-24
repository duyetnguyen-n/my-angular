import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-teach-group-form-add',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './teach-group-form-add.component.html',
  styleUrls: ['./teach-group-form-add.component.css'],
})
export class TeachGroupFormAddComponent {

  @Output() formSubmit = new EventEmitter<void>();
  TeachGroup_name: string = '';

  constructor(private service: LinkedService) {}

  addTeachGroup() {
    if (this.TeachGroup_name) {
      const val = {
        Name: this.TeachGroup_name,
      };
      this.service.addTeachGroup(val).subscribe(res => {
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
