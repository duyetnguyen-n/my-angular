import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LinkedService } from './linked.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MainComponent,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',


})
export class AppComponent {
  title = 'my-angular';
}
