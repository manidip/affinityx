import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResourceService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.css']
})
export class AddResourceComponent implements OnInit {

  pageTitle: string = "Add Partner";
 
  createForm : FormGroup = this.fb.group({});
  submitted: boolean = false;
  editId:any;
  editingItem:any;
  currentItem:any;
  headerLinks:any = [];
  
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private resourceService: ResourceService,
    private snotifyService: SnotifyService,
    private titleService: Title,

  ) { 
    this.createForm = this.fb.group({
      title: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {

    this.editId = (this.route.snapshot.params['id']) ? parseInt(this.route.snapshot.params['id']) : '';
    this.editingItem = (this.editId) ? true : false;
    this.headerLinks = [{ title : 'List', url : '/admin/resources',hasPermission:true}];
    this.titleService.setTitle(this.editingItem  ? 'Edit Resource': this.pageTitle);
    if(this.editingItem){
      this.spinner.show();
      this.headerLinks.push({ title : 'Add', url : '/admin/resources/add',hasPermission:true});
      this.resourceService.getBy({'post':this.editId}).subscribe((partner) => {
      
        this.currentItem = partner.body;
        this.createForm.patchValue({
          title:this.currentItem.title,
        });
        this.spinner.hide();
  
      })
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

    this.spinner.show('formSubmit');

    this.resourceService.insert_or_update(uploadData,this.editId).subscribe({
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
