import { Component } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-nz-demo-modal-confirm-promise',
  standalone: true,
  imports: [],
  templateUrl: './nz-demo-modal-confirm-promise.component.html',
  styleUrl: './nz-demo-modal-confirm-promise.component.css'
})
export class NzDemoModalConfirmPromiseComponent {
  confirmModal?: NzModalRef; // For testing by now

    constructor(private modal: NzModalService) {}

    showConfirm(): void {
      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete these items?',
        nzContent: 'When clicked the OK button, this dialog will be closed after 1 second',
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log('Oops errors!'))
      });
    }
}
