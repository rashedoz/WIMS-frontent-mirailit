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

        // const user = {

        //   email: param.UserName,
        //   // FirstName: res.FirstName,
        //   // LastName: res.LastName,
        //   // UserName: res.UserName,
        //   // FullName: res.FirstName+ ' '+res.LastName,
        //   // role:"Admin",
        //   // Roles: res.Roles? JSON.parse(res.Roles) : [],
        //   // UserType: res.UserType,
        //   access_token: res.access,
        // }
        // let expireDate = new Date(res[".expires"]);
        // Cookie.set('.WIMS.Admin.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
        // this.currentUserDetails.next(user);
        return res;
      }),
        catchError(err => {
          console.log(err);
          return of(null);
        }));
  }


  verifyToken(token) {
 
    var reqHeader = new HttpHeaders({ 'Authorization': 'Bearer '+token});
    return this.http.get<any>(environment.baseUrl +'auth/users/me',{ headers: reqHeader })  .pipe(map(data => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      // let expireDate = new Date(data[".expires"]);
     
      //  let userData = data.result.user;
      let Roles = [];        
      if(data.is_superuser){
        Roles.push("is_superuser");
      }
      if(data.is_staff){
        Roles.push("is_staff");
      } 
      if(data.is_customer){
        Roles.push("is_customer");
      }
      if(data.is_retailer){
        Roles.push("is_retailer");
      }
      if(data.is_wholesaler){
        Roles.push("is_wholesaler");
      }
     // console.log(Roles);
        const user = {
          id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          full_name: data.first_name+ ' '+ data.last_name,  
          image: data.image,
          is_active: data.is_active,
          is_customer: data.is_customer,
          is_retailer: data.is_retailer,
          is_staff: data.is_staff,
          is_superuser: data.is_superuser,
          is_wholesaler: data.is_wholesaler,  
          customer_code: data.customer_code, 
          member_code: data.member_code,
          mobile:data.mobile,
          balance:data.balance,
          acc_number: data.acc_number,
          address_one: data.address_one,
          address_two: data.address_two,
          nid: data.nid,
          occupation: data.occupation,
          preferred_payment_method: data.preferred_payment_method,
          telephone: data.telephone,
          gender: data.gender,
          Roles: Roles,
          access_token: token,
        }
        let expireDate = new Date(data[".expires"]);
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
