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
        canActivate: [AuthGuard]
      },
      {
        path: 'user-list',
        loadChildren: () => import('./user-list/user-list.module').then(m => m.UserListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'product-type',
        loadChildren: () => import('./product-type/product-type.module').then(m => m.ProductTypeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile-edit/profile-edit.module').then(m => m.ProfileEditModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'customer-details/:id',
        loadChildren: () => import('./customer-details/customer-details.module').then(m => m.CustomerDetailsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'customer-due-list',
        loadChildren: () => import('./customer-due-list/customer-due-list.module').then(m => m.CustomerDueListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'stock-entry',
        loadChildren: () => import('./purchase-entry/purchase-entry.module').then(m => m.PurchaseEntryModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'all-sim-list',
        loadChildren: () => import('./all-sim-list/all-sim-list.module').then(m => m.AllSIMListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'all-device-list',
        loadChildren: () => import('./all-device-list/all-device-list.module').then(m => m.AllDeviceListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sold-device-list',
        loadChildren: () => import('./sold-device-list/sold-device-list.module').then(m => m.SoldDeviceListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'updatable-sim-list',
        loadChildren: () => import('./updatable-sim-list/updatable-sim-list.module').then(m => m.UpdatableSIMListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'updatable-device-list',
        loadChildren: () => import('./updatable-device-list/updatable-device-list.module').then(m => m.UpdatableDeviceListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cancelled-sim-list',
        loadChildren: () => import('./cancelled-sim-list/cancelled-sim-list.module').then(m => m.CancelledSIMListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sold-sim-list',
        loadChildren: () => import('./sold-sim-list/sold-sim-list.module').then(m => m.SoldSIMListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'permanently-cancelled-sim-list',
        loadChildren: () => import('./permanently-cancelled-sim-list/permanently-cancelled-sim-list.module').then(m => m.PermanentlyCancelledSIMListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cancelled-device-list',
        loadChildren: () => import('./cancelled-device-list/cancelled-device-list.module').then(m => m.CancelledDeviceListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'permanently-cancelled-device-list',
        loadChildren: () => import('./permanently-cancelled-device-list/permanently-cancelled-device-list.module').then(m => m.PermanentlyCancelledDeviceListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'data-plan-list',
        loadChildren: () => import('./data-plan/data-plan.module').then(m => m.DataPlanModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'actions',
        loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'create-subscription',
        loadChildren: () => import('./create-subscription/create-subscription.module').then(m => m.CreateSubscriptionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'add-product-to-subscription',
        loadChildren: () => import('./add-product-subscription/add-product-subscription.module').then(m => m.AddProductSubscriptionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'remove-product-from-current-month',
        loadChildren: () => import('./remove-product-current-month/remove-product-subscription.module').then(m => m.RemoveProductSubscriptionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'remove-product-from-next-month',
        loadChildren: () => import('./remove-product-next-month/remove-product-next-month.module').then(m => m.RemoveProductNextMonthModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cancel-entrie-subscription-from-current-month',
        loadChildren: () => import('./cancel-entire-sub-current-month/cancel-entire-sub-current-month.module').then(m => m.CancelEntireSubCurrentMonthModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cancel-entrie-subscription-from-next-month',
        loadChildren: () => import('./cancel-entire-sub-next-month/cancel-entire-sub-next-month.module').then(m => m.CancelEntireSubNextMonthModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'hold-entrie-subscription-from-next-month',
        loadChildren: () => import('./hold-entire-sub-next-month/hold-entire-sub-next-month.module').then(m => m.HoldEntireSubNextMonthModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'subscription-list',
        loadChildren: () => import('./subscription-list/subscription-list.module').then(m => m.SubscriptionListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'active-subscription-list',
        loadChildren: () => import('./active-subscription-list/active-subscription-list.module').then(m => m.ActiveSubscriptionListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cancelled-subscription-list',
        loadChildren: () => import('./cancelled-subscription-list/cancelled-subscription-list.module').then(m => m.CancelledSubscriptionListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'wholesaler-subscription-list',
        loadChildren: () => import('./wholesaler-subscription-list/wholesaler-subscription-list.module').then(m => m.WholesalerSubscriptionListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'retailer-subscription-list',
        loadChildren: () => import('./retailer-subscription-list/retailer-subscription-list.module').then(m => m.RetailerSubscriptionListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'change-current-month-subscription',
        loadChildren: () => import('./change-current-month-sub/change-current-month-sub.module').then(m => m.ChangeCurrentMonthSubModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'change-next-month-subscription',
        loadChildren: () => import('./change-next-month-sub/change-next-month-sub.module').then(m => m.ChangeNextMonthSubModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'bill',
        loadChildren: () => import('./bill/bill.module').then(m => m.BillModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'bill-list',
        loadChildren: () => import('./bill-list/bill-list.module').then(m => m.BillListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'bill-list/:page_type',
        loadChildren: () => import('./bill-list/bill-list.module').then(m => m.BillListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'payment-list',
        loadChildren: () => import('./payment-list/payment-list.module').then(m => m.PaymentListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'receive-payment',
        loadChildren: () => import('./receive-payment/receive-payment.module').then(m => m.ReceivePaymentModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'member-list',
        loadChildren: () => import('./member-list/member-list.module').then(m => m.MemberListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'wholesaler-list',
        loadChildren: () => import('./wholesaler-list/wholesaler-list.module').then(m => m.WholesalerListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'retailer-list',
        loadChildren: () => import('./retailer-list/retailer-list.module').then(m => m.RetailerListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sim-stock-history',
        loadChildren: () => import('./sim-stock-history/sim-stock-history.module').then(m => m.SIMStockHistoryModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'device-stock-history',
        loadChildren: () => import('./device-stock-history/device-stock-history.module').then(m => m.DeviceStockHistoryModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sell-sim',
        loadChildren: () => import('./sell-sim/sell-sim.module').then(m => m.SellSIMModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sell-device',
        loadChildren: () => import('./sell-device/sell-device.module').then(m => m.SellDeviceModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sell-device-by-customer/:customer_id',
        loadChildren: () => import('./sell-device-by-customer/sell-device-by-customer.module').then(m => m.SellDeviceByCustomerModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'reactivate-held-subscription',
        loadChildren: () => import('./reactivate-held-subscription/reactivate-held-subscription.module').then(m => m.ReactivateHeldSubscriptionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'profile-edit/:id',
        loadChildren: () => import('./profile-edit/profile-edit.module').then(m => m.ProfileEditModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'all-sim-list-for-reissue',
        loadChildren: () => import('./all-sim-list-for-reissue/all-sim-list-for-reissue.module').then(m => m.AllSIMListForReissueModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'all-sim-list-for-receive',
        loadChildren: () => import('./all-sim-list-for-receive/all-sim-list-for-receive.module').then(m => m.AllSIMListForReceiveModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'reissued-sim-list',
        loadChildren: () => import('./reissued-sim-list/reissued-sim-list.module').then(m => m.ReissuedSIMListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'customer-balance-list',
        loadChildren: () => import('./customer-balance-list/customer-balance-list.module').then(m => m.CustomerBalanceListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'bulk-entry',
        loadChildren: () => import('./bulk-entry/bulk-entry.module').then(m => m.BulkEntryModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'payment-collection/:id',
        loadChildren: () => import('./payment-collection/payment-collection.module').then(m => m.PaymentCollectionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'freeze-sim',
        loadChildren: () => import('./freeze-sims/freeze-sims.module').then(m => m.FreezeSIMsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'unfreeze-sim',
        loadChildren: () => import('./unfreeze-sims/unfreeze-sims.module').then(m => m.UnFreezeSIMsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'subscription-bill-list',
        loadChildren: () => import('./subscription-bill-list/subscription-bill-list.module').then(m => m.SubscriptionBillListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'device-sales-bill-list',
        loadChildren: () => import('./device-sales-bill-list/device-sales-bill-list.module').then(m => m.DeviceSalesBillListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sell-product',
        loadChildren: () => import('./sell-product/sell-product.module').then(m => m.SellProductModule),
        canActivate: [AuthGuard]
      },
    ]
  }, {
    path: '**',
    redirectTo: '/'
  }
];
