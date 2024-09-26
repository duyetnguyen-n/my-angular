import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenFormComponent } from '../../../Shared/fullscreenform/fullscreenform.component';
import { LinkedService } from '../../../linked.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface TeachGroup {
  id: string;
  name: string;
}

@Component({
  selector: 'app-user-form-edit',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './user-form-edit.component.html',
  styleUrls: ['./user-form-edit.component.css']
})
export class UserFormEditComponent implements OnInit {
  listOfTeachGroup: TeachGroup[] = [];
  @Output() formSubmit = new EventEmitter<void>();
  @Input() userForm: any = '';
  selectedFile: File | null = null;

  constructor(private service: LinkedService, private http: HttpClient) {}

  ngOnInit(): void {
    this.reloadListTeachGroup();
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.userForm.avatarURL = URL.createObjectURL(file);
    }
  }

  editUser() {
  const formData = new FormData();
  formData.append('id', this.userForm.id);
  formData.append('name', this.userForm.name);
  formData.append('point', this.userForm.point.toString());
  formData.append('numberPhone', this.userForm.numberPhone);
  formData.append('password', this.userForm.password);
  formData.append('age', this.userForm.age.toString());
  formData.append('gender', this.userForm.gender);
  formData.append('mail', this.userForm.mail);
  formData.append('position', this.userForm.position);
  formData.append('teachGroupId', this.userForm.teachGroupId);

  if (this.selectedFile) {
    formData.append('avatar', this.selectedFile);
  } else {
    formData.append('avatar', this.userForm.avatar);
  }

  this.service.updateUser(formData).subscribe(res => {
    if (res) {
      alert(res.message);
    }
    console.log("a:" + formData);
    this.formSubmit.emit();
  }, error => {
    console.error('Error:', error);
    if (error.status === 400) {
      console.error('Validation errors:', error.error.errors);
    }
    alert('Đã xảy ra lỗi: ' + error.message);

  });
}

  reloadListTeachGroup() {
    this.service.takeListTeachGroups().subscribe(data => {
      console.log('Teach Group Data:', data);
      this.listOfTeachGroup = Array.isArray(data) ? data : [];
    });
  }
}
