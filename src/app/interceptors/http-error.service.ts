import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Agregar estilos personalizados al documento
          const style = document.createElement("style");
          style.innerHTML = `
            .custom-swal {
              position: relative;
              border-radius: 10px;
              overflow: hidden;
            }
            .swal-logo {
              position: absolute;
              top: 15px;
              left: 15px;
              z-index: 10;
            }
            .swal-title {
              margin-top: 15px;
              font-size: 24px;
              font-weight: bold;
              color: #333;
              letter-spacing: 1px;
            }
            .swal-text {
              font-size: 16px;
              margin: 10px 0 25px;
              color: #555;
            }
            .swal2-actions {
              margin-top: 0 !important;
              gap: 15px;
            }
            .swal2-confirm, .swal2-cancel {
              padding: 12px 24px !important;
              font-size: 15px !important;
              font-weight: 500 !important;
              border-radius: 4px !important;
              background-color: #164474 !important; 
              border-color: #164474 !important;
              color: white !important;
              min-width: 120px !important;
            }
          `;
          document.head.appendChild(style);

          Swal.fire({
            html: `<div class="swal-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                      <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                      <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                      <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                      <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
                    </svg>
                  </div>
                  <h2 class="swal-title">TIEMPO FUERA</h2>
                  <p class="swal-text">Parece que tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar.</p>`,
            icon: "info",
            customClass: {
              popup: "custom-swal",
              confirmButton: "custom-confirm-button",
              
            },
            showConfirmButton: true,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/pantalla-login';  
            }
          });
        }
        throw error;
      })
    );
  }
}
