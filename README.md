# Dynamic Reactive Form using Formarray in Angular 6

FormArray is a variant of FormGroup. FormArray accepts an array of Form Groups or Form Controls. We can group the form controls for a single user, under a single form group. Then this multiple form groups will be added into the FormArray. Each form group will contain three form controls: User name, email and mobile.

FormArray offers more flexibility than FormGroup in the sense that it is easier to manipulate FormControls using "push", "insert" and "removeAt" than using FormGroup's "addControl", "removeControl", "setValue" etc. FormArray methods ensure the controls are properly tracked in the form's hierarchy.

app.module.ts

      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';
      import { FormsModule, ReactiveFormsModule} from '@angular/forms';
      import { HttpClientModule } from '@angular/common/http';
      import { AppComponent } from './app.component';
      import { FormComponent } from './form/form.component';


      @NgModule({
        declarations: [
          AppComponent,
          FormComponent
        ],
        imports: [
          BrowserModule,
          HttpClientModule,
          FormsModule,
          ReactiveFormsModule
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
create a form component

    ng g c form

With FormArray you can therefore add new form fields or set of form fields declaratively.

First, import the necessary modules we require: FormBuilder, FormArray, FormGroup and Validators.

    import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

The first holds our form model and the second holds our user forms array. Now we’ll initialize our form using FormBuilder in the ngOnInit hook. For this example we’ll create an order form that allows the user to add new items dynamically:

    public userForm: FormGroup;
    public userList: FormArray;

createForm() method to create a form group as the first item in our array.

    createForm(): FormGroup {
        return this.formBuilder.group({
            uname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
            uemail: ['', [Validators.required, Validators.maxLength(20), Validators.email]],
            umobile: ['', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]*$')]]
        });
      }

And finally, let’s initialize our form, with a single user as the initial user. Then users can add more user form as they wish.

    ngOnInit() {
        this.userForm = this.formBuilder.group({
          userinfo: this.formBuilder.array([this.createForm()])
        });
        // set userList to the form control containing userinfo
        this.userList = this.userForm.get('userinfo') as FormArray;
      }
      
Adding/Removing Form Controls Dynamically using FormArray
Since users list is an array, it’s a simple matter of pushing new items to the array, just like a normal array. It doesn’t matter whether you are adding a form group, as is our case, or adding a form control, the process is the same.

    addUser() {
        this.userList.push(this.createForm());
     }

The same goes for removing users from the users FormArray, it’s a normal array and all you need is the index. We will pass the index of the item we are removing as a parameter for the removeUser() method.

    removeUser(index) {
        this.userList.removeAt(index);
      }

But, first we need to create a method to get the form group we want, mainly to make our code more readable. We will call our method getUserFormGroup(index) method and returns a form group.

    getUserFormGroup(index): FormGroup {
        const formGroup = this.userList.controls[index] as FormGroup;
        return formGroup;
      }

Then, let’s go ahead and loop over our users FormArray. To do that, we are going to first define a get method, inside our class to fetch the user FormArray from the form group and typecast it, into a FormArray.

    get userFormGroup() {
        return this.userForm.get('userinfo') as FormArray;
      }

Then, we are going to simply loop over the user FormArray returned by the above get method.

    <div class="form-group clearfix"  *ngFor="let user of userFormGroup.controls; index as i">
         <div class="clearfix" [formGroupName]="i">

we are going to check whether the form has all possible errors.

    <div class="error" *ngIf="getUserFormGroup(i).controls['uname'].errors">
         <div *ngIf="getUserFormGroup(i).controls['uname'].errors.minlength">Name must be at least 6 characters</div>
         <div *ngIf="getUserFormGroup(i).controls['uname'].errors.maxlength">Name must be at most 20 characters</div>
    </div>

form.component.ts

    import { Component, OnInit } from '@angular/core';
    import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

    @Component({
      selector: 'app-form',
      templateUrl: './form.component.html',
      styleUrls: ['./form.component.css']
    })
    export class FormComponent implements OnInit {
      public userForm: FormGroup;
      public userList: FormArray;
      uname: string;
      uemail: string;
      umobile: number;

      // returns all form groups under userinfo
      // When the userFormGroup property gets looked up
      // the getter function gets executed and its
      // returned value will be the value of userFormGroup
      get userFormGroup() {
        return this.userForm.get('userinfo') as FormArray;
      }


      constructor(private formBuilder: FormBuilder) { }

      ngOnInit() {
        this.userForm = this.formBuilder.group({
          userinfo: this.formBuilder.array([this.createForm()])
        });
        // set userList to the form control containing userinfo
        this.userList = this.userForm.get('userinfo') as FormArray;
      }

      createForm(): FormGroup {
        return this.formBuilder.group({
            uname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
            uemail: ['', [Validators.required, Validators.maxLength(20), Validators.email]],
            umobile: ['', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]*$')]]
        });
      }

      // get the formgroup under userList form array
      getUserFormGroup(index): FormGroup {
        const formGroup = this.userList.controls[index] as FormGroup;
        return formGroup;
      }

      // add a user form group
      addUser() {
        this.userList.push(this.createForm());
      }

      // remove user from group
      removeUser(index) {
        this.userList.removeAt(index);
      }

      // submit form
      submit() {
        console.log(this.userForm.value);
      }

    }

form.component.html

    <div class="container">
      <div class="col-xs-12 formBox">
        <h3 class="text-center">Multiple User Registration</h3>
        <form [formGroup]="userForm" (ngSubmit)="submit()" novalidate>
            <div formArrayName="userinfo">
                <div class="form-group clearfix"  *ngFor="let user of userFormGroup.controls; index as i">
                    <div class="clearfix" [formGroupName]="i">
                        <h4>User Form {{i+1}}</h4> <!-- because i=0 -->
                        <div class="col-md-4 col-xs-12">
                            <label>Name</label>
                            <input type="text" class="form-control" formControlName="uname" />
                            <div class="error" *ngIf="getUserFormGroup(i).controls['uname'].errors">
                                <div *ngIf="getUserFormGroup(i).controls['uname'].errors.minlength">Name must be at least 6 characters</div>
                                <div *ngIf="getUserFormGroup(i).controls['uname'].errors.maxlength">Name must be at most 20 characters</div>
                            </div>    
                        </div>
                        <div class="col-md-3 col-xs-12">
                            <label>Email</label>
                                <input type="text" class="form-control" formControlName="uemail" />
                                <div class="error" *ngIf="getUserFormGroup(i).controls['uemail'].errors">
                                    <div *ngIf="getUserFormGroup(i).controls['uemail'].errors.maxlength">Email must be at most 20 characters</div>
                                    <div *ngIf="getUserFormGroup(i).controls['uemail'].errors.email">Email is not correct</div>
                                </div>
                        </div>
                        <div class="col-md-3 col-xs-12">
                            <label>Mobile No</label>
                            <input type="text" class="form-control" formControlName="umobile" />
                            <div class="error" *ngIf="getUserFormGroup(i).controls['umobile'].errors">
                                    <div *ngIf="getUserFormGroup(i).controls['umobile'].errors.minlength">Mobile must be at least 10 characters</div>
                            </div>
                        </div>
                        <div class="col-md-2 col-xs-12">
                            <button class="btn btn-danger mt" type="button" [disabled]="i<1" (click)="removeUser(i)"> Remove </button>
                        </div>
                    </div> 
                </div>  
            </div>

            <div class="form-group clearfix">
                <div class="col-md-12 col-xs-12">
                      <button class="btn btn-primary" type="button" (click)="addUser()"> Add User </button>
                      <button type="submit" [disabled]="!userForm.valid" class="btn btn-success">Submit</button>
                </div>
            </div>          
          </form>
      </div>
    </div>

first form is by default and mandatory. We can't remove that form. That's why the remove button is inactive for first user form using [disabled]="i<1"
