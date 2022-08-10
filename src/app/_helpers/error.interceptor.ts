import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, public toastr : ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
           const errorMsg =  err.error.detail || err.error.Message || err.error.error_description || err.error || err.statusText;

           //this.toastr.error(errorMsg, 'Error!', { timeOut: 3000 });


            if(err.status === 400) {
              // if(errorMsg.IsReport == "Warning"){
              //   this.toastr.error(errorMsg.Msg, 'Error!', { timeOut: 3000 });
              // }
              // if(errorMsg.IsReport == "Error"){
              //   this.toastr.error(errorMsg.Msg, 'Error!', { timeOut: 3000 });
              // }

            }else {
              this.toastr.error(errorMsg, 'Error!', { timeOut: 3000 });
            }
            // if (err.status === 401) {
            //     // auto logout if 401 response returned from api
            //   // this.authenticationService.logout();
            //  //   location.reload(true);
            // }

            return throwError(errorMsg);
        }))
    }
}
