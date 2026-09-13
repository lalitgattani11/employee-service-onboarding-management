import { LightningElement, wire } from 'lwc';
import getEmployees from '@salesforce/apex/EmployeePortalController.getEmployees';
import getOnboardingTasks from '@salesforce/apex/EmployeePortalController.getOnboardingTasks';
import getServiceRequests from '@salesforce/apex/EmployeePortalController.getServiceRequests';
import createServiceRequest from '@salesforce/apex/EmployeePortalController.createServiceRequest';
import updateServiceRequestStatus from '@salesforce/apex/EmployeePortalController.updateServiceRequestStatus';
import updateOnboardingTaskStatus from '@salesforce/apex/EmployeePortalController.updateOnboardingTaskStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class EmployeePortal extends LightningElement {

    employees;
    error;
    onboardingTasks;
    taskError;
    serviceRequests;
    requestError;
    wiredServiceRequestsResult;
    wiredOnboardingTasksResult;
    requestName = '';
    selectedEmployeeId = '';
    requestType = '';
    description = '';
    priority = '';

    @wire(getEmployees)
    wiredEmployees({ data, error }) {
        if (data) {
            this.employees = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.employees = undefined;
        }
    }

    @wire(getOnboardingTasks)
    wiredOnboardingTasks(result) {

        this.wiredOnboardingTasksResult = result;

        const { data, error } = result;

        if (data) {
            this.onboardingTasks = data;
            this.taskError = undefined;

        } else if (error) {
            this.taskError = error;
            this.onboardingTasks = undefined;
        }
    }

    @wire(getServiceRequests)
    wiredServiceRequests(result) {

        this.wiredServiceRequestsResult = result;

        const { data, error } = result;

        if (data) {
            this.serviceRequests = data;
            this.requestError = undefined;

        } else if (error) {
            this.requestError = error;
            this.serviceRequests = undefined;
        }
    }

    handleInputChange(event) {
        const field = event.target.name;

        if (field === 'requestName') {
            this.requestName = event.target.value;
        } else if (field === 'employee') {
            this.selectedEmployeeId = event.target.value;
        } else if (field === 'requestType') {
            this.requestType = event.target.value;
        } else if (field === 'description') {
            this.description = event.target.value;
        } else if (field === 'priority') {
            this.priority = event.target.value;
        }
    }

    get employeeOptions() {
        if (this.employees) {
            return this.employees.map(employee => {
                return {
                    label: employee.Name,
                    value: employee.Id
                };
            });
        }

        return [];
    }
    get priorityOptions() {
        return [
            { label: 'High', value: 'High' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Low', value: 'Low' }
        ];
    }

    get requestTypeOptions() {
        return [
            { label: 'Access Request', value: 'Access Request' },
            { label: 'Email Issue', value: 'Email Issue' },
            { label: 'ID Card', value: 'ID Card' },
            { label: 'Laptop Issue', value: 'Laptop Issue' },
            { label: 'Other', value: 'Other' },
            { label: 'Payroll', value: 'Payroll' },
            { label: 'Software Installation', value: 'Software Installation' }
        ];
    }

    handleCreateRequest() {

        createServiceRequest({
            requestName: this.requestName,
            employeeId: this.selectedEmployeeId,
            requestType: this.requestType,
            description: this.description,
            priority: this.priority
        })
            .then(() => {

                // Clear form fields
                this.requestName = '';
                this.selectedEmployeeId = '';
                this.requestType = '';
                this.description = '';
                this.priority = '';

                // Show success message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Service request created successfully.',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredServiceRequestsResult);

            })
            .catch(error => {
                console.error('Error creating service request:', error);
            });
    }
    get statusOptions() {
        return [
            { label: 'New', value: 'New' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Waiting for Employee', value: 'Waiting for Employee' },
            { label: 'Resolved', value: 'Resolved' },
            { label: 'Closed', value: 'Closed' }
        ];
    }
    handleStatusChange(event) {
        const serviceRequestId = event.target.dataset.id;
        const newStatus = event.target.value;

        updateServiceRequestStatus({
            serviceRequestId: serviceRequestId,
            status: newStatus
        })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Service request status updated successfully.',
                        variant: 'success'
                    })
                );

                return refreshApex(this.wiredServiceRequestsResult);
            })
            .catch(error => {
                console.error('Error updating service request status:', error);
            });
    }

    get taskStatusOptions() {
        return [
            { label: 'Pending', value: 'Pending' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Cancelled', value: 'Cancelled' }
        ];
    }

    handleTaskStatusChange(event) {
        const taskId = event.target.dataset.id;
        const newStatus = event.target.value;

        updateOnboardingTaskStatus({
            taskId: taskId,
            status: newStatus
        })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Onboarding task status updated successfully.',
                        variant: 'success'
                    })
                );

                return refreshApex(this.wiredOnboardingTasksResult);
            })
            .catch(error => {
                console.error(
                    'Error updating onboarding task status:',
                    error
                );
            });
    }
}