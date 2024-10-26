import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
@Component({
  selector: 'app-see-work-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './see-work-details.component.html',
  styleUrl: './see-work-details.component.css'
})
export class SeeWorkDetailsComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
