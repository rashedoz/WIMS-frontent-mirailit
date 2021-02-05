import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthorizationService {

    permissions: Array<string>; // Store the actions for which this user has permission

    constructor(private authenticationService: AuthenticationService) {
        // if (this.authenticationService.currentUserDetails.value)
        //     this.permissions = this.authenticationService.currentUserDetails.value.role;
        // console.log(this.permissions);
    }

    hasPermission(role: string) {
        if (!role) return true;
        const roles = role.split(',');
        if (this.authenticationService.currentUserDetails.value && this.authenticationService.currentUserDetails.value.Roles.find(permission => {
            return roles.indexOf(permission) !== -1;
        })) {
            return true;
        }
        return false;
    }
}