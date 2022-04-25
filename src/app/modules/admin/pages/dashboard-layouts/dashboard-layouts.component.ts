import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SnotifyService } from 'ng-snotify';
import {Title} from "@angular/platform-browser";
import { TokenStorageService } from 'src/app/modules/authentication/services/token-storage.service';
import { User } from 'src/app/shared/models/user';
import { DashboardLayoutService } from 'src/app/shared/services/dashboardLayout.service';

@Component({
  selector: 'app-dashboard-layouts',
  templateUrl: './dashboard-layouts.component.html',
  styleUrls: ['./dashboard-layouts.component.css']
})
export class DashboardLayoutsComponent implements OnInit {


  pageTitle = "List of Dashboards";
  dashboardLayouts:any;
  currentUser: User | any;
  filterForm : FormGroup;
  notFoundMessage = "No Resource Found";
  headerLinks:[{}] = [{}];
  perPage = 10;
  current: number = 1;
  total: number = 1;

  constructor( 
    private titleService: Title,
    private fb: FormBuilder,
    private dashboardLayoutService: DashboardLayoutService,
    private spinner: NgxSpinnerService,
    private snotifyService: SnotifyService,
    private tokenStorageService: TokenStorageService
    ) { 
      this.titleService.setTitle(this.pageTitle);
      if(this.tokenStorageService.getUser()){
        this.currentUser = this.tokenStorageService.getUser()
      }
      this.headerLinks = [{ title : 'Add', url : '/admin/dashboard-layouts/add',hasPermission:this.currentUser?.isAdmin}];

      this.filterForm = this.fb.group({
        search: ['',[Validators.required]]
      })


    }

  ngOnInit(): void {
    this.getDashboardLayouts();
  }

  public getDashboardLayouts(options?: any) {
    this.spinner.show();

    let formValue = { ...this.filterForm.value };

    for (let prop in formValue) {
      if (!formValue[prop]) {
        delete formValue[prop];
      }
  
      if (Array.isArray(formValue[prop])) {
        let resultArray = formValue[prop].filter(item => item);
        if (resultArray.length > 0) {
          formValue[prop] = resultArray;
        } else {
          delete formValue[prop];
        }
      }
    }

    return this.dashboardLayoutService.getAll({...formValue,per_page:this.perPage,...options}).subscribe(response => {
      let pageCount = response.headers.get('X-WP-TotalPages');
      this.total = Number(pageCount);
      this.spinner.hide();
      this.dashboardLayouts = response.body;
   });
  }

  onSubmit(){
    this.current =  1
    this.getDashboardLayouts();
  }

  public onGoTo(page: number): void {
    this.current = page
  } 

  public onNext(page: number): void {
    this.current = page + 1
    this.getDashboardLayouts({page:this.current});
  }
  public onPrevious(page: number): void {
    this.current = page - 1
    this.getDashboardLayouts({page:this.current});
  }
  
  onsearKeyword(value){
    if(value.length == 0) this.onSubmit();
  }

  delete(dashboard){
    this.snotifyService.confirm('Are you sure...', {...environment.toastConfig,timeout:5000,pauseOnHover: true,buttons: [
      {text: 'Yes', action: (toast) => {
        this.spinner.show();
        this.snotifyService.remove(toast.id)
        this.dashboardLayoutService.delete(dashboard).subscribe({
         next:(response) => {
          this.spinner.hide();
          this.getDashboardLayouts();
          this.snotifyService.success(response, {...environment.toastConfig,timeout:1000});
         }, 
         error: (response) => {
          this.spinner.hide();
          this.snotifyService.error(response, {...environment.toastConfig,timeout:1000});
         }
        })
      }, bold: false},
      {text: 'No', action: (toast) => {this.snotifyService.remove(toast.id)}},
    ]});

  }
}
