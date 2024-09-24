import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  selector: 'app-user-form-add',
  standalone: true,
  imports: [CommonModule, FullscreenFormComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './user-form-add.component.html',
  styleUrls: ['./user-form-add.component.css']
})
export class UserFormAddComponent implements OnInit {
  listOfTeachGroups: TeachGroup[] = [];
  @Output() formSubmit = new EventEmitter<void>();

  user_name: string = 'admin';
  user_numberPhone: string = '111111111';
  user_password: string = '123';
  user_position: string = 'Admin';
  user_mail: string = 'duyet@gmail.com';
  user_age: number = 0;
  user_point: number = 0;
  user_gender: string = 'Nam';
  user_teachGroupId: string = '';
  user_avatar: File | null = null; 
  user_avatarURL: string | null = null;


  constructor(private service: LinkedService, private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.user_avatar = file;
      this.user_avatarURL = URL.createObjectURL(file);
    }
  }

  addUser() {
    if (this.user_name && this.user_numberPhone && this.user_position && this.user_mail) {
      const formData = new FormData();
      formData.append('name', this.user_name);
      formData.append('numberPhone', this.user_numberPhone);
      formData.append('position', this.user_position);
      formData.append('password', this.user_password);
      formData.append('mail', this.user_mail);
      formData.append('age', this.user_age.toString());
      formData.append('point', this.user_point.toString());
      formData.append('gender', this.user_gender);
      formData.append('teachGroupId', this.user_teachGroupId);

      if (this.user_avatar) {
        formData.append('avatar', this.user_avatar); // Thêm file avatar vào formData
      }

      console.log('Form data being sent:', formData); // Log để kiểm tra dữ liệu trước khi gửi

      this.service.addUser(formData).subscribe(
        (res) => {
          if (res) {
            alert(res.message);
          }
          this.formSubmit.emit();
        },
        (error) => {
          console.error('Error:', error);
          alert('Đã xảy ra lỗi: ' + error.message);
        }
      );
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }

  reloadListTeachGroups() {
    this.service.takeListTeachGroups().subscribe((data) => {
      console.log('Teach Group Data:', data);
      this.listOfTeachGroups = Array.isArray(data) ? data : [];
    });
  }

  ngOnInit(): void {
    this.reloadListTeachGroups();
  }
}
