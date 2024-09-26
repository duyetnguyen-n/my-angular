import { Component, EventEmitter, OnInit,Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Rank {
  id: string;
  name: string;
}

@Component({
  selector: 'app-evaluate-form-add',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './evaluate-form-add.component.html',
  styleUrl: './evaluate-form-add.component.css'
})
export class EvaluateFormAddComponent {
  listOfRanks: Rank[] = [];
  @Output() formSubmit = new EventEmitter<void>();
  @Output() formSubmitAdd = new EventEmitter<string>(); // Truyền evaluateId

  @Input() userId: string = '';
  evaluate_id: string = '';

  evaluate_name: string = '';
  evaluate_userId: string = '';
  evaluate_rankId: string = '';
  evaluate_stt: number = 0;
  evaluate_totalPointSubstraction: number = 0;
  evaluate_totalPointAddition: number = 0;
  evaluate_totalPoint: number = 0;
  evaluate_from: string = '';
evaluate_to: string = '';


  constructor(private service: LinkedService,private router: Router) { }

  onEvaluateChange() {
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
  if (this.evaluate_name === 'Đánh giá học kì 1') {
    this.evaluate_from = new Date(currentYear, 4, 20).toISOString().split('T')[0]; // 20/5
    this.evaluate_to = new Date(currentYear, 11, 15).toISOString().split('T')[0]; // 15/12
  } else if (this.evaluate_name === 'Đánh giá học kì 2') {
    this.evaluate_from = new Date(currentYear, 11, 16).toISOString().split('T')[0]; // 16/12
    this.evaluate_to = new Date(currentYear + 1, 4, 19).toISOString().split('T')[0]; // 19/5
  }
}

  addevaluate() {
    if (this.evaluate_name && this.evaluate_from && this.evaluate_to) {
      const val = {
        Name: this.evaluate_name,
        UserId: this.userId,
        RankId: this.evaluate_rankId,
        Stt: this.evaluate_stt,
        TotalPointAddition: this.evaluate_totalPointAddition,
        TotalPointSubstraction: this.evaluate_totalPointSubstraction,
        TotalPoint: this.evaluate_totalPoint,
        From: this.evaluate_from,
        To: this.evaluate_to,
      };
      console.log('Form data being sent:', val); // Kiểm tra dữ liệu được gửi đi

      this.service.addEvaluate(val).subscribe(res => {
        if (res) {
          alert(res.message);
        }
        const evaluateId = res.data.id;
        this.formSubmitAdd.emit(evaluateId);
      }, error => {

        console.error('Error:', error); // In ra thông tin lỗi chi tiết
        alert('Đã xảy ra lỗi: ' + error.message);
      });

    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }


  reloadListRank() {
    this.service.takeListUser().subscribe(data => {
      this.listOfRanks = data;
    });
  }

  ngOnInit(): void {
    this.reloadListRank();
  }
}
