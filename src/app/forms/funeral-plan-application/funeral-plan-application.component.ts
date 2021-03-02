import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { BaseFormComponent } from "../base-form.component";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";

@Component({
  selector: "jhi-funeral-plan-application",
  templateUrl: "./funeral-plan-application.component.html",
  styleUrls: ["./funeral-plan-application.component.scss"]
})
export class FuneralPlanApplicationComponent extends BaseFormComponent {
  private _referenceNumber: string;

  options: FormlyFormOptions = {
    formState: {
      cannotProceed: true,
      isCashPayment: false,
      communicationPreference: null,
      hasPostalAddress: false,
      hasResidentialAddress: false
    }
  };

  @Input()
  set referenceNumber(referenceNumber: string) {
    this.findFieldConfig(
      this.fields,
      "PolicyNumber"
    ).defaultValue = referenceNumber;
  }

  @Input()
  set formModel(formModel: any) {
    if (this.isEmptyObject(formModel)) {
      this.model = {};
    } else {
      this.model = formModel;
    }
  }

  private isEmptyObject(obj: any) {
    return JSON.stringify(obj) === "{}";
  }
  /*
    private createNewModel() {
        const newModel = {
            LifeAssureds: { LifeAssured: { Addresses: [{ AddressType: 'Postal' }] } }
        };
        return newModel;
    }
*/
  @Output()
  formSubmitted = new EventEmitter<string>();

