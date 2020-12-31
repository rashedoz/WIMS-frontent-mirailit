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
    label: 'Dashboard',
    main: [

      {
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'icofont-dashboard'
      },


    ]
  },
  {
    label: 'Configurations',
    permission: '',
    main: [
      {
        state: 'product-type',
        name: 'Product Type',
        type: 'link',
        icon: 'ti-control-forward',
        permission: ''
      },
      {
        state: 'data-plan-list',
        name: 'Data Plan',
        type: 'link',
        icon: 'ti-control-forward',
        permission: ''
      },
      {
        state: 'member-list',
        name: 'Member List',
        type: 'link',
        icon: 'ti-control-forward',
        permission: ''
      },
      // {
      //   state: 'customer',
      //   name: 'Customer',
      //   type: 'link',
      //   icon: 'ti-control-forward',
      //   permission: ''
      // },
      {
        state: 'wholesaler-list',
        name: 'Wholesaler List',
        type: 'link',
        icon: 'ti-control-forward',
        permission: ''
      },
      {
        state: 'retailer-list',
        name: 'Retailer List',
        type: 'link',
        icon: 'ti-control-forward',
        permission: ''
      },
      {
        state: 'supplier',
        name: 'Supplier',
        type: 'link',
        icon: 'ti-control-forward',
        permission: ''
      },
      {
        state: 'purchase-entry',
        name: 'Purchase Entry',
        type: 'link',
        icon: 'ti-control-forward',
        permission: ''
      }

    ]
  },
  {
    label: 'none',
    permission: '',
    main: [
        {
            name: 'SIM Stock',
            type: 'sub',
            permission: '',
            icon: 'icofont-brand-microsoft',
            children: [
                  {
                    state: 'sim-stock-history',
                    name: 'SIM Stock History',
                    type: 'link',
                    icon: 'ti-control-forward',
                    permission: '',
                },
                {
                    state: 'all-sim-list',
                    name: 'All SIM List',
                    type: 'link',
                    icon: 'ti-control-forward',
                    permission: '',
                },
                {
                    state: 'updatable-sim-list',
                    name: 'Updatable SIM List',
                    type: 'link',
                    icon: 'ti-control-forward',
                    permission: '',
                },
                {
                    state: 'cancelled-sim-list',
                    name: 'Cancelled SIM List',
                    type: 'link',
                    icon: 'ti-control-forward',
                    permission: '',
                }


            ]
        },
    ]
},
  {
    label: 'none',
    permission: '',
    main: [
        {
            name: 'Device Stock',
            type: 'sub',
            permission: '',
            icon: 'icofont-brand-microsoft',
            children: [
                {
                  state: 'device-stock-history',
                  name: 'Device Stock History',
                  type: 'link',
                  icon: 'ti-control-forward',
                  permission: '',
              },
                {
                  state: 'all-device-list',
                  name: 'All Device List',
                  type: 'link',
                  icon: 'ti-control-forward',
                  permission: '',
              },
              {
                  state: 'updatable-device-list',
                  name: 'Updatable Device List',
                  type: 'link',
                  icon: 'ti-control-forward',
                  permission: '',
              },


            ]
        },
    ]
},
{
  label: 'none',
  permission: '',
  main: [
    {
      state: 'actions',
      name: 'Actions',
      type: 'link',
      icon: 'ti-control-forward',
      permission: ''
    }
  ]
},
{
  label: 'none',
  permission: '',
  main: [
    {
      state: 'subscription-list',
      name: 'All Customer Sub. List',
      type: 'link',
      icon: 'ti-control-forward',
      permission: ''
    }
  ]
},
{
  label: 'none',
  permission: '',
  main: [
    {
      state: 'wholesaler-subscription-list',
      name: 'Wholesaler Subscription List',
      type: 'link',
      icon: 'ti-control-forward',
      permission: ''
    }
  ]
},
{
  label: 'none',
  permission: '',
  main: [
    {
      state: 'retailer-subscription-list',
      name: 'Retailer Subscription List',
      type: 'link',
      icon: 'ti-control-forward',
      permission: ''
    }
  ]
},
{
  label: 'none',
  permission: '',
  main: [
      {
          name: 'SIM Re-issuance',
          type: 'sub',
          permission: '',
          icon: 'icofont-brand-microsoft',
          children: [
              {
                state: 'all-sim-list-for-reissue',
                name: 'Reissue',
                type: 'link',
                icon: 'ti-control-forward',
                permission: '',
             },
              {
                state: 'all-sim-list-for-receive',
                name: 'Receive',
                type: 'link',
                icon: 'ti-control-forward',
                permission: '',
            },

          ]
      },
  ]
},
{
  label: 'none',
  permission: '',
  main: [
    {
      state: 'bill-list',
      name: 'Bills',
      type: 'link',
      icon: 'ti-control-forward',
      permission: ''
    }
  ]
},
// {
//   label: 'none',
//   permission: '',
//   main: [
//       {
//           name: 'Bill',
//           type: 'sub',
//           permission: '',
//           icon: 'icofont-brand-microsoft',
//           children: [
//                 {
//                   state: 'bill-list',
//                   name: 'Bill List',
//                   type: 'link',
//                   icon: 'ti-control-forward',
//                   permission: '',
//               },

//           ]
//       },
//   ]
// },
{
  label: 'none',
  permission: '',
  main: [
    {
      state: 'payment-list',
      name: 'Payments',
      type: 'link',
      icon: 'ti-control-forward',
      permission: ''
    }
  ]
},
//   {
//     label: 'none',
//     permission: '',
//     main: [
//         {
//             name: 'Subscription',
//             type: 'sub',
//             permission: '',
//             icon: 'icofont-brand-microsoft',
//             children: [
//                 {
//                     state: 'subscription',
//                     name: 'Subscription',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 },
//                 {
//                     state: 'create-subscription',
//                     name: 'Create Subscription',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 },
//                 {
//                     state: 'add-product-to-subscription',
//                     name: 'Add Product To Sub.',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 },
//                 {
//                     state: 'subscription-list',
//                     name: 'Subscription List',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 },
//                 {
//                     state: 'change-current-month-subscription',
//                     name: 'Change Current Month Sub.',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 },
//                 {
//                     state: 'change-next-month-subscription',
//                     name: 'Change Next Month Sub.',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 },
//                 {
//                     state: 'remove-product-from-current-month',
//                     name: 'Remove Product Current Month',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 },
//                 {
//                     state: 'remove-product-from-next-month',
//                     name: 'Remove Product Next Month',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 },
//                 {
//                     state: 'cancel-entrie-subscription-from-current-month',
//                     name: 'Cancel Entire Sub Current Month',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 },
//                 {
//                     state: 'cancel-entrie-subscription-from-next-month',
//                     name: 'Cancel Entire Sub Next Month',
//                     type: 'link',
//                     icon: 'ti-control-forward',
//                     permission: '',
//                 }


//             ]
//         },
//     ]
// },
  //  {
  //   label: '',
  //   permission: 'Admin',
  //   main: [

  //     {
  //       state: 'booking-list',
  //       name: 'Bookings',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin'
  //     },
  //     {
  //       state: 'allocation-list',
  //       name: 'Allocations',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin'
  //     },

  //     {
  //       state: 'payment',
  //       name: 'Payments',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin'
  //     }
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
