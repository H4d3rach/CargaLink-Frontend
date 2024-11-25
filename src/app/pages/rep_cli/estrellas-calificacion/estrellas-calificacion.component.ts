import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-estrellas-calificacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estrellas-calificacion.component.html',
  styleUrl: './estrellas-calificacion.component.css'
})
export class EstrellasCalificacionComponent implements OnInit{
  
  @Input() label: string = 'Aspect';
  @Output() cambioRating: EventEmitter<number> =  new EventEmitter<number>();
  stars = [1, 2, 3, 4, 5]; 
  currentRating = 0; 
  hoverRatingValue = 0; 
  ngOnInit(): void {
    console.log(this.label);
  }
  hoverRating(rating: number): void {
    this.hoverRatingValue = rating;
  }

  setRating(rating: number): void {
    this.currentRating = rating;
    this.hoverRatingValue = 0; 
    this.cambioRating.emit(this.currentRating);
  }

  resetRating(): void {
    this.hoverRatingValue = 0;
  }


}
