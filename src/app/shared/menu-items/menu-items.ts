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
        state: 'customer',
        name: 'Customer',
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



    ]
  },
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
