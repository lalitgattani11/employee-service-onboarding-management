# Employee Service & Onboarding Management System

A Salesforce application for managing employee information, onboarding tasks, and employee service requests.

## Features

- Employee management using a custom `Employee__c` object
- Onboarding task tracking using `Onboarding_Task__c`
- Service request management using `Service_Request__c`
- Create service requests from an LWC portal
- Update service request status from the portal
- Update onboarding task status from the portal
- Automatically set onboarding completion date when a task is completed
- Record-triggered Flow for creating an onboarding task when an employee is created
- Apex controller with SOQL, record creation, and record updates

## Technologies

- Salesforce
- Lightning Web Components (LWC)
- Apex
- SOQL
- Salesforce Flow
- Custom Objects & Fields
- Salesforce DX / Salesforce CLI

## Project Structure

```text
force-app/main/default/
├── classes/
│   └── EmployeePortalController.cls
├── lwc/
│   └── employeePortal/
└── objects/
    ├── Employee__c/
    ├── Onboarding_Task__c/
    └── Service_Request__c/