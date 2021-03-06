import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
             selector: 'ngx-stepper',
             templateUrl: 'stepper.component.html',
             styleUrls: ['stepper.component.scss'],
           })
export class StepperComponent implements OnInit {

  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.firstForm = this.fb.group({
                                     firstCtrl: ['', Validators.required],
                                   });

    this.secondForm = this.fb.group({
                                      secondCtrl: ['', Validators.required],
                                    });

    this.thirdForm = this.fb.group({
                                     thirdCtrl: ['', Validators.required],
                                   });
  }

  onFirstSubmit(): void {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit(): void {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit(): void {
    this.thirdForm.markAsDirty();
  }
}
