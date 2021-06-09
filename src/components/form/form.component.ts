import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DatalayerService} from '../../app/@core/services/finsec/data-layer/data-layer.service';
import {JsonPointer} from 'angular6-json-schema-form';
import formLayout from 'assets/form-layouts/inline-layout.json';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {BlockchainService} from '../../app/@core/services/finsec/blockchain/blockchain.service';
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {CollaborativeRiskService} from "../../app/@core/services/finsec/collaborative-risk/collaborative-risk.service";

@Component({
             selector: 'finsec-form',
             templateUrl: './form.component.html',
             styleUrls: ['./form.component.scss'],
           })
export class FormComponent implements OnInit {
  @Input() type: string;
  base_schema_url = 'assets/finsec_form/schemas/sdos';
  base_data_url = 'assets/schemas/finsec/test_examples';
  finsec_object: any = null;
  objectsToBlockchain = ['malware', 'x-risk', 'x-regulation'];
  objectsToCollaborative = ['x-service', 'x-risk-configuration'];
  service: any;
  buttonText = 'Add New';
  buttonClass = 'success';
  success_message: string;
  current: number;
  schema: any;
  data: any;
  formLayout = formLayout;
  liveFormData: any = {};
  formValidationErrors: any;
  formIsValid = null;
  submittedFormData: any = null;
  create = false;
  errorMessages: any;

  constructor(private blockchainService: BlockchainService, private fb: FormBuilder,
              private collaborativeRiskAssessmentService: CollaborativeRiskService,
              private toastrService: NbToastrService, private dialogService: NbDialogService,
              private datalayerService: DatalayerService, private http: HttpClient) {
  }

  get prettySubmittedFormData() {
    return JSON.stringify(this.submittedFormData, null, 2);
  }

  get prettyLiveFormData() {
    return JSON.stringify(this.liveFormData, null, 2);
  }

  get prettyValidationErrors() {
    if (!this.formValidationErrors) {
      return null;
    }
    const errorArray = [];
    for (const error of this.formValidationErrors) {
      const message = error.message;
      const dataPathArray = JsonPointer.parse(error.dataPath);
      if (dataPathArray.length) {
        let field = dataPathArray[0];
        for (let i = 1; i < dataPathArray.length; i++) {
          const key = dataPathArray[i];
          field += /^\d+$/.test(key) ? `[${key}]` : `.${key}`;
        }
        errorArray.push(`${field}: ${message}`);
      } else {
        errorArray.push(message);
      }
    }
    return errorArray.join('<br>');
  }

  onChanges(data: any) {
    this.liveFormData = data;
    const elements: HTMLCollectionOf<any> = document.getElementsByClassName('form-flex-item');
    const submit: HTMLCollectionOf<any> = document.getElementsByClassName('schema-form-submit');
    const form = document.getElementsByClassName('json-schema-form')[0];
    if (elements.length && !form.classList.contains('edited')) {
      form.classList.add('edited');
      for (const item of elements) {
        item.style.margin = '20px';
      }
      for (const item of submit) {
        item.style.margin = '20px';
      }
    }
  }

  isValid(isValid: boolean): void {
    this.formIsValid = isValid;
  }

  validationErrors(data: any): void {
    this.formValidationErrors = data;
  }

  onSubmit(data: any) {
    this.finsec_object = data;
    if (!this.objectsToCollaborative.includes(this.finsec_object.type)) {
      this.service = this.datalayerService;
    } else {
      this.service = this.collaborativeRiskAssessmentService;
    }
    this.service.add(this.finsec_object)
        .subscribe(
          next => {
            if (!next['errors']) {
              this.success_message = 'Item created successfully';
              // TODO: use the toastr service
              this.toastrService.success(this.success_message);
              this.finsec_object = next;
              this.toggleForm();
              this.current++;

            } else {
              this.errorMessages = next['errors'];
            }
          },
          error => {
            this.errorMessages = error['errors'];
          },
        );
  }

  toggleForm() {
    const lists = document.getElementsByTagName('finsec-dual-list') as HTMLCollectionOf<HTMLElement>;
    this.create = !this.create;
    if (!this.create) {
      this.buttonText = 'Add New';
      this.buttonClass = 'success';
    } else {
      this.buttonText = 'Cancel';
      this.buttonClass = 'danger';
    }
    for (const list of lists) {
      list.style.display = this.create ? 'none' : 'block';
    }
  }

  ngOnInit(): void {
    this.formTypeSchema(this.type).subscribe(response => {
      this.schema = {'schema': response};
      this.schema.schema.properties = response.allOf[1].properties;
      this.schema.schema.required = response.required;
      delete this.schema.schema.allOf;
      delete this.schema.schema.definitions;
    });

    this.formTypeDataExample(this.type).subscribe(response => {
      this.data = response;
    });
  }

  formTypeSchema(type: string): Observable<any> {
    return this.http.get(this.base_schema_url + '/' + type + '.json');
  }

  formTypeDataExample(type: string) {
    return this.http.get(this.base_data_url + '/' + type.replace('x-', '') + '_custom.json');

  }

}
