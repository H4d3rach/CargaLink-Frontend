import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-semirremolque',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-semirremolque.component.html',
  styleUrl: './gestion-semirremolque.component.css'
})
export class GestionSemirremolqueComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
