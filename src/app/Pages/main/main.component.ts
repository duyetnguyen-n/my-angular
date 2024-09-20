import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../layouts/sidebar/sidebar.component';
import { NavbarComponent } from '../../layouts/navbar/navbar.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, MainComponent, FormsModule],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent {

}
