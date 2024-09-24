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
  @Input() user: any = ''; // Nhận dữ liệu user

  constructor(private service: LinkedService, private http: HttpClient) {}

  ngOnInit(): void {
    this.reloadListTeachGroup(); // Tải danh sách nhóm giảng dạy
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.user.avatar = file;
      this.user.avatarURL = URL.createObjectURL(file);
    }
  }

  editUser() {
    // Kiểm tra thông tin người dùng

      const val = {
        id: this.user.id,
        name: this.user.name,
        point: this.user.point,
        numberPhone: this.user.numberPhone,
        password: this.user.password, // nếu bạn muốn sửa đổi password
        position: this.user.position,
        age: this.user.age,
        mail: this.user.mail,
        gender: this.user.gender,
        teachGroupId: this.user.teachGroupId,
        avatar: this.user.avatar
      };
      this.service.updateUser(val).subscribe(res => {
        if (res) {
          alert(res.message);
        }
        this.formSubmit.emit(); // Gửi tín hiệu về formSubmit
      }, error => {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi: ' + error.message);
      });
    
  }

  reloadListTeachGroup() {
    this.service.takeListTeachGroups().subscribe(data => {
      console.log('Teach Group Data:', data);
      this.listOfTeachGroup = Array.isArray(data) ? data : []; // Đảm bảo là mảng
    });
  }
}
