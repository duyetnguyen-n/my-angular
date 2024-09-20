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
  isVisible: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();

  showForm() {
    this.isVisible = true;
  }

  hideForm() {
    this.isVisible = false;
  }

  onSubmit(formValue: any) {
    this.formSubmit.emit(formValue);
    this.hideForm();
  }
}
