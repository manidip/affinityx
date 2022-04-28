import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardLayoutService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-dashboard-layouts',
  templateUrl: './add-dashboard-layouts.component.html',
  styleUrls: ['./add-dashboard-layouts.component.css']
})
export class AddDashboardLayoutsComponent implements OnInit {

  pageTitle: string = "Add Dashboard";
  headerLinks:any = [];
  createForm : FormGroup = this.fb.group({});
  submitted = false;
  editId:any;
  editingItem:any;
  currentItem:any;

  constructor( 
    private fb:FormBuilder,
    private dashboardLayoutService: DashboardLayoutService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private snotifyService: SnotifyService,
    private titleService: Title,

    ) {

    this.createForm = this.fb.group({
      title : ['',[Validators.required]],
      alert:this.fb.group({
        show_hide: [''],
        alert_title: [''],
        alert_body: [''],
      }),
      welcome:this.fb.group({
        show_hide:  [''],
        welcome_text:  [''],
      }),
      show_hide_search:  [''],
      cta_buttons:this.fb.group({
        show_hide:  [''],
        heading:  [''],
        buttons: this.fb.array([
          this.fb.group({
            title:  [''],
            link:  [''],
          }),
          this.fb.group({
            title:  [''],
            link:  [''],
          })
        ]),
      }),
      show_hide_top_downloads: [''],
      social_icons:this.fb.group({
        show_hide:  [''],
        facebook:  [''],
        instagram:  ['',],
        linkdin:  [''],
        twitter:  [''],
        youtube:  [''],
      }),
    });
   }

   get buttonsArray(){
    return (this.createForm.get('cta_buttons') as FormGroup).get('buttons') as FormArray;
  }


  ngOnInit(): void {
    this.editId = (this.route.snapshot.params['id']) ? parseInt(this.route.snapshot.params['id']) : '';
    this.editingItem = (this.editId) ? true : false;
   
    this.headerLinks = [{ title : 'List', url : '/admin/dashboard-layouts',hasPermission:true}];
    this.titleService.setTitle(this.editingItem  ? 'Edit Document': this.pageTitle);

    if(this.editingItem){
      this.spinner.show();
      this.headerLinks.push({ title : 'Add', url : '/admin/dashboard-layouts/add',hasPermission:true});
  
      this.dashboardLayoutService.getBy({'post':this.editId}).subscribe(dashboard => {
        this.currentItem = dashboard.body;
    
        this.createForm.patchValue({
          title:this.currentItem.title,
          alert:{
            show_hide: this.currentItem.acf_fields.alert?.show_hide,
            alert_title: this.currentItem.acf_fields.alert?.alert_title,
            alert_body: this.currentItem.acf_fields.alert?.alert_body,
          },
          welcome:{
            show_hide: this.currentItem.acf_fields.welcome?.show_hide,
            welcome_text: this.currentItem.acf_fields.welcome?.welcome_text,
          },
          show_hide_search:  this.currentItem.acf_fields.show_hide_search,
          cta_buttons:{
            show_hide:  this.currentItem.acf_fields.cta_buttons?.show_hide,
            heading:  this.currentItem.acf_fields.cta_buttons?.heading,
            buttons:this.currentItem.acf_fields.cta_buttons?.buttons
          },
          show_hide_top_downloads:this.currentItem.acf_fields.show_hide_top_downloads,
          social_icons: {
            show_hide: this.currentItem.acf_fields.social_icons?.show_hide,
            facebook:  this.currentItem.acf_fields.social_icons?.facebook,
            instagram:  this.currentItem.acf_fields.social_icons?.instagram,
            linkdin:  this.currentItem.acf_fields.social_icons?.linkdin,
            twitter:  this.currentItem.acf_fields.social_icons?.twitter,
            youtube: this.currentItem.acf_fields.social_icons?.youtube,
          },
        });
        //this.buttonsArray.setValue(this.currentItem.acf_fields.cta_buttons.buttons);
      
        this.spinner.hide();
      })
    }



  }

  onSubmit(){ 

    this.submitted = true;
    if (this.createForm.invalid) return;
    

    this.spinner.show("formSubmit");
    let formValues = this.createForm.value;
    const uploadData = new FormData(); 

    for (let i in formValues) {
      if (formValues[i] instanceof Blob){
        uploadData.append(i, formValues[i], formValues[i].name ? formValues[i].name : "");
      }
      if(typeof formValues[i] == 'object'){
        uploadData.append(i, JSON.stringify(formValues[i]));
      }else{
        uploadData.append(i, formValues[i]);
      }
    } 

    this.dashboardLayoutService.insert_or_update(uploadData,this.editId).subscribe({
      next: (response) => {
        this.spinner.hide("formSubmit");
        this.snotifyService.success(response.message, {...environment.toastConfig,timeout:1000});
          setTimeout(() => {
            window.location.reload()
          }, 1600);
       },
       error: (response) => {
        this.spinner.hide("formSubmit");
        this.snotifyService.error(response.message, {...environment.toastConfig,timeout:1000});
        setTimeout(() => {
          this.submitted = false;
        }, 1600);
       },
      });

   

  }

}
