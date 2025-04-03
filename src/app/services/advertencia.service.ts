import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvertenciaService {
  private errorSubject = new Subject<{ title: string; message: string }>();
  error$ = this.errorSubject.asObservable();

  mostrarError(title: string, message: string) {
    this.errorSubject.next({ title, message });
  }
}
