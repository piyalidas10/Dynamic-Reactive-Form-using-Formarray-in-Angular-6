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
