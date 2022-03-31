import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { PartnerService } from 'src/app/shared/services/partner.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { minLengthIfHasValue } from 'src/app/shared/validators/minLengthIfHasValue';
import { usernameExists } from 'src/app/shared/validators/usernameExists';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  pageTitle = 'Add User';
  headerLinks = [{}];
  userCreateForm: FormGroup;
  editingItem:any;
  editId:any;
  currentItem:any;
  roles:any = [];
  partners:any = [];
  submitted:boolean = false;
  allStatus = [{id:'active',text:'Active'},{id:'inactive',text:'Inactive'}]
  
  constructor(
    private fb:FormBuilder,
    private partnerService: PartnerService,
    private snotifyService: SnotifyService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private userService: UsersService,
    private titleService: Title,
    ) {
      
    this.userCreateForm = this.fb.group({
      username: ['',[Validators.required,Validators.minLength(4)],[usernameExists(this.userService)]],
      password: ['',[Validators.required]],
      verify_password: ['',[Validators.required]],
      email: ['',[Validators.required,Validators.email,Validators.maxLength(25),]],
      first_name: ['',[Validators.required,Validators.minLength(2)]],
      last_name: ['',[Validators.required,Validators.minLength(2)]],
      department: ['',[Validators.required,Validators.minLength(3)]],
      position: ['',[Validators.required,Validators.minLength(3)]],
      partner: ['',[Validators.required]],
      status: ['',[Validators.required]],
      roles: ['',[Validators.required]],
      profile_picture: ['', [Validators.required]]

    })

   }
  // roles: ['affinityx_partner_user']

  ngOnInit(): void {

    this.spinner.show();
    this.editId = (this.route.snapshot.params['id']) ? parseInt(this.route.snapshot.params['id']) : '';
    this.editingItem = (this.editId) ? true : null;
    this.titleService.setTitle(this.editingItem  ? 'Edit User': this.pageTitle);

    this.headerLinks = [{ title : 'List', url : '/admin/users/',hasPermission:true}];
    if(this.editingItem){
      this.headerLinks.push({ title : 'Add', url : '/admin/users/add',hasPermission:true});  
      this.userCreateForm.controls['username'].disable();
      this.userCreateForm.controls['email'].disable();
      this.userCreateForm.controls['profile_picture'].setValidators(null);
      this.userCreateForm.controls['profile_picture'].setErrors(null);   
      this.userCreateForm.controls['password'].setValidators(null);
      this.userCreateForm.controls['password'].setErrors(null);   
      this.userCreateForm.controls['verify_password'].setValidators(null);
      this.userCreateForm.controls['verify_password'].setErrors(null);   
    }

    let requests =  [
      this.partnerService.getAll(),
      this.userService.getRoles(),
    ];

    if(this.editingItem){
      requests.push(this.userService.get({id:this.editId}));
    }

    forkJoin(requests).subscribe((results:any) => {

    
      if(this.editingItem && results[2].body){
        
        this.currentItem = results[2].body;
        this.userCreateForm.patchValue({
            username:this.currentItem.username,
            email:this.currentItem.email,
            first_name:this.currentItem.first_name,
            last_name:this.currentItem.last_name,
            department:this.currentItem.department,
            position:this.currentItem.position,
            partner:this.currentItem.partner[0]?.id,
            status:this.currentItem.status,
            roles: this.currentItem.role.name
          });
      }

      this.roles = results[1].body.map((role:any) => ({id: role.name,text: role.displayName}));
      this.partners = results[0].body.map((partner:any) => ({id: partner.id,text: partner.title}));
      this.spinner.hide();
    }); 
  
  }

  get f() {
    return this.userCreateForm.controls;
  }

  onSubmit(){ 

    this.submitted = true;
   // if (this.userCreateForm.invalid) return;

    let formValues = this.userCreateForm.value;
    const uploadData = new FormData(); 

    for (let i in formValues) {
      if (formValues[i] instanceof Blob){
        uploadData.append(i, formValues[i], formValues[i].name ? formValues[i].name : "");
      }
      else{
        uploadData.append(i, formValues[i]);
      }
        
    }

    this.spinner.show();
   
    this.userService.insert_or_update(uploadData,this.editId).subscribe({
    next: (response) => {
      console.log(response);
      this.spinner.hide();
      this.snotifyService.success(response.message, {...environment.toastConfig,timeout:1000});
        setTimeout(() => {
          window.location.reload()
        }, 1500);
     },
     error: (response) => {
      console.log(response);
      this.spinner.hide();
      this.snotifyService.error(response.message, {...environment.toastConfig,timeout:1000});
      setTimeout(() => {
        this.submitted = false;
      }, 1500);
     },
    });
    
  }

  onFileChange(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userCreateForm.controls["profile_picture"].setValue(file);
    }
  }

}
