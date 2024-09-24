import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fullscreenform',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './fullscreenform.component.html',
  styleUrls: ['./fullscreenform.component.css'],

})
export class FullscreenFormComponent {
  @Output() formSubmit = new EventEmitter<any>();

  onSubmit(formValue: any) {
    this.formSubmit.emit(formValue);
  }
}
