import { Component } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public utils: UtilsService){}
    ngOnInit() {
    }
 
}
