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
        path: 'all-device-list',
        loadChildren: () => import('./all-device-list/all-device-list.module').then(m => m.AllDeviceListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'updatable-sim-list',
        loadChildren: () => import('./updatable-sim-list/updatable-sim-list.module').then(m => m.UpdatableSIMListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'updatable-device-list',
        loadChildren: () => import('./updatable-device-list/updatable-device-list.module').then(m => m.UpdatableDeviceListModule),
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
        path: 'subscription',
        loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'create-subscription',
        loadChildren: () => import('./create-subscription/create-subscription.module').then(m => m.CreateSubscriptionModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'add-product-to-subscription',
        loadChildren: () => import('./add-product-subscription/add-product-subscription.module').then(m => m.AddProductSubscriptionModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'remove-product-from-current-month',
        loadChildren: () => import('./remove-product-current-month/remove-product-subscription.module').then(m => m.RemoveProductSubscriptionModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'remove-product-from-next-month',
        loadChildren: () => import('./remove-product-next-month/remove-product-next-month.module').then(m => m.RemoveProductNextMonthModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'cancel-entrie-subscription-from-current-month',
        loadChildren: () => import('./cancel-entire-sub-current-month/cancel-entire-sub-current-month.module').then(m => m.CancelEntireSubCurrentMonthModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'cancel-entrie-subscription-from-next-month',
        loadChildren: () => import('./cancel-entire-sub-next-month/cancel-entire-sub-next-month.module').then(m => m.CancelEntireSubNextMonthModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'subscription-list',
        loadChildren: () => import('./subscription-list/subscription-list.module').then(m => m.SubscriptionListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'wholesaler-subscription-list',
        loadChildren: () => import('./wholesaler-subscription-list/wholesaler-subscription-list.module').then(m => m.WholesalerSubscriptionListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'retailer-subscription-list',
        loadChildren: () => import('./retailer-subscription-list/retailer-subscription-list.module').then(m => m.RetailerSubscriptionListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'change-current-month-subscription',
        loadChildren: () => import('./change-current-month-sub/change-current-month-sub.module').then(m => m.ChangeCurrentMonthSubModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'change-next-month-subscription',
        loadChildren: () => import('./change-next-month-sub/change-next-month-sub.module').then(m => m.ChangeNextMonthSubModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'bill-list',
        loadChildren: () => import('./bill-list/bill-list.module').then(m => m.BillListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'payment-list',
        loadChildren: () => import('./payment-list/payment-list.module').then(m => m.PaymentListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'member-list',
        loadChildren: () => import('./member-list/member-list.module').then(m => m.MemberListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'wholesaler-list',
        loadChildren: () => import('./wholesaler-list/wholesaler-list.module').then(m => m.WholesalerListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'retailer-list',
        loadChildren: () => import('./retailer-list/retailer-list.module').then(m => m.RetailerListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'sim-stock-history',
        loadChildren: () => import('./sim-stock-history/sim-stock-history.module').then(m => m.SIMStockHistoryModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'device-stock-history',
        loadChildren: () => import('./device-stock-history/device-stock-history.module').then(m => m.DeviceStockHistoryModule),
        // canActivate: [AuthGuard]
      },

    ]
  }, {
    path: '**',
    redirectTo: '/'
  }
];
