import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuard } from './_helpers/auth.guard';

export const AppRoutes: Routes = [

  { path: '', component: AdminLayoutComponent, loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./authentication/login-system-admin/login-system-admin.module').then(m => m.LoginSystemAdminModule),
      },
      {
        path: 'admin/register',
        loadChildren: () => import('./authentication/register-system-admin/register-system-admin.module')
          .then(m => m.RegisterSystemAdminModule),
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
         canActivate: [AuthGuard]
      },
      {
        path: 'change-password',
        loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'user-list',
        loadChildren: () => import('./user-list/user-list.module').then(m => m.UserListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'product-type',
        loadChildren: () => import('./product-type/product-type.module').then(m => m.ProductTypeModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'purchase-entry',
        loadChildren: () => import('./purchase-entry/purchase-entry.module').then(m => m.PurchaseEntryModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'all-sim-list',
        loadChildren: () => import('./all-sim-list/all-sim-list.module').then(m => m.AllSIMListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'updatable-sim-list',
        loadChildren: () => import('./updatable-sim-list/updatable-sim-list.module').then(m => m.UpdatableSIMListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'cancelled-sim-list',
        loadChildren: () => import('./cancelled-sim-list/cancelled-sim-list.module').then(m => m.CancelledSIMListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'data-plan-list',
        loadChildren: () => import('./data-plan/data-plan.module').then(m => m.DataPlanModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'create-subscription',
        loadChildren: () => import('./create-subscription/create-subscription.module').then(m => m.CreateSubscriptionModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'subscription-list',
        loadChildren: () => import('./subscription-list/subscription-list.module').then(m => m.SubscriptionListModule),
        // canActivate: [AuthGuard]
      },
      // {
      //   path: 'building',
      //   loadChildren: () => import('./building/building.module').then(m => m.BuildingModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'floor',
      //   loadChildren: () => import('./floor/floor.module').then(m => m.FloorModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'facilities',
      //   loadChildren: () => import('./facilities/facilities.module').then(m => m.FacilitiesModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'room',
      //   loadChildren: () => import('./room/room.module').then(m => m.RoomModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'requisition',
      //   loadChildren: () => import('./requisition/requisition.module').then(m => m.RequisitionModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'booking',
      //   loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'booking/:requisition_id',
      //   loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'booking-list',
      //   loadChildren: () => import('./booking-list/booking-list.module').then(m => m.BookingListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'allocation',
      //   loadChildren: () => import('./allocation/allocation.module').then(m => m.AllocationModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'allocation-list',
      //   loadChildren: () => import('./allocation-list/allocation-list.module').then(m => m.AllocationListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'check-inout',
      //   loadChildren: () => import('./check-inout/check-inout.module').then(m => m.CheckInoutModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'payment',
      //   loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'allocation/:booking_id',
      //   loadChildren: () => import('./allocation/allocation.module').then(m => m.AllocationModule),
      //   // canActivate: [AuthGuard]
      // },
    ]
  }, {
    path: '**',
    redirectTo: '/'
  }
];
