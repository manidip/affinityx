import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, } from 'rxjs';
import { DocumentService } from 'src/app/shared/services/document.service';
import { IndustryVerticalService } from 'src/app/shared/services/industry-vertical.service';
import { PartnerService } from 'src/app/shared/services/partner.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ResourcesService } from 'src/app/shared/services/resources.service';
import { minSelectedCheckboxes } from 'src/app/shared/validators/minSelectedCheckboxes';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {

  pageTitle: string = "Add documents";
  documents:any;
  products: any;
  resources: any;
  partners: any;
  industry_verticals: any;
  docTypes:string[] = ['pdf'];
  createForm : FormGroup = this.fb.group({});
  submitted: boolean = false;
  editId:any;
  editingProduct:any;
  currentProduct:any;
  selectAllCheckbox:boolean = false;
  headerLinks:any = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    private resourcesService: ResourcesService,
    private partnerService: PartnerService,
    private industryVerticalService: IndustryVerticalService,
    private documentService: DocumentService,
    private snotifyService: SnotifyService,
    ) { 
      this.createForm = this.fb.group({
        title: ['',[Validators.required]],
        partners: this.fb.array([],minSelectedCheckboxes(1)),
        products: this.fb.array([],minSelectedCheckboxes(1)),
        resources: this.fb.array([],minSelectedCheckboxes(1)),
        industry_verticals: this.fb.array([],minSelectedCheckboxes(1)),
        docType: this.fb.array([true],minSelectedCheckboxes(1)),
        docFile: ['', [Validators.required]],
      });
    }


  ngOnInit(): void {

    this.editId = (this.route.snapshot.params['id']) ? parseInt(this.route.snapshot.params['id']) : '';
    this.editingProduct = (this.editId) ? true : false;
    this.currentProduct;

    this.spinner.show();
    this.headerLinks.push({ title : 'List', url : '/admin/documents',hasPermission:true});
    if(this.editingProduct){
      
      this.headerLinks.push({ title : 'Add', url : '/admin/documents/add',hasPermission:true});
      this.createForm.controls['docFile'].setValidators(null);
      this.createForm.controls['docFile'].setErrors(null);     
    }

    let requests =  [
      this.partnerService.getAll(),
      this.productService.getAll(),
      this.resourcesService.getAll(),
      this.industryVerticalService.getAll(),
    ];

    if(this.editingProduct){
      requests.push(this.documentService.getBy({'post':this.editId}));
    }
   
    forkJoin(requests).subscribe(results => {

      
      if(this.editingProduct && results[4].body){
        this.currentProduct = results[4].body;
        this.createForm.patchValue({title:this.currentProduct.title});
      }
    
      this.partners = results[0].body.map((partner:any) => {
        let controlState = (this.editingProduct) ? this.currentProduct['partners']?.map(function (partner){ return partner.id}).includes(partner.id): false
        this.partnersArray.push(this.fb.control(controlState));
        return {id: partner.id,title: partner.title}
      });

      this.products = results[1].body?.map((product:any) => {
        let controlState = (this.editingProduct) ? this.currentProduct['products']?.map(function (product){ return product.id}).includes(product.id): false
        this.productsArray.push(this.fb.control(controlState));
        return {id: product.id,title: product.title};
      });

      this.resources = results[2].body.map((resourse:any) => {
        let controlState = (this.editingProduct) ?  this.currentProduct['resources']?.map(function (resourse){ return resourse.id}).includes(resourse.id) : false;
        this.resourcesArray.push(this.fb.control(controlState));
        return {id: resourse.id,title: resourse.title}
      })
      
      this.industry_verticals = results[3].body.map((verticle:any) => {
        let controlState = (this.editingProduct) ? this.currentProduct['verticals']?.map(function (verticle){ return verticle.id}).includes(verticle.id) : false;
        this.industryVerticalsArray.push(this.fb.control(controlState));
        return {id: verticle.id,title: verticle.title}
      });
    
      this.spinner.hide();
    }); 
  }

  get partnersArray(){
    return this.createForm.get('partners') as FormArray;
  }
  get productsArray(){
    return this.createForm.get('products') as FormArray;
  }
  get resourcesArray(){
    return this.createForm.get('resources') as FormArray;
  }
  get industryVerticalsArray(){
    return this.createForm.get('industry_verticals') as FormArray;
  }
  get docTypesArray(){
    return this.createForm.get('docType') as FormArray;
  }

  onFileChange(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createForm.controls["docFile"].setValue(file);
    }

  }

  selectAll(type = ''): void {

    if(type == '') return;
    this.selectAllCheckbox = !this.selectAllCheckbox;
    let control = this.createForm.get(type);
  
    if(control){
      if (this.selectAllCheckbox) 
      (control as FormArray).controls.map((control) => control.setValue(true))
    else 
      (control as FormArray).controls.map((control) => control.setValue(false))
    }
  }

  onSubmit(){ 

    this.submitted = true;
    if (this.createForm.invalid) return;

    this.createForm.value.partners = this.createForm.value.partners
    .map((checked, i) => checked ? this.partners[i].id : null)
    .filter(v => v !== null);

    this.createForm.value.products = this.createForm.value.products
      .map((checked, i) => checked ? this.products[i].id : null)
      .filter(v => v !== null);

   this.createForm.value.resources = this.createForm.value.resources
    .map((checked, i) => checked ? this.resources[i].id : null)
    .filter(v => v !== null);

    this.createForm.value.industry_verticals = this.createForm.value.industry_verticals
    .map((checked, i) => checked ? this.industry_verticals[i].id : null)
    .filter(v => v !== null);

    this.createForm.value.docType = this.createForm.value.docType
    .map((checked, i) => checked ? this.docTypes[i] : null)
    .filter(v => v !== null);

    let formValues = this.createForm.value;
    const uploadData = new FormData(); 

    for (let i in formValues) {
      if (formValues[i] instanceof Blob){  //  Check if key value is file
        uploadData.append(i, formValues[i], formValues[i].name ? formValues[i].name : "");
      }
      else{
        uploadData.append(i, formValues[i]);
      }
        
    }

    this.spinner.show();
   
    this.documentService.insert_or_update(uploadData,this.editId).subscribe({
    next: (response) => {
      this.spinner.hide();
      this.snotifyService.success(response, {...environment.toastConfig,timeout:1000});
        setTimeout(() => {
          if(!this.editingProduct) window.location.reload();
          else this.submitted = false;
        }, 1500);
     },
     error: (response) => {
      this.spinner.hide();
      this.snotifyService.error(response, {...environment.toastConfig,timeout:1000});
      setTimeout(() => {
        this.submitted = false;
      }, 1500);
     },
    });
    
  }
}