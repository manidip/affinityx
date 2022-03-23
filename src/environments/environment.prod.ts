import {SnotifyPosition} from 'ng-snotify';

export const environment = {
  production: true,
  apiUrl: 'https://affinityx.dev-ss-pro.com/api',
  documentsPerPage : 10,
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
