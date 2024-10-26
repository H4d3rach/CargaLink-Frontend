import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-trans-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trans-home.component.html',
  styleUrl: './trans-home.component.css'
})
export class TransHomeComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isInTravel: boolean = true;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
