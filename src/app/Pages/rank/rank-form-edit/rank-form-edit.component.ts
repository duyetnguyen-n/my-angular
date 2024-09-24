import { Component, EventEmitter,Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rank-form-edit',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './rank-form-edit.component.html',
  styleUrl: './rank-form-edit.component.css'
})
export class RankFormEditComponent {
  @Output() formSubmit = new EventEmitter<void>();
  @Input() Rank_id: string = '';
  @Input() Rank_name: string = '';
  @Input() pointRangeStart: number | null = null;  // Sửa kiểu dữ liệu thành number hoặc null
  @Input() pointRangeEnd: number | null = null;

  constructor(private service: LinkedService) {}

  editRank() {
    const start = Number(this.pointRangeStart);
    const end = Number(this.pointRangeEnd);
    if (this.Rank_name && !isNaN(start) && !isNaN(end))  {
      const val = {
        Id: this.Rank_id,
        Name: this.Rank_name,
        PointRangeStart: start,
        PointRangeEnd: end,
      };
      this.service.updateRank(val).subscribe(res => {
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
