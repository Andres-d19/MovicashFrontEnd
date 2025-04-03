import { Component, OnInit } from '@angular/core';
import { AdvertenciaService } from '../../services/advertencia.service';

@Component({
  selector: 'app-advertencia',
  templateUrl: './advertencia.component.html',
  styleUrls: ['./advertencia.component.css']
})
export class AdvertenciaComponent implements OnInit {
  title: string = '';
  message: string = '';
  showPopup: boolean = false;

  constructor(private advertenciaService: AdvertenciaService) {}

  ngOnInit() {
    this.advertenciaService.error$.subscribe(error => {
      this.title = error.title;
      this.message = error.message;
      this.showPopup = true;
    });
  }

  onClose() {
    this.showPopup = false;
  }
}
