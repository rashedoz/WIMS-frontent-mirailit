import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import 'rxjs/add/observable/of';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';
// import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUserDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {
    // this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    if (Cookie.check('.WIMS.Admin.Cookie'))
      this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(Cookie.get('.WIMS.Admin.Cookie')));
  }

  public get currentUserValue(): any {
    return Cookie.check('.WIMS.Admin.Cookie') ? this.currentUserDetails.value : null;
  }

  public isAuthenticated(): boolean {
    return Cookie.check('.WIMS.Admin.Cookie');
  }


  login(param) {
     var data = {email: param.UserName,password:param.Password};
    // var data = "email=" + param.UserName + "&password=" + encodeURIComponent(param.Password)  + "&grant_type=password";
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post<any>(environment.baseUrl + 'auth/jwt/create', data)
      .pipe(map(res => {

        const user = {

          email: param.UserName,
          // FirstName: res.FirstName,
          // LastName: res.LastName,
          // UserName: res.UserName,
          // FullName: res.FirstName+ ' '+res.LastName,
          // role:"Admin",
          // Roles: res.Roles? JSON.parse(res.Roles) : [],
          // UserType: res.UserType,
          access_token: res.access,
        }
        let expireDate = new Date(res[".expires"]);
        Cookie.set('.WIMS.Admin.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
        this.currentUserDetails.next(user);
        return true;
      }),
        catchError(err => {
          console.log(err);
          return of(null);
        }));
  }




  logout(hostname) {
    Cookie.delete('.WIMS.Admin.Cookie', '/', hostname);
    this.currentUserDetails.next(null);
}



  // login(url, param) {

  //   var data = "username=" + param.UserName + "&password=" + encodeURIComponent(param.Password) + "&usertype=Admin&grant_type=password";
  //   var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
  //   return this.http.post<any>(environment.baseUrl + '/token', data, { headers: reqHeader })
  //     .pipe(map(data => {

  //       const user = {
  //         Id: data.Id,
  //         Email: data.Email,
  //         FirstName: data.FirstName,
  //         LastName: data.LastName,
  //         UserName: data.UserName,
  //         access_token: data.access_token,
  //       }
  //       let expireDate = new Date(data[".expires"]);
  //       Cookie.set('.WIMS.Admin.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
  //       this.currentUserDetails.next(user);
  //       return true;
  //     }),
  //       catchError(err => {
  //         console.log(err);
  //         return of(null);
  //       }));
  // }


  // logout() {

  //   return this.http.post<any>(environment.apiUrl + 'Account/Logout', null).pipe(
  //     map(res => {
  //       return res;
  //     })
  //   );
  // }

  registerSystemAdmin(url, params) {
    return this.http.post<any>(environment.baseUrl + url, params).pipe(
      map(res => {
        return res;
      })
    );
  }

}