  accordion: FormlyFieldConfig = {
    // key: 'accord',
    type: "accordion",
    templateOptions: {
      activeIndex: 1,
      onOpen: event => console.log("Opened"),
      onClose: event => console.log("Closed")
    },

    fieldGroup: [
      // Tab1
      {
        key: "PolicNO",
        templateOptions: { header: "Policy Number" },
        fieldGroup: [
          {
            key: "PolicyNumber",
            type: "input",
            defaultValue: "",
            templateOptions: { disabled: true, required: true }
          },
          {
            key: "LifeAssureds",
            fieldGroup: [
              {
                key: "LifeAssured",

                fieldGroup: [
                  {
                    key: "Underwriting",

                    fieldGroup: [
                      {
                        template: `<h5 class="card-title">Disclosure By Consultant</h5>`
                      },
                      {
                        key: "FnaIdentityDisclosure",
                        type: "radio",
                        templateOptions: {
                          required: true,
                          label:
                            "Do you acknowledge sight and verification of the client's identity document?",
                          options: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                          ]
                        },
                        validators: {
                          FnaIdentityDisclosure: {
                            expression: c => c.value === "Yes",
                            message: (error, field: FormlyFieldConfig) =>
                              `Must be Yes in order to proceed with application`
                          }
                        }
                      },
                      {
                        template: `<h5 class="card-title">Disclosure By Client (Main Member)</h5>`
                      },
                      {
                        key: "OtherPolicy",
                        type: "radio",
                        templateOptions: {
                          required: true,
                          label:
                            "Do you or your immediate family have any other funeral policies with us or other insurance companies? The main member or any of the dependants on the policy can have a maximum of R75 000 funeral cover across all types of funeral policies (including EasyCover).",
                          options: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                          ]
                        },
                        expressionProperties: {
                          "templateOptions.disabled": (model, formState) =>
                            model.FnaIdentityDisclosure !== "Yes"
                        }
                      },
                      {
                        key: "Cancelled",
                        type: "radio",
                        templateOptions: {
                          required: true,
                          label:
                            "Have you cancelled an existing policy within the past four months to apply for this policy or do you intend to do so in the next four months? If 'Yes', you will have to complete a Replacement Policy Advice Record.",
                          options: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                          ]
                        },
                        expressionProperties: {
                          "templateOptions.disabled": (model, formState) =>
                            model.FnaIdentityDisclosure !== "Yes"
                        }
                      },
                      {
                        template: `<h5 class="card-title">Financial Needs Analysis</h5>`
                      },
                      {
                        key: "ProductUnderstood",
                        type: "radio",
                        templateOptions: {
                          required: true,
                          label:
                            "Has this product been explained to you adequately?",
                          options: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                          ]
                        },
                        expressionProperties: {
                          "templateOptions.disabled": (model, formState) =>
                            model.FnaIdentityDisclosure !== "Yes",
                          "options.formState.cannotProceedSet": (
                            model,
                            formState
                          ) => {
                            formState.cannotProceed =
                              model.FnaIdentityDisclosure !== "Yes" ||
                              model.ProductUnderstood !== "Yes";
                            return true;
                          }
                        },
                        validators: {
                          ProductUnderstood: {
                            expression: c => c.value === "Yes",
                            message: (error, field: FormlyFieldConfig) =>
                              `Must be Yes in order to proceed with application`
                          }
                        }
                      },
                      {
                        key: "hasDependents",
                        type: "radio",
                        templateOptions: {
                          required: true,
                          type: "checkbox",
                          label: "Do you have any dependents?",
                          options: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                          ]
                        },
                        expressionProperties: {
                          "templateOptions.disabled": (model, formState) =>
                            formState.cannotProceed
                        }
                      },
                      {
                        key: "DependantsNeedAssistance",
                        type: "radio",
                        templateOptions: {
                          required: true,
                          type: "checkbox",
                          label:
                            "If 'Yes', would they need financial assistance with the burial of loved ones?",
                          options: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                          ]
                        },
                        expressionProperties: {
                          "templateOptions.disabled": (model, formState) =>
                            formState.cannotProceed
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      // Tab 2
      {
        key: "APPdetails",
        templateOptions: { header: "Applicants Details" },
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            className: "col-12",
            key: "CISNumber",
            type: "input",
            templateOptions: {
              label: "CIS Number"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            }
          },
          {
            key: "Title",
            className: "col-2",
            type: "select",
            templateOptions: {
              label: "Title",
              required: true,
              options: [
                { label: "Mr", value: "Mr" },
                { label: "Miss", value: "Miss" }
              ],
              valueProp: "id",
              labelProp: "value"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            }
          },
          {
            className: "col-5",
            key: "First1",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              required: true,
              label: "First name(s)"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            }
          },
          {
            className: "col-5",
            key: "Surname",
            type: "input",
            templateOptions: {
              required: true,
              label: "Surname"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            }
          },

          {
            className: "col-2",
            key: "Initials",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              required: true,
              label: "Initial(s)"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            }
          },

          {
            className: "col-5",
            key: "Identity",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              required: true,
              label: "ID number"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              idNumber: {
                expression: (c, f) => {
                  if (c.value !== null && !/^\w{13}$/.test(c.value)) {
                    return false;
                  } else if (
                    c.value !== null &&
                    f.model.DOB !== undefined &&
                    f.model.DOB !== null &&
                    !c.value.startsWith(
                      f.model.DOB.substr(2, 2) +
                        f.model.DOB.substr(5, 2) +
                        f.model.DOB.substr(8, 2)
                    )
                  ) {
                    return false;
                  } else {
                    return true;
                  }
                },
                message: (error, field: FormlyFieldConfig) =>
                  `Must be 13 characters long and start with date of birth`
              }
            }
          },
          {
            className: "col-5",
            key: "DOB",
            type: "input",
            //wrappers: ["form-field-horizontal"],
            templateOptions: {
              type: "date",
              required: true,
              label: "Date of birth"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              dob: {
                expression: (c, f) => {
                  if (
                    f.model.Identity === undefined ||
                    f.model.Identity === null ||
                    f.model.Identity === ""
                  ) {
                    return true;
                  } else if (
                    c.value !== null &&
                    c.value.substr(2, 2) === f.model.Identity.substr(0, 2) &&
                    c.value.substr(5, 2) === f.model.Identity.substr(2, 2) &&
                    c.value.substr(8, 2) === f.model.Identity.substr(4, 2)
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                },
                message: (error, field: FormlyFieldConfig) =>
                  `Must match date in identity number`
              }
            }
          },

          {
            className: "col-4",
            key: "Gender",
            type: "radio",
            templateOptions: {
              label: "Gender",
              required: true,
              options: [
                { label: "Female", value: "Female" },
                { label: "Male", value: "Male" }
              ]
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            }
          },

          {
            className: "col-4",
            key: "MaritalStatus",
            type: "radio",
            //  wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Marital status",
              options: [
                { label: "Married", value: "Married" },
                { label: "Single", value: "Single" }
              ],
              valueProp: "id",
              labelProp: "value"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            }
          },
          {
            className: "col-4",
            key: "PreferredLanguage",
            type: "radio",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Language",
              required: true,
              options: [
                { label: "Email", value: "Email" },
                { label: "Post", value: "Post" }
              ],
              valueProp: "id",
              labelProp: "value"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            }
          },
          {
            className: "col-12",
            key: "CommunicationPreference",
            type: "radio",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Method of Communication",
              required: true,
              options: [
                { label: "Email", value: "Email" },
                { label: "Post", value: "Post" }
              ]
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) => {
                if (formState.cannotProceed) {
                  return true;
                } else {
                  formState.communicationPreference =
                    model.CommunicationPreference;
                  return false;
                }
              }
            }
          },
          {
            className: "col-6",
            key: "TelWork",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Tel (w)"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              telephoneNumber: {
                expression: c => !c.value || /^\d{10}$/.test(c.value),
                message: (error, field: FormlyFieldConfig) =>
                  `Must be 10 digits long`
              }
            }
          },
          {
            className: "col-6",
            key: "TelHome",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Tel (h)"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              telephoneNumber: {
                expression: c => !c.value || /^\d{10}$/.test(c.value),
                message: (error, field: FormlyFieldConfig) =>
                  `Must be 10 digits long`
              }
            }
          },
          {
            className: "col-6",
            key: "TelCell",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              required: true,
              label: "Cellphone"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              telephoneNumber: {
                expression: c => !c.value || /^\d{10}$/.test(c.value),
                message: (error, field: FormlyFieldConfig) =>
                  `Must be 10 digits long`
              }
            }
          },
          {
            className: "col-6",
            key: "Email",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Email"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed,
              "templateOptions.required": (model, formState) =>
                model.CommunicationPreference === "Email"
            },
            validators: {
              emailAddress: {
                expression: c => !c.value || /(.)*@(.)*\.(.)+/.test(c.value),
                message: (error, field: FormlyFieldConfig) =>
                  `Must be a valid email address`
              }
            }
          },
          {
            className: "col-6",
            key: "Addresses",
            fieldGroup: [
              {
                key: "Postal",
                fieldGroup: [
                  {
                    template: `<h5 class="card-title">Postal Address</h5>`
                  },
                  {
                    key: "Line1",
                    type: "input",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      required: true,
                      label: "Line 1",
                      type: "input"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed,
                      "templateOptions.required": (model, formState) => {
                        formState.hasPostalAddress = model.Line1;
                        return (
                          formState.communicationPreference === "Post" ||
                          !formState.hasResidentialAddress
                        );
                      }
                    }
                  },
                  {
                    key: "Line2",
                    type: "input",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      required: true,
                      label: "Line 2",
                      type: "input"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed,
                      "templateOptions.required": (model, formState) => {
                        return (
                          formState.communicationPreference === "Post" ||
                          !formState.hasResidentialAddress
                        );
                      }
                    }
                  },
                  {
                    key: "Suburb",
                    type: "input",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      required: true,
                      label: "Suburb",
                      type: "input"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed,
                      "templateOptions.required": (model, formState) => {
                        return (
                          formState.communicationPreference === "Post" ||
                          !formState.hasResidentialAddress
                        );
                      }
                    }
                  },
                  {
                    key: "Code",
                    type: "input",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      required: true,
                      label: "Code",
                      type: "input"
                    },
                    validators: {
                      postalCode: {
                        expression: c => !c.value || /^\d+$/.test(c.value),
                        message: (error, field: FormlyFieldConfig) =>
                          `Must be numeric`
                      }
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed,
                      "templateOptions.required": (model, formState) => {
                        return (
                          formState.communicationPreference === "Post" ||
                          !formState.hasResidentialAddress
                        );
                      }
                    }
                  }
                ]
              },
              {
                className: "col-6",
                key: "Residential",
                fieldGroup: [
                  {
                    template: `<h5 class="card-title">Residential Address</h5>`
                  },
                  {
                    key: "Line1",
                    type: "input",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      required: true,
                      label: "Line 1",
                      type: "input"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed,
                      "templateOptions.required": (model, formState) => {
                        formState.hasResidentialAddress = model.Line1;
                        return !formState.hasPostalAddress;
                      }
                    }
                  },
                  {
                    key: "Line2",
                    type: "input",
                    //  wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      required: true,
                      label: "Line 2",
                      type: "input"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed,
                      "templateOptions.required": (model, formState) => {
                        formState.hasResidentialAddress = model.Line1;
                        return !formState.hasPostalAddress;
                      }
                    }
                  },
                  {
                    key: "Suburb",
                    type: "input",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      required: true,
                      label: "Suburb",
                      type: "input"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed,
                      "templateOptions.required": (model, formState) => {
                        formState.hasResidentialAddress = model.Line1;
                        return !formState.hasPostalAddress;
                      }
                    }
                  },
                  {
                    key: "Code",
                    type: "input",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      required: true,
                      label: "Code",
                      type: "input"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed,
                      "templateOptions.required": (model, formState) => {
                        formState.hasResidentialAddress = model.Line1;
                        return !formState.hasPostalAddress;
                      }
                    },
                    validators: {
                      postalCode: {
                        expression: c => !c.value || /^\d+$/.test(c.value),
                        message: (error, field: FormlyFieldConfig) =>
                          `Must be numeric`
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      // Tab 3
      {
        key: "EMPdetails",
        templateOptions: { header: "Employment Details" },
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            className: "col-6",
            key: "MonthlyIncome",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Total monthly income",
              type: "input",
              addonLeft: { text: "R" }
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              money: {
                expression: c => {
                  if (c.value === null || c.value === "") {
                    return true;
                  } else {
                    return /^\d*\.?\d{0,2}$/.test(c.value);
                  }
                },
                message: (error, field: FormlyFieldConfig) =>
                  `Must be valid amount`
              }
            }
          },
          {
            className: "col-6",
            key: "HouseHoldMonthlyIncome",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Total monthly household income",
              type: "input",
              addonLeft: { text: "R" }
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              money: {
                expression: c => {
                  if (c.value === null || c.value === "") {
                    return true;
                  } else {
                    return /^\d*\.?\d{0,2}$/.test(c.value);
                  }
                },
                message: (error, field: FormlyFieldConfig) =>
                  `Must be valid amount`
              }
            }
          },
          {
            className: "col-6",
            key: "Employment",
            fieldGroup: [
              {
                key: "IsEmployed",
                type: "radio",
                //  wrappers: ["form-field-horizontal"],
                templateOptions: {
                  required: true,
                  label: "Are you currently employed?",
                  options: [
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" }
                  ]
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                }
              }
            ]
          },
          {
            className: "col-6",
            key: "Occupation",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Occupation",
              type: "input"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            }
          },
          {
            className: "col-6",
            key: "Employment",
            fieldGroup: [
              {
                key: "EmployerName",
                type: "input",
                //  wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Employer's name",
                  type: "input"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.IsEmployed === "Yes"
                }
              }
            ]
          },
          {
            className: "col-6",
            key: "TelWork",
            type: "input",
            //  wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Employer's contact number"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              telephoneNumber: {
                expression: c => !c.value || /^\d{10}$/.test(c.value),
                message: (error, field: FormlyFieldConfig) =>
                  `Must be 10 digits long`
              }
            }
          },
          {
            key: "Employment",
            className: "col-12",
            fieldGroup: [
              {
                key: "Addresses",
                type: "repeat",
                templateOptions: {
                  addText: "Add Address"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                },
                fieldArray: {
                  key: "Address",

                  fieldGroup: [
                    {
                      className: "col-12",
                      key: "AddressType",
                      type: "radio",
                      // wrappers: ["form-field-horizontal"],
                      templateOptions: {
                        label: "Address Type",
                        required: true,
                        options: [
                          { label: "Postal", value: "Postal" },
                          { label: "Residential", value: "Residential" }
                        ]
                      }
                    },
                    {
                      className: "col-12",
                      key: "Line1",
                      type: "input",
                      // wrappers: ["form-field-horizontal"],
                      templateOptions: {
                        required: true,
                        label: "Line 1",
                        type: "input"
                      }
                    },
                    {
                      className: "col-12",
                      key: "Line2",
                      type: "input",
                      // wrappers: ["form-field-horizontal"],
                      templateOptions: {
                        required: true,
                        label: "Line 2",
                        type: "input"
                      }
                    },
                    {
                      className: "col-12",
                      key: "Suburb",
                      type: "input",
                      // wrappers: ["form-field-horizontal"],
                      templateOptions: {
                        required: true,
                        label: "Suburb",
                        type: "input"
                      }
                    },
                    {
                      className: "col-12",
                      key: "Code",
                      type: "input",
                      // wrappers: ["form-field-horizontal"],
                      templateOptions: {
                        required: true,
                        label: "Code",
                        type: "input"
                      },
                      validators: {
                        postalCode: {
                          expression: c => !c.value || /^\d+$/.test(c.value),
                          message: (error, field: FormlyFieldConfig) =>
                            `Must be numeric`
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      },
      // Tab 4
      {
        key: "Benefits",
        templateOptions: { header: "Benefit Details" },
        fieldGroup: [
          {
            fieldGroupClassName: "row",
            key: "Benefit",
            fieldGroup: [
              {
                className: "col-6",
                key: "SumAssured",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  required: true,
                  label: "Cover Amount",
                  type: "input",
                  addonLeft: { text: "R" }
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                },
                validators: {
                  money: {
                    expression: c => {
                      if (c.value === null || c.value === "") {
                        return true;
                      } else {
                        return /^\d*\.?\d{0,2}$/.test(c.value);
                      }
                    },
                    message: (error, field: FormlyFieldConfig) =>
                      `Must be valid amount`
                  }
                }
              },
              {
                className: "col-6",
                key: "Premium",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Premium",
                  type: "input",
                  addonLeft: { text: "R" }
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                },
                validators: {
                  money: {
                    expression: c => {
                      if (c.value === null || c.value === "") {
                        return true;
                      } else {
                        return /^\d*\.?\d{0,2}$/.test(c.value);
                      }
                    },
                    message: (error, field: FormlyFieldConfig) =>
                      `Must be valid amount`
                  }
                }
              }
            ]
          }
        ]
      },
      // Tab 5
      {
        key: "BenefitLifeAssureds",
        templateOptions: { header: "Spouse / Life partner" },
        fieldGroupClassName: "",
        fieldGroup: [
          {
            key: "Spouse",
            fieldGroupClassName: "row",
            fieldGroup: [
              {
                className: "col-2",
                key: "Title",
                type: "select",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Title",
                  options: [
                    { label: "Email", value: "Email" },
                    { label: "Post", value: "Post" }
                  ],
                  valueProp: "id",
                  labelProp: "value"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Surname && model.Surname.length > 0
                }
              },
              {
                className: "col-5",
                key: "First1",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "First name(s)"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Surname && model.Surname.length > 0
                }
              },
              {
                className: "col-5",
                key: "Surname",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Surname"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                }
              },
              {
                className: "col-2",
                key: "Initials",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Initials"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Surname && model.Surname.length > 0
                }
              },

              {
                className: "col-5",
                key: "Identity",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  type: "input",
                  label: "ID number"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Surname && model.Surname.length > 0
                },
                validators: {
                  idNumber: {
                    expression: (c, f) => {
                      if (c.value !== null && !/^\w{13}$/.test(c.value)) {
                        return false;
                      } else if (
                        c.value !== null &&
                        f.model.DOB !== undefined &&
                        f.model.DOB !== null &&
                        !c.value.startsWith(
                          f.model.DOB.substr(2, 2) +
                            f.model.DOB.substr(5, 2) +
                            f.model.DOB.substr(8, 2)
                        )
                      ) {
                        return false;
                      } else {
                        return true;
                      }
                    },
                    message: (error, field: FormlyFieldConfig) =>
                      `Must be 13 characters long and start with date of birth`
                  }
                }
              },
              {
                className: "col-5",
                key: "DOB",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  type: "date",
                  label: "Date of birth"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Surname && model.Surname.length > 0
                },
                validators: {
                  dob: {
                    expression: (c, f) => {
                      if (
                        f.model.Identity === undefined ||
                        f.model.Identity === null ||
                        f.model.Identity === ""
                      ) {
                        return true;
                      } else if (
                        c.value !== null &&
                        c.value.substr(2, 2) ===
                          f.model.Identity.substr(0, 2) &&
                        c.value.substr(5, 2) ===
                          f.model.Identity.substr(2, 2) &&
                        c.value.substr(8, 2) === f.model.Identity.substr(4, 2)
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    },
                    message: (error, field: FormlyFieldConfig) =>
                      `Must match date in identity number`
                  }
                }
              },

              {
                className: "col-12",
                key: "Gender",
                type: "radio",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Gender",
                  options: [
                    { label: "Female", value: "Female" },
                    { label: "Male", value: "Male" }
                  ]
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Surname && model.Surname.length > 0
                }
              },

              {
                className: "col-6",
                key: "EmployerName",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  type: "input",
                  label: "Employer's name"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                }
              },
              {
                className: "col-6",
                key: "EmployerTelephone",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  type: "input",
                  label: "Employer's contact number"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                },
                validators: {
                  telephoneNumber: {
                    expression: c => !c.value || /^\d{10}$/.test(c.value),
                    message: (error, field: FormlyFieldConfig) =>
                      `Must be 10 digits long`
                  }
                }
              }
            ]
          }
        ]
      },
      // Tab 6
      {
        key: "Childrens",
        templateOptions: { header: "Children / Other documents" },
        fieldGroupClassName: "",
        fieldGroup: [
          {
            key: "Children:",
            type: "repeat",
            templateOptions: {
              addText: "Add child"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            fieldArray: {
              fieldGroupClassName: "row",
              fieldGroup: [
                {
                  className: "col-6",
                  type: "input",
                  key: "First1",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "First names(s)"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  }
                },
                {
                  className: "col-6",
                  type: "input",
                  key: "Surname",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "Surname:",
                    required: true
                  }
                },
                {
                  className: "col-2",
                  type: "input",
                  key: "Initials",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "Initials(s)"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  }
                },
                {
                  className: "col-5",
                  type: "input",
                  key: "Identity",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "ID number"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  },
                  validators: {
                    idNumber: {
                      expression: (c, f) => {
                        if (c.value !== null && !/^\w{13}$/.test(c.value)) {
                          return false;
                        } else if (
                          c.value !== null &&
                          f.model.DOB !== undefined &&
                          f.model.DOB !== null &&
                          !c.value.startsWith(
                            f.model.DOB.substr(2, 2) +
                              f.model.DOB.substr(5, 2) +
                              f.model.DOB.substr(8, 2)
                          )
                        ) {
                          return false;
                        } else {
                          return true;
                        }
                      },
                      message: (error, field: FormlyFieldConfig) =>
                        `Must be 13 characters long and start with date of birth`
                    }
                  }
                },
                {
                  className: "col-5",
                  type: "input",
                  key: "DOB",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    type: "date",
                    label: "Date of birth"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  },
                  validators: {
                    dob: {
                      expression: (c, f) => {
                        if (
                          f.model.Identity === undefined ||
                          f.model.Identity === null ||
                          f.model.Identity === ""
                        ) {
                          return true;
                        } else if (
                          c.value !== null &&
                          c.value.substr(2, 2) ===
                            f.model.Identity.substr(0, 2) &&
                          c.value.substr(5, 2) ===
                            f.model.Identity.substr(2, 2) &&
                          c.value.substr(8, 2) === f.model.Identity.substr(4, 2)
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      },
                      message: (error, field: FormlyFieldConfig) =>
                        `Must match date in identity number`
                    }
                  }
                },

                {
                  className: "col-12",
                  type: "radio",
                  key: "InsurableInterest",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "Relationship",
                    options: [
                      { label: "Daughter", value: "Daughter" },
                      { label: "Son", value: "Son" }
                    ]
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  }
                }
              ]
            }
          },
          {
            template: `<h5 class="card-title">Other Dependants<h5>`
          },
          {
            key: "Dependants:",
            type: "repeat",
            templateOptions: {
              addText: "Add dependant"
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            fieldArray: {
              fieldGroupClassName: "row",
              fieldGroup: [
                {
                  className: "col-2",
                  key: "Title",
                  type: "select",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "Title",
                    options: [
                      { label: "Mr", value: "Mr" },
                      { label: "Miss", value: "Miss" }
                    ],
                    valueProp: "id",
                    labelProp: "value"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  }
                },
                {
                  className: "col-5",
                  type: "input",
                  key: "First1",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "First names(s)"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  }
                },
                {
                  className: "col-5",
                  type: "input",
                  key: "Surname",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "Surname:",
                    required: true
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  }
                },
                {
                  className: "col-2",
                  type: "input",
                  key: "Initials",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "Initials(s)"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  }
                },
                {
                  className: "col-5",
                  type: "input",
                  key: "Identity",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "ID number"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  },
                  validators: {
                    idNumber: {
                      expression: (c, f) => {
                        if (c.value !== null && !/^\w{13}$/.test(c.value)) {
                          return false;
                        } else if (
                          c.value !== null &&
                          f.model.DOB !== undefined &&
                          f.model.DOB !== null &&
                          !c.value.startsWith(
                            f.model.DOB.substr(2, 2) +
                              f.model.DOB.substr(5, 2) +
                              f.model.DOB.substr(8, 2)
                          )
                        ) {
                          return false;
                        } else {
                          return true;
                        }
                      },
                      message: (error, field: FormlyFieldConfig) =>
                        `Must be 13 characters long and start with date of birth`
                    }
                  }
                },
                {
                  className: "col-5",
                  type: "input",
                  key: "DOB",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    type: "date",
                    label: "Date of birth"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  },
                  validators: {
                    dob: {
                      expression: (c, f) => {
                        if (
                          f.model.Identity === undefined ||
                          f.model.Identity === null ||
                          f.model.Identity === ""
                        ) {
                          return true;
                        } else if (
                          c.value !== null &&
                          c.value.substr(2, 2) ===
                            f.model.Identity.substr(0, 2) &&
                          c.value.substr(5, 2) ===
                            f.model.Identity.substr(2, 2) &&
                          c.value.substr(8, 2) === f.model.Identity.substr(4, 2)
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      },
                      message: (error, field: FormlyFieldConfig) =>
                        `Must match date in identity number`
                    }
                  }
                },
                {
                  className: "col-6",
                  type: "select",
                  key: "Relationship",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "Relationship",
                    options: [
                      { label: "Mr", value: "Mr" },
                      { label: "Miss", value: "Miss" }
                    ],
                    valueProp: "id",
                    labelProp: "value"
                  },
                  expressionProperties: {
                    "templateOptions.required": (model, formState) =>
                      model.Surname && model.Surname.length > 0
                  }
                },
                {
                  className: "col-6",
                  type: "input",
                  key: "Premium",
                  // wrappers: ["form-field-horizontal"],
                  templateOptions: {
                    label: "Premium",
                    addonLeft: { text: "R" }
                  },
                  expressionProperties: {
                    "templateOptions.disabled": (model, formState) =>
                      formState.cannotProceed
                  },
                  validators: {
                    money: {
                      expression: c => {
                        if (c.value === null || c.value === "") {
                          return true;
                        } else {
                          return /^\d*\.?\d{0,2}$/.test(c.value);
                        }
                      },
                      message: (error, field: FormlyFieldConfig) =>
                        `Must be valid amount`
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      // Tab 7
      {
        key: "Beneficiaries",
        templateOptions: {
          header: "Beneficiary (The beneficiary  must be over 18 years of age)"
        },
        fieldGroup: [
          {
            fieldGroupClassName: "row",
            key: "Beneficiary",
            fieldGroup: [
              {
                className: "col-2",
                key: "Title",
                type: "select",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Title",
                  options: [
                    { label: "Mr", value: "Mr" },
                    { label: "Miss", value: "Miss" }
                  ],
                  valueProp: "id",
                  labelProp: "value"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                }
              },

              {
                className: "col-5",
                key: "First1",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "First name(s)"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Title && model.Title.length > 0
                }
              },
              {
                className: "col-5",
                key: "Surname",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Surname"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Title && model.Title.length > 0
                }
              },
              {
                className: "col-2",
                key: "Gender",
                type: "radio",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Gender",
                  options: [
                    { label: "Female", value: "Female" },
                    { label: "Male", value: "Male" }
                  ]
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Title && model.Title.length > 0
                }
              },

              {
                className: "col-5",
                key: "Identity",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "ID number"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Title && model.Title.length > 0
                },
                validators: {
                  idNumber: {
                    expression: (c, f) => {
                      if (c.value !== null && !/^\w{13}$/.test(c.value)) {
                        return false;
                      } else if (
                        c.value !== null &&
                        f.model.DOB !== undefined &&
                        f.model.DOB !== null &&
                        !c.value.startsWith(
                          f.model.DOB.substr(2, 2) +
                            f.model.DOB.substr(5, 2) +
                            f.model.DOB.substr(8, 2)
                        )
                      ) {
                        return false;
                      } else {
                        return true;
                      }
                    },
                    message: (error, field: FormlyFieldConfig) =>
                      `Must be 13 characters long and start with date of birth`
                  }
                }
              },
              {
                className: "col-5",
                key: "DOB",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  type: "date",
                  label: "Date of birth"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Title && model.Title.length > 0
                },
                validators: {
                  dob: {
                    expression: (c, f) => {
                      if (
                        f.model.Identity === undefined ||
                        f.model.Identity === null ||
                        f.model.Identity === ""
                      ) {
                        return true;
                      } else if (
                        c.value !== null &&
                        c.value.substr(2, 2) ===
                          f.model.Identity.substr(0, 2) &&
                        c.value.substr(5, 2) ===
                          f.model.Identity.substr(2, 2) &&
                        c.value.substr(8, 2) === f.model.Identity.substr(4, 2)
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    },
                    message: (error, field: FormlyFieldConfig) =>
                      `Must match date in identity number`
                  }
                }
              },

              {
                className: "col-6",
                key: "TelCell",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Cellphone"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Title && model.Title.length > 0
                },
                validators: {
                  telephoneNumber: {
                    expression: c => !c.value || /^\d{10}$/.test(c.value),
                    message: (error, field: FormlyFieldConfig) =>
                      `Must be 10 digits long`
                  }
                }
              },
              {
                className: "col-6",
                type: "select",
                key: "Relationship",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Relationship",
                  options: [
                    { label: "Mr", value: "Mr" },
                    { label: "Miss", value: "Miss" }
                  ],
                  valueProp: "id",
                  labelProp: "value"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "templateOptions.required": (model, formState) =>
                    model.Title && model.Title.length > 0
                }
              }
            ]
          }
        ]
      },
      // Tab 8
      {
        key: "PaymentMethod",
        templateOptions: { header: "Method of Payment" },
        fieldGroup: [
          {
            fieldGroupClassName: "row",
            key: "PaymentDetails",
            fieldGroup: [
              {
                className: "col-12",
                key: "PreferredPaymentMethod",
                type: "radio",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  label: "Preferred method of payment",
                  required: true,
                  options: [
                    { label: "Cash", value: "Cash" },
                    { label: "Debit order", value: "DebitOrder" }
                  ]
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed,
                  "options.formState.isCashPayment": (model, formState) => {
                    formState.isCashPayment =
                      model.PreferredPaymentMethod &&
                      model.PreferredPaymentMethod === "Cash";
                    return true;
                  }
                }
              }
            ]
          },
          {
            className: "col-6",
            key: "AdminFees",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Policy fee",
              addonLeft: { text: "R" }
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              money: {
                expression: c => {
                  if (c.value === null || c.value === "") {
                    return true;
                  } else {
                    return /^\d*\.?\d{0,2}$/.test(c.value);
                  }
                },
                message: (error, field: FormlyFieldConfig) =>
                  `Must be valid amount`
              }
            }
          },
          {
            className: "col-6",
            key: "TotalPremium",
            type: "input",
            // wrappers: ["form-field-horizontal"],
            templateOptions: {
              label: "Monthly premium",
              required: true,
              addonLeft: { text: "R" }
            },
            expressionProperties: {
              "templateOptions.disabled": (model, formState) =>
                formState.cannotProceed
            },
            validators: {
              money: {
                expression: c => {
                  if (c.value === null || c.value === "") {
                    return true;
                  } else {
                    return /^\d*\.?\d{0,2}$/.test(c.value);
                  }
                },
                message: (error, field: FormlyFieldConfig) =>
                  `Must be valid amount`
              }
            }
          },
          {
            key: "PaymentDetails",
            fieldGroup: [
              {
                key: "DebitAccount",
                fieldGroup: [
                  {
                    className: "col-6",
                    key: "AccountNumber",
                    type: "input",
                    //  wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      label: "Account number"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed
                    },
                    hideExpression: (model, formState) =>
                      formState.isCashPayment,
                    validators: {
                      numeric: {
                        expression: c => !c.value || /^\d+$/.test(c.value),
                        message: (error, field: FormlyFieldConfig) =>
                          `Must be numberic`
                      }
                    }
                  },
                  {
                    className: "col-6",
                    key: "Bank",
                    type: "select",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      label: "Bank",
                      options: [
                        { label: "Mr", value: "Mr" },
                        { label: "Miss", value: "Miss" }
                      ],
                      valueProp: "id",
                      labelProp: "value"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed
                    },
                    hideExpression: (model, formState) =>
                      formState.isCashPayment
                  },
                  {
                    className: "col-6",
                    key: "BranchCode",
                    type: "input",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      label: "Branch code"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed
                    },
                    // asyncValidators: {
                    // uniqueUsername: {
                    // expression: (control: FormControl) => {
                    // return 'cool'
                    //);
                    //},
                    //message: "Invalid branch code"
                    //}
                    //},
                    hideExpression: (model, formState) =>
                      formState.isCashPayment,
                    validators: {
                      numeric: {
                        expression: c => !c.value || /^\d+$/.test(c.value),
                        message: (error, field: FormlyFieldConfig) =>
                          `Must be numberic`
                      }
                    }
                  },
                  {
                    className: "col-6",
                    key: "AccountType",
                    type: "radio",
                    // wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      label: "Type of account",
                      options: [
                        { label: "Mr", value: "Mr" },
                        { label: "Miss", value: "Miss" }
                      ],
                      valueProp: "id",
                      labelProp: "value"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed
                    },
                    hideExpression: (model, formState) =>
                      formState.isCashPayment
                  },
                  {
                    className: "col-6",
                    key: "DebitDayOfMonth",
                    type: "input",
                    //  wrappers: ["form-field-horizontal"],
                    templateOptions: {
                      label: "Preferred Debit Day",
                      placeholder: "2"
                    },
                    expressionProperties: {
                      "templateOptions.disabled": (model, formState) =>
                        formState.cannotProceed
                    },
                    validators: {
                      dayOfMonth: {
                        expression: c =>
                          !c.value ||
                          (/^\d+$/.test(c.value) &&
                            parseInt(c.value) > 0 &&
                            parseInt(c.value) < 32),
                        message: (error, field: FormlyFieldConfig) =>
                          `Must be a day of the month`
                      }
                    },
                    hideExpression: (model, formState) =>
                      formState.isCashPayment
                  }
                ]
              }
            ]
          }
        ]
      },
      // Tab 9
      {
        key: "Intermediaries",
        templateOptions: { header: "Representative Details" },
        fieldGroupClassName: "",
        fieldGroup: [
          {
            fieldGroupClassName: "row",
            key: "Intermediary",
            fieldGroup: [
              {
                className: "col-6",
                key: "First1",
                type: "input",
                //  wrappers: ["form-field-horizontal"],
                templateOptions: {
                  required: true,
                  label: "First name(s)"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                }
              },
              {
                className: "col-6",
                key: "Surname",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  required: true,
                  label: "Surname"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                }
              },
              {
                className: "col-12",
                key: "Staffnumber",
                type: "input",
                // wrappers: ["form-field-horizontal"],
                templateOptions: {
                  required: true,
                  label: "Staff number"
                },
                expressionProperties: {
                  "templateOptions.disabled": (model, formState) =>
                    formState.cannotProceed
                }
              }
            ]
          }
        ]
      }
    ]
  };
  fields: FormlyFieldConfig[] = [this.accordion];
}
