import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reg-semirremolque',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reg-semirremolque.component.html',
  styleUrl: './reg-semirremolque.component.css'
})
export class RegSemirremolqueComponent {
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
