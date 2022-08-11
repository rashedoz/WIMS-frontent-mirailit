import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [
  {
    label: 'Home',
    main: [

      {
        state: 'dashboard',
        name: 'Bill Dashboard',
        type: 'link',
        icon: 'icofont-dashboard'
      },
      {
        state: 'bill',
        name: 'Bill',
        type: 'link',
        icon: 'icofont-dashboard'
      },
    ]
  },
  {
    label: 'Operations',
    permission: 'is_superuser,is_staff',
    main: [
      {
        state: 'sell-product',
        name: 'Sell Products',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },
      {
        state: 'payment-list',
        name: 'Payment List',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },
    ]
  },
  {
    label: 'Stock',
    permission: 'is_superuser,is_staff',
    main: [
      {
        state: 'stock-entry',
        name: 'Stock Entry',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },
      {
        state: 'updatable-sim-list',
        name: 'Updatable Sim List',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },
      // {
      //   state: 'sim-stock-history',
      //   name: 'Sim Stock Summary',
      //   type: 'link',
      //   icon: 'ti-control-forward',
      //   permission: 'is_superuser,is_staff',
      // },
      {
        state: 'all-sim-list',
        name: 'Sim List',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },
      // {
      //   state: 'device-stock-history',
      //   name: 'Device Stock Summary',
      //   type: 'link',
      //   icon: 'ti-control-forward',
      //   permission: 'is_superuser,is_staff',
      // },
      {
        state: 'all-device-list',
        name: 'Device List',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },
    ]
  },
  {
    label: 'Stack Holders',
    permission: 'is_superuser,is_staff',
    main: [
      {
        state: 'customer',
        name: 'Customers',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },

      // {
      //   name: 'Customers',
      //   type: 'sub',
      //   permission: 'is_superuser,is_staff',
      //   icon: 'icofont-brand-microsoft',
      //   children: [
      //     {
      //       state: 'customer',
      //       name: 'Customer List ',
      //       type: 'link',
      //       icon: 'ti-control-forward',
      //       permission: 'is_superuser,is_staff',
      //     },
      //     {
      //       state: 'customer-due-list',
      //       name: 'Customers Due List ',
      //       type: 'link',
      //       icon: 'ti-control-forward',
      //       permission: 'is_superuser,is_staff',
      //     },
      //     {
      //       state: 'customer-balance-list',
      //       name: 'Customer Balance',
      //       type: 'link',
      //       icon: 'ti-control-forward',
      //       permission: 'is_superuser,is_staff',
      //     }


      //   ]
      // },
      {
        state: 'supplier',
        name: 'Suppliers',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },
      {
        state: 'member-list',
        name: 'Members',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },

    ]
  },
  {
    label: 'Configurations',
    permission: 'is_superuser,is_staff',
    main: [
      {
        state: 'package-list',
        name: 'Package',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },
      {
        state: 'data-plan-list',
        name: 'Data Plan',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'is_superuser,is_staff',
      },
    ]
  },
  // {
  //   label: 'Quick Actions',
  //   permission: 'is_superuser,is_staff',
  //   main: [
      // {
      //   state: 'sell-product',
      //   name: 'Sell Product',
      //   type: 'link',
      //   icon: 'ti-control-forward',
      //   permission: 'is_superuser,is_staff',
      // },
      // {
      //   state: 'create-subscription',
      //   name: 'Create Subscription',
      //   type: 'link',
      //   icon: 'ti-control-forward',
      //   permission: 'is_superuser,is_staff',
      // },
      // {
      //   state: 'sell-sim',
      //   name: 'Sell SIM',
      //   type: 'link',
      //   icon: 'ti-control-forward',
      //   permission: 'is_superuser,is_staff',
      // },
      // {
      //   state: 'sell-device',
      //   name: 'Sell Device',
      //   type: 'link',
      //   icon: 'ti-control-forward',
      //   permission: 'is_superuser,is_staff',
      // },
      // {
      //   state: 'actions',
      //   name: 'Common Actions',
      //   type: 'link',
      //   icon: 'ti-control-forward',
      //   permission: 'is_superuser,is_staff',
      // }

  //   ]
  // },
  // {
  //   label: 'Operations',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       state: 'purchase-entry',
  //       name: 'Purchase',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'is_superuser,is_staff',
  //     }
  //   ]
  // },
  // {
  //   label: 'none',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       name: 'SIM Stock',
  //       type: 'sub',
  //       permission: 'is_superuser,is_staff',
  //       icon: 'icofont-brand-microsoft',
  //       children: [
          // {
          //   state: 'sim-stock-history',
          //   name: 'SIM Stock History',
          //   type: 'link',
          //   icon: 'ti-control-forward',
          //   permission: 'is_superuser,is_staff',
          // },
          // {
          //   state: 'all-sim-list',
          //   name: 'All SIM List',
          //   type: 'link',
          //   icon: 'ti-control-forward',
          //   permission: 'is_superuser,is_staff',
          // },
          // {
          //   state: 'updatable-sim-list',
          //   name: 'Updatable SIM List',
          //   type: 'link',
          //   icon: 'ti-control-forward',
          //   permission: 'is_superuser,is_staff',
          // },
          // {
          //   state: 'sold-sim-list',
          //   name: 'Sold SIM List',
          //   type: 'link',
          //   icon: 'ti-control-forward',
          //   permission: 'is_superuser,is_staff',
          // },
          // {
          //   state: 'cancelled-sim-list',
          //   name: 'Cancelled SIM List',
          //   type: 'link',
          //   icon: 'ti-control-forward',
          //   permission: 'is_superuser,is_staff',
          // },
          // {
          //   state: 'permanently-cancelled-sim-list',
          //   name: 'Permanently Cancelled SIM List',
          //   type: 'link',
          //   icon: 'ti-control-forward',
          //   permission: 'is_superuser,is_staff',
          // }

  //       ]
  //     },
  //   ]
  // },
  // {
  //   label: 'none',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       name: 'SIM Holding',
  //       type: 'sub',
  //       permission: 'is_superuser,is_staff',
  //       icon: 'icofont-brand-microsoft',
  //       children: [

  //         {
  //           state: 'freeze-sim',
  //           name: 'Freeze SIM',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'unfreeze-sim',
  //           name: 'Unfreeze SIM',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         }


  //       ]
  //     },
  //   ]
  // },
  // {
  //   label: 'none',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       name: 'SIM Re-issuance',
  //       type: 'sub',
  //       permission: 'is_superuser,is_staff',
  //       icon: 'icofont-brand-microsoft',
  //       children: [
  //         {
  //           state: 'all-sim-list-for-reissue',
  //           name: 'Reissue',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'reissued-sim-list',
  //           name: 'Reissued SIM List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'all-sim-list-for-receive',
  //           name: 'Receive',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         }

  //       ]
  //     },
  //   ]
  // },
  // {
  //   label: 'none',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       name: 'Device Stock',
  //       type: 'sub',
  //       permission: 'is_superuser,is_staff',
  //       icon: 'icofont-brand-microsoft',
  //       children: [
  //         {
  //           state: 'device-stock-history',
  //           name: 'Device Stock History',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'all-device-list',
  //           name: 'All Device List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'updatable-device-list',
  //           name: 'Updatable Device List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'sold-device-list',
  //           name: 'Sold Device List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'cancelled-device-list',
  //           name: 'Cancelled Device List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'permanently-cancelled-device-list',
  //           name: 'Permanently Cancelled Device List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         }

  //       ]
  //     },
  //   ]
  // },

  // {
  //   label: 'none',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       name: 'Subscription',
  //       type: 'sub',
  //       permission: 'is_superuser,is_staff',
  //       icon: 'icofont-brand-microsoft',
  //       children: [
  //         {
  //           state: 'subscription-list',
  //           name: 'Subscription List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'active-subscription-list',
  //           name: 'Active Subscription List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'cancelled-subscription-list',
  //           name: 'Cancelled Subscription List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'create-subscription',
  //           name: 'Create Subscription',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },

  //       ]
  //     },
  //   ]
  // },

  // {
  //   label: 'none',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       name: 'Bills',
  //       type: 'sub',
  //       permission: 'is_superuser,is_staff',
  //       icon: 'icofont-brand-microsoft',
  //       children: [
          // {
          //   state: 'bill-list',
          //   name: 'Bill List',
          //   type: 'link',
          //   icon: 'ti-control-forward',
          //   permission: 'is_superuser,is_staff',
          // },
          // {
          //   state: 'subscription-bill-list',
          //   name: 'Subscription Bill List',
          //   type: 'link',
          //   icon: 'ti-control-forward',
          //   permission: 'is_superuser,is_staff',
          // },
          // {
          //   state: 'device-sales-bill-list',
          //   name: 'Device Sales Bill List',
          //   type: 'link',
          //   icon: 'ti-control-forward',
          //   permission: 'is_superuser,is_staff',
          // },


  //       ]
  //     },
  //   ]
  // },
  // {
  //   label: 'none',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       name: 'Payment',
  //       type: 'sub',
  //       permission: 'is_superuser,is_staff',
  //       icon: 'icofont-brand-microsoft',
  //       children: [
  //         {
  //           state: 'payment-list',
  //           name: 'Payment List',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'receive-payment',
  //           name: 'Receive Payment ',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //       ]
  //     },
  //   ]
  // },

  // {
  //   label: 'none',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       state: 'bill-list',
  //       name: 'Bills',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'is_superuser,is_staff',
  //     }
  //   ]
  // },
  // {
  //   label: 'none',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       state: 'payment-list',
  //       name: 'Payments',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'is_superuser,is_staff',
  //     }
  //   ]
  // },
  // {
  //   label: 'Stack Holders',
  //   permission: 'is_superuser,is_staff',
  //   main: [

  //     {
  //       state: 'member-list',
  //       name: 'Members',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'is_superuser,is_staff',
  //     },
  //     {
  //       state: 'supplier',
  //       name: 'Suppliers',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'is_superuser,is_staff',
  //     },
  //     {
  //       name: 'Customers',
  //       type: 'sub',
  //       permission: 'is_superuser,is_staff',
  //       icon: 'icofont-brand-microsoft',
  //       children: [
  //         {
  //           state: 'customer',
  //           name: 'Customer List ',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'customer-due-list',
  //           name: 'Customers Due List ',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         },
  //         {
  //           state: 'customer-balance-list',
  //           name: 'Customer Balance',
  //           type: 'link',
  //           icon: 'ti-control-forward',
  //           permission: 'is_superuser,is_staff',
  //         }


  //       ]
  //     },

  //   ]
  // },
  // {
  //   label: 'Configurations',
  //   permission: 'is_superuser,is_staff',
  //   main: [
  //     {
  //       state: 'product-type',
  //       name: 'Product Type',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'is_superuser,is_staff',
  //     },
  //     {
  //       state: 'data-plan-list',
  //       name: 'Data Plan',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'is_superuser,is_staff',
  //     },
  //     {
  //       state: 'bulk-entry',
  //       name: 'Bulk Entry',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'is_superuser',
  //     },
  //   ]
  // }
];

@Injectable()
export class MenuItems {
  private menu: Array<any> = MENUITEMS;
  getAll(): Menu[] {
    return this.menu;
  }

  refreshMenu(): void {
    this.menu = [];
    this.menu = MENUITEMS;
  }
  /*add(menu: Menu) {
    MENUITEMS.push(menu);
  }*/
}
