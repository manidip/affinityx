import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ProductService } from '../../../../shared/services/product.service';
import { DocumentService } from '../../../../shared/services/document.service';
import { ResourcesService } from '../../../../shared/services/resources.service';
import { PartnerService } from '../../../../shared/services/partner.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import {Title} from "@angular/platform-browser";
import { TokenStorageService } from 'src/app/modules/authentication/services/token-storage.service';
import { User } from 'src/app/shared/models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-documents',
  templateUrl: './user-documents.component.html',
  styleUrls: ['./user-documents.component.css']
})
export class UserDocumentsComponent implements OnInit {

  pageTitle = "Documents";
  documents:any = [];
  products: any;
  resources: any;
  partners: any;
  filterForm : FormGroup;
  currentUser: User | any;
  notFoundMessage = "No Documents Found";
  headerLinks:[{}] = [{}];
  resourceId;resourceSlug;
  isAdmin;


  perPage = environment.documentsPerPage;

  public current: number = 1;
  public total: number = 1;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private productService: ProductService,
    private resourcesService: ResourcesService,
    private partnerService: PartnerService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    ) { 
      this.titleService.setTitle(this.pageTitle);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     

      if(this.tokenStorageService.getUser()){
        this.currentUser = this.tokenStorageService.getUser()
      }  

    }

  ngOnInit(): void {
    this.spinner.show();
    this.resourceId = this.route.snapshot.params['resourceId'];
    this.resourceSlug = this.route.snapshot.params['resourceSlug'];

    this.filterForm = this.fb.group({
      search: [''],
      product: ['',],
      resource : [''],
      partner: ['']
    })

    forkJoin(
      [
        this.resourcesService.getBySlug({slug:this.resourceSlug}),
        this.productService.getAll(),
        this.partnerService.getAll(),
        this.resourcesService.getAll()
      ]).subscribe((
        [
          currentResource,
          products, 
          partners,
          resourses
        ]) => {

      this.products = products.body.map((product:any) => ({id: product.id,text: product.title}))
      this.partners = partners.body.map((product:any) => ({id: product.id,text: product.title}));
      this.resources = resourses.body.map((product:any) => ({id: product.id,text: product.title}));
      
      if(currentResource.body){
        this.filterForm.patchValue({resource:currentResource.body[0].id});
        this.pageTitle += ' : '+ currentResource.body[0].title;
      }
  
      if(!this.currentUser.isAdmin){
        this.filterForm.patchValue({partner:this.currentUser.partner[0].id});
      }
      this.getDocuments();
    });

  }
 
  public onSubmit(){
    this.current =  1
    this.getDocuments();
  }

  public onsearKeyword(value:any){
    if(value.length == 0) this.onSubmit();
  }

  public onFilter() {
    //this.onSubmit();
  }

  public onGoTo(page: number): void {
    this.current = page
  } 

  public onNext(page: number): void {
    this.current = page + 1
    this.getDocuments({page:this.current});
  }
  public onPrevious(page: number): void {
    this.current = page - 1
    this.getDocuments({page:this.current});
  }

  public getDocuments(options?: any) {
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


    return this.documentService.getAll({...formValue,per_page:this.perPage,...options}).subscribe(response => {
      let pageCount = response.headers.get('X-WP-TotalPages');
      this.total = Number(pageCount);
      this.spinner.hide();
      this.documents = response.body;
   });
  }

  identify(index:any, item:any) {
    return item.id;
  }
}
