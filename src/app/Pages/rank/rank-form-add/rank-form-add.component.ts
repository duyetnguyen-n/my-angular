import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rank-form-add',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './rank-form-add.component.html',
  styleUrl: './rank-form-add.component.css'
})
export class RankFormAddComponent {
  @Output() formSubmit = new EventEmitter<void>();
  rank_name: string = '';
  point_range_start: number = 0;
  point_range_end: number = 0;

  constructor(private service: LinkedService) {}

  addRank() {
    if (this.rank_name && this.point_range_start && this.point_range_end) {
      const val = {
        Name: this.rank_name,
        PointRangeStart: this.point_range_start,
        PointRangeEnd: this.point_range_end
      };
      this.service.addRank(val).subscribe(res => {
        if (res) {
          alert(res.message);
        }
        this.formSubmit.emit();
      }, error => {
        console.error('Error:', error); 
        alert('Đã xảy ra lỗi: ' + error.message);
      });

    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
}
