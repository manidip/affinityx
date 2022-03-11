import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ProductService } from '../../../../shared/services/product.service';
import { DocumentService } from '../../../../shared/services/document.service';
import { ResourcesService } from '../../../../shared/services/resources.service';
import { PartnerService } from '../../../../shared/services/partner.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})


export class DocumentsComponent implements OnInit {

  title = "List of documents";
  documents:any;
  products: any;
  resources: any;
  partners: any;
  filterForm : FormGroup;
  notFoundMessage = "No Documents Found";

  
  public perPage = environment.documentsPerPage;

  public current: number = 1;
  public total: number = 1;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private productService: ProductService,
    private resourcesService: ResourcesService,
    private partnerService: PartnerService
    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.filterForm = this.fb.group({
      search: [''],
      product: ['',],
      resource : [''],
      partner: ['']
    })
    
   
    this.getDocuments();

    this.productService.getAll().subscribe(response => {
      this.products = response.body.map((product:any) => ({id: product.id,text: product.title.rendered}))
    });
  
    this.partnerService.getAll().subscribe(response => {
      this.partners = response.body.map((product:any) => ({id: product.id,text: product.title.rendered}));
    });

    this.resourcesService.getAll().subscribe(response => {
      this.resources = response.body.map((product:any) => ({id: product.id,text: product.title.rendered}))
    });
    
  }

  public onFilter() {
    this.spinner.show();
    this.getDocuments();
  }

  onsearKeyword(value:any){
    if(value.length > 3)
    this.onFilter();
  }

  public onGoTo(page: number): void {
    this.current = page
  } 

  public onNext(page: number): void {
    this.current = page + 1
    this.spinner.show();
    this.getDocuments({page:this.current});
  }
  public onPrevious(page: number): void {
    this.current = page - 1
    this.spinner.show();
    this.getDocuments({page:this.current});
  }

  public async getDocuments(options?: any){
    return this.documentService.getAll({...this.filterForm.value,per_page:this.perPage,...options}).subscribe(response => {
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
