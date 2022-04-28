import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, } from 'rxjs';
import { DocumentService,ResourceService,PartnerService,
  ProductService,IndustryVerticalService } from '../../../../../shared/services';
import { minSelectedCheckboxes } from 'src/app/shared/validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {

  pageTitle: string = "Add Document";
  documents:any;
  products: any;
  resources: any;
  partners: any;
  industry_verticals: any;
  docTypes:string[] = ['pdf'];
  createForm : FormGroup;
  submitted: boolean = false;
  editId:any;
  editingItem:any;
  currentItem:any;
  selectAllCheckbox:boolean = false;
  headerLinks:any = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    private resourceService: ResourceService,
    private partnerService: PartnerService,
    private industryVerticalService: IndustryVerticalService,
    private documentService: DocumentService,
    private snotifyService: SnotifyService,
    private titleService: Title,
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
    this.editingItem = (this.editId) ? true : false;
    this.spinner.show();
    this.headerLinks = [{ title : 'List', url : '/admin/documents',hasPermission:true}];
    this.titleService.setTitle(this.editingItem  ? 'Edit Document': this.pageTitle);
    if(this.editingItem){
      this.headerLinks.push({ title : 'Add', url : '/admin/documents/add',hasPermission:true});
      this.createForm.controls['docFile'].setValidators(null);
      this.createForm.controls['docFile'].setErrors(null);     
    }

    let requests =  [
      this.partnerService.getAll({}),
      this.productService.getAll(),
      this.resourceService.getAll({}),
      this.industryVerticalService.getAll(),
    ];

    if(this.editingItem){
      requests.push(this.documentService.getBy({'post':this.editId}));
    }
   
    forkJoin(requests).subscribe(results => {

      
      if(this.editingItem && results[4].body){
        this.currentItem = results[4].body;
        this.createForm.patchValue({title:this.currentItem.title});
      }
    
      this.partners = results[0].body.map((partner:any) => {
        let controlState = (this.editingItem) ? this.currentItem['partners']?.map(function (partner){ return partner.id}).includes(partner.id): false
        this.partnersArray.push(this.fb.control(controlState));
        return {id: partner.id,title: partner.title}
      });

      this.products = results[1].body?.map((product:any) => {
        let controlState = (this.editingItem) ? this.currentItem['products']?.map(function (product){ return product.id}).includes(product.id): false
        this.productsArray.push(this.fb.control(controlState));
        return {id: product.id,title: product.title};
      });

      this.resources = results[2].body.map((resourse:any) => {
        let controlState = (this.editingItem) ?  this.currentItem['resources']?.map(function (resourse){ return resourse.id}).includes(resourse.id) : false;
        this.resourcesArray.push(this.fb.control(controlState));
        return {id: resourse.id,title: resourse.title}
      })
      
      this.industry_verticals = results[3].body.map((verticle:any) => {
        let controlState = (this.editingItem) ? this.currentItem['verticals']?.map(function (verticle){ return verticle.id}).includes(verticle.id) : false;
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

  getFile(type = 'view'){
    if(!this.currentItem) return;
    let toast =  this.snotifyService.info("Preparing File...", {...environment.toastConfig,timeout:0});
    this.documentService.download(this.currentItem.id).subscribe((response:any): void => {
        
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

    this.spinner.show('formSubmit');
   
    this.documentService.insert_or_update(uploadData,this.editId).subscribe({
    next: (response) => {
      this.spinner.hide('formSubmit');
      this.snotifyService.success(response.message, {...environment.toastConfig,timeout:1000});
        setTimeout(() => {
          window.location.reload()
        }, 1500);
     },
     error: (response) => {
      this.spinner.hide('formSubmit');
      this.snotifyService.error(response.message, {...environment.toastConfig,timeout:1000});
      setTimeout(() => {
        this.submitted = false;
      }, 1500);
     },
    });
    
  }
}
