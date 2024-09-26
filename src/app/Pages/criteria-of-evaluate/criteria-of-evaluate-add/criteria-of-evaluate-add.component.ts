import { Component, EventEmitter,Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Criteria {
  id: string;
  name: string;
  points: number;
  criteriaGroupId: string;
}

@Component({
  selector: 'app-criteria-of-evaluate-add',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './criteria-of-evaluate-add.component.html',
  styleUrl: './criteria-of-evaluate-add.component.css'
})
export class CriteriaOfEvaluateAddComponent {
  @Output() formSubmit = new EventEmitter<void>();
  @Input() evaluateId: string = '';
  @Input() criteriaId: string = '';
  quantity: number = 0;
  CriteriaInfo!: Criteria;
  listOfCriterias: Criteria[] = [];
  point: number = 0;

  constructor(private service: LinkedService,private router: Router) { }

  getPointByCriteriaId(criteriaId: string): number {
    const criteria = this.listOfCriterias.find(tg => tg.id === criteriaId);
    return criteria ? criteria.points : 0;
  }

  reloadListCriterias(): void {
    this.service.takeListCriteria().subscribe(data => {
      this.listOfCriterias = data;
      this.point = this.getPointByCriteriaId(this.criteriaId);
    });
  }

  addCriteriaOfAEvaluate() {
    const val = {
      EvaluateId: this.evaluateId,
      CriteriaId: this.criteriaId,
      Quantity: +this.quantity,
      Total: this.quantity * this.point
    };

    this.service.addCriteriaOfEvaluate(val).subscribe(res => {
      if (res) {
        this.router.navigate(['/nguoi-dung/danh-gia', this.evaluateId]);

      }
      this.formSubmit.emit();
    }, error => {
      console.log('Sending Criteria:', val);
      console.error('Error:', error);
      alert('Đã xảy ra lỗi: ' + error.message);
    });
  }

  ngOnInit(): void {
    // Gọi `reloadListCriterias` khi component được khởi tạo
    this.reloadListCriterias();
  }
}
