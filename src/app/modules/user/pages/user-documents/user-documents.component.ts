import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalService,ProductService,DocumentService,ResourceService,PartnerService } from '../../../../shared/services/';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import {Title} from "@angular/platform-browser";
import { TokenStorageService } from 'src/app/modules/authentication/services/';
import { User } from 'src/app/shared/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';

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
  shareForm : FormGroup;
  currentUser: User | any;
  notFoundMessage = "No Documents Found";
  headerLinks:[{}] = [{}];
  resourceId;resourceSlug;
  isAdmin;
  shareItem:number = 0;


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
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private snotifyService: SnotifyService,
    private modalService: ModalService
    ) { 
      this.titleService.setTitle(this.pageTitle);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     

      if(this.tokenStorageService.getUser()){
        this.currentUser = this.tokenStorageService.getUser()
      }  
      this.shareForm = this.fb.group({
        email: ['', [Validators.required]],
        message: [''],
      })

      this.filterForm = this.fb.group({
        search: [''],
        product: ['',],
        resource : [''],
        partner: ['']
      })
    }

  ngOnInit(): void {
    this.spinner.show();
    //this.resourceId = this.route.snapshot.params['resourceId'];
    this.resourceSlug = this.route.snapshot.params['resourceSlug'];

    let searchString = (this.route.snapshot.queryParams['search']) ? this.route.snapshot.queryParams['search'] : '';
    this.filterForm.patchValue({search:searchString});

  if(this.resourceSlug !== 'all' ){
    this.resourceService.getBy({slug:this.resourceSlug}).subscribe((response) => {
      if(response.body && this.resourceSlug !== 'all'){
        this.filterForm.patchValue({resource:response.body[0]?.id});
        this.pageTitle += ' : '+ response.body[0]?.title;
      }
    })
  }

  let requests = [this.productService.getAll(),this.partnerService.getAll({}),this.resourceService.getAll({})]
    forkJoin(requests).subscribe(([ products,partners, resourses]) => {

      this.products = products.body.map((product:any) => ({id: product.id,text: product.title}))
      this.partners = partners.body.map((product:any) => ({id: product.id,text: product.title}));
      this.resources = resourses.body.map((product:any) => ({id: product.id,text: product.title}));
      
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

  identify(index:any, item:any) {
    return item.id;
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

  shareDocModal(item){
    this.shareItem = item.id;
    this.modalService.open('shareDocModal');
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

shareDocSubmit(){
  console.log(this.shareForm.value);
  this.closeModal('shareDocModal');
}
  // private getFilenameFromHeader(headers) {
  //   let contentDispositionHeader = headers.get('content-disposition');
  //   const filename = contentDispositionHeader.split(';')[1].split('=')[1];
  //   return filename;
  // }
}
