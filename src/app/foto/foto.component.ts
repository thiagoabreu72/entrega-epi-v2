import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-foto',
  templateUrl: './foto.component.html',
  styleUrls: ['./foto.component.scss'],
})
export class FotoComponent {
  @Input() foto: string = './assets/avatar.jpeg';
}
