import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentService } from 'src/app/shared/services/document.service';
import { IndustryVerticalService } from 'src/app/shared/services/industry-vertical.service';
import { PartnerService } from 'src/app/shared/services/partner.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ResourcesService } from 'src/app/shared/services/resources.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css']
})
export class AddPartnerComponent implements OnInit {

  pageTitle: string = "Add Partner";
  documents:any;
  products: any;
  resources: any;
  partners: any;
  industry_verticals: any;
  docTypes:string[] = ['img'];
  createForm : FormGroup = this.fb.group({});
  submitted: boolean = false;
  editId:any;
  editingItem:any;
  currentItem:any;
  selectAllCheckbox:boolean = false;
  headerLinks:any = [];
  colorScheme: string = '';
  
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
    private titleService: Title,

  ) { 
    this.createForm = this.fb.group({
      title: ['',[Validators.required]],
      color_scheme:  ['',[Validators.required]],
      partner_code:  ['',[Validators.required]],
      contact_persons:  ['',[Validators.required]],
      logo: ['', [Validators.required]],
      banner_image: ['', [Validators.required]],
    });
  }

  colorChanged(value){
    this.createForm.controls['color_scheme'].setValue(value);
  }
  ngOnInit(): void {

    this.editId = (this.route.snapshot.params['id']) ? parseInt(this.route.snapshot.params['id']) : '';
    this.editingItem = (this.editId) ? true : false;
    this.spinner.show();
    this.headerLinks = [{ title : 'List', url : '/admin/partners',hasPermission:true}];
    this.titleService.setTitle(this.editingItem  ? 'Edit Partner': this.pageTitle);
    if(this.editingItem){
      this.headerLinks.push({ title : 'Add', url : '/admin/partners/add',hasPermission:true});
      this.createForm.controls['logo'].setValidators(null);
      this.createForm.controls['logo'].setErrors(null); 
      this.createForm.controls['banner_image'].setValidators(null);
      this.createForm.controls['banner_image'].setErrors(null);     
    }

    this.partnerService.getBy({'post':this.editId}).subscribe((partner) => {
      
      this.currentItem = partner.body;
      this.createForm.patchValue({
        title:this.currentItem.title,
        color_scheme:  this.currentItem.color_scheme,
        partner_code:  this.currentItem.partner_code,
        contact_persons:  this.currentItem.contact_persons,
      });
      this.spinner.hide();

    })

  }

  onLogoChange(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createForm.controls["logo"].setValue(file);
    }
  }

  onBannerImageChange(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createForm.controls["banner_image"].setValue(file);
    }
  }

  onSubmit(){ 

    this.submitted = true;
    //if (this.createForm.invalid) return;

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

    this.partnerService.insert_or_update(uploadData,this.editId).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.snotifyService.success(response.message, {...environment.toastConfig,timeout:1000});
          setTimeout(() => {
            window.location.reload()
          }, 1500);
       },
       error: (response) => {
        this.spinner.hide();
        this.snotifyService.error(response.message, {...environment.toastConfig,timeout:1000});
        setTimeout(() => {
          this.submitted = false;
        }, 1500);
       },
      });

  }

}
