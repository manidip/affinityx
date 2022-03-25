import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import {Title} from "@angular/platform-browser";
import { TokenStorageService } from 'src/app/modules/authentication/services/token-storage.service';
import { User } from 'src/app/shared/models/user';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  pageTitle = "List of Users";
  users:any;
  currentUser: User | any;
  filterForm : FormGroup;
  notFoundMessage = "No Users Found";
  headerLinks:[{}] = [{}];
  perPage = environment.documentsPerPage;
  current: number = 1;
  total: number = 1;

  constructor( 
    private titleService: Title,
    private fb: FormBuilder,
    private usersService: UsersService,
    private spinner: NgxSpinnerService,
    private snotifyService: SnotifyService,
    private tokenStorageService: TokenStorageService
    ) { 
      this.titleService.setTitle(this.pageTitle);
      if(this.tokenStorageService.getUser()){
        this.currentUser = this.tokenStorageService.getUser()
      }
      this.headerLinks = [{ title : 'Add', url : '/admin/users/add',hasPermission:this.currentUser?.isAdmin}];

      this.filterForm = this.fb.group({
        search: ['',[Validators.required]]
      })


    }

  ngOnInit(): void {
    this.getusers();
  }

  public getusers(options?: any) {
    this.spinner.show();
    return this.usersService.getAll({...this.filterForm.value,per_page:10,...options}).subscribe(response => {
      let pageCount = response.headers.get('X-WP-TotalPages');
      this.total = Number(pageCount);
      this.spinner.hide();
      this.users = response.body;
   });
  }

  onSubmit(){
    this.getusers();
  }
  onsearKeyword(value){
    if(value.length == 0) this.onSubmit();
  }

}
