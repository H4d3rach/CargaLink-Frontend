import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-estrellas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estrellas.component.html',
  styleUrl: './estrellas.component.css'
})
export class EstrellasComponent implements OnInit{
  @Input() rating: number = 0;
  starWidth: number = 0;
  
  constructor() { } 
  ngOnInit(): void { 
    this.starWidth = (this.rating / 5) * 100; 
  }
}
