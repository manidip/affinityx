import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenStorageService } from 'src/app/modules/authentication/services/token-storage.service';
import { DocumentService,UsersService,} from '../../../../shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { environment } from 'src/environments/environment';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  layout: any;
  currentUser: any;
  searchForm: FormGroup;

  constructor( 
    private tokenStorageService: TokenStorageService,
    private userService: UsersService,
    private spinner: NgxSpinnerService,
    private fb:FormBuilder,
    private router: Router,
    private documentService: DocumentService,
    private snotifyService: SnotifyService,
    ) { 
      this.currentUser = this.tokenStorageService.getUser();
      this.searchForm = this.fb.group({
        search: ['', [Validators.required]]
      })
    }

  ngOnInit(): void {
    
    this.spinner.show();
    this.userService.getDashboard(this.currentUser.id).subscribe(dashboard => {
      this.layout = dashboard.body;
      this.spinner.hide();
    })

    // this.searchForm.valueChanges.subscribe({
    //   next: data => {
    //     if (this.searchForm.valid) {
    //        console.log(this.searchForm);
    //     }
    //   },
    // });


  }

  getFile(docId,type = 'view'){
    let toast =  this.snotifyService.info("Preparing File...", {...environment.toastConfig,timeout:0});
    this.documentService.download(docId).subscribe((response:any): void => {
        
        // if(response == false){
        //   toast.body = "Unable to load file. Please try after some time";
        //   return;
        // }

        if (response.type === HttpEventType.DownloadProgress) {
          toast.body = "Preparing File..." + Math.round(100 * response.loaded / response.total) + "%";
        }else if (response.type === HttpEventType.Response) {
          this.snotifyService.remove(toast.id)
          
          if(type == 'view'){
            const file = new Blob([response.body], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank', 'width=1000, height=800');
          }else{
            const blob = response.body;
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.download = response.headers.get('Affy-File-Name');
            //anchor.download = this.getFilenameFromHeader(response.headers);
            anchor.href = url;
            anchor.click();
          }
        }
      })
  }

  onSearchSubmit(){
    if(this.searchForm['controls']['search'].value.length < 3){
      this.snotifyService.info("Please enter at least 3 characters", {...environment.toastConfig,timeout:1500});
      return;
    }
    this.router.navigate(['/user/documents/all'],{ queryParams: this.searchForm.value });
  }
}
