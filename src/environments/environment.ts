// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {SnotifyPosition} from 'ng-snotify';

export const environment = {
  production: false,
  apiUrl: 'https://affinityx.dev-ss-pro.com/api',
  documentsPerPage : 3,
  productsPerPage : 99,
  defaultPerPage : 99,
  toastConfig: {
    timeout: 1500,
    showProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    position : SnotifyPosition.centerBottom,
    newOnTop: false,
    // buttons: [
          //   {text: 'Yes', action: () => console.log('Clicked: Yes'), bold: false},
          //   {text: 'No', action: () => console.log('Clicked: No')},
          //   {text: 'Later', action: (toast) => {console.log('Clicked: Later'); this.snotifyService.remove(toast.id); } },
          //   {text: 'Close', action: (toast) => {console.log('Clicked: No'); this.snotifyService.remove(toast.id); }, bold: true},
          // ],
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
