import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { DocumentService,ResourceService,PartnerService,ProductService } from '../../../../shared/services';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import {Title} from "@angular/platform-browser";
import { TokenStorageService } from 'src/app/modules/authentication/services';
import { User } from 'src/app/shared/models/user';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})


export class DocumentsComponent implements OnInit {

  pageTitle = "List of documents";
  documents:any = [];
  products: any;
  resources: any;
  partners: any;
  filterForm : FormGroup;
  currentUser: User | any;
  notFoundMessage = "No Documents Found";
  headerLinks:[{}] = [{}];

  perPage = environment.documentsPerPage;

  public current: number = 1;
  public total: number = 1;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private productService: ProductService,
    private resourceService: ResourceService,
    private partnerService: PartnerService,
    private snotifyService: SnotifyService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    ) { 
      this.titleService.setTitle(this.pageTitle);
      if(this.tokenStorageService.getUser()){
        this.currentUser = this.tokenStorageService.getUser()
      }
       this.headerLinks = [{ title : 'Add', url : '/admin/documents/add',hasPermission:this.currentUser?.isAdmin}];

       this.filterForm = this.fb.group({
        search: [''],
        product: ['',],
        resource : [''],
        partner: ['']
      })

    }


  ngOnInit(): void {
    
    this.spinner.show();

    let searchString = (this.route.snapshot.queryParams['search']) ? this.route.snapshot.queryParams['search'] : '';
    this.filterForm.patchValue({search:searchString});

    forkJoin(
      [
        this.productService.getAll(),
        this.partnerService.getAll({}),
        this.resourceService.getAll({})
      ]).subscribe((
        [
          products, 
          partners,
          resourses
        ]) => {

      this.products = products.body.map((product:any) => ({id: product.id,text: product.title}))
      this.partners = partners.body.map((product:any) => ({id: product.id,text: product.title}));
      this.resources = resourses.body.map((product:any) => ({id: product.id,text: product.title}));
  
      //this.getDocuments();
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
    this.onSubmit();
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

  delete(item){
    this.snotifyService.confirm('Are you sure...', {...environment.toastConfig,timeout:5000,pauseOnHover: true,buttons: [
      {text: 'Yes', action: (toast) => {
        this.spinner.show();
        this.snotifyService.remove(toast.id)
        this.documentService.delete(item).subscribe({
         next:(response) => {
          this.spinner.hide();
          this.getDocuments();
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

  getFile(docId,type = 'view'){
    let toast =  this.snotifyService.info("Preparing File...", {...environment.toastConfig,timeout:0});
    this.documentService.download(docId).subscribe((response:any): void => {
        
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



  identify(index:any, item:any) {
    return item.id;
  }
}
