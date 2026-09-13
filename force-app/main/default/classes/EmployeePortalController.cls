public with sharing class EmployeePortalController {

    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployees() {

        return [
            SELECT Id, Name, Employee_ID__c, Email__c,
                   Department__c, Designation__c, Phone__c,
                   Joining_Date__c, Location__c, Status__c
            FROM Employee__c
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Onboarding_Task__c> getOnboardingTasks() {

        return [
            SELECT Id, Name, Employee__c, Status__c,
                   Task_Name__c, Due_Date__c,
                   Priority__c, Completion_Date__c
            FROM Onboarding_Task__c
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Service_Request__c> getServiceRequests() {

        return [
            SELECT Id, Name, Request_Number__c, Description__c,
                   Priority__c, Status__c, Request_Type__c,
                   Resolution_Date__c, Employee__c
            FROM Service_Request__c
        ];
    }

    @AuraEnabled
    public static Service_Request__c createServiceRequest(
        String requestName,
        Id employeeId,
        String requestType,
        String description,
        String priority
    ) {

        Service_Request__c newRequest = new Service_Request__c();

        newRequest.Name = requestName;
        newRequest.Employee__c = employeeId;
        newRequest.Request_Type__c = requestType;
        newRequest.Description__c = description;
        newRequest.Priority__c = priority;
        newRequest.Status__c = 'Waiting for Employee';

        insert newRequest;

        return newRequest;
    }

    @AuraEnabled
    public static Service_Request__c updateServiceRequestStatus(
        Id serviceRequestId,
        String status
    ) {

        Service_Request__c serviceRequest = [
            SELECT Id, Status__c
            FROM Service_Request__c
            WHERE Id = :serviceRequestId
            LIMIT 1
        ];

        serviceRequest.Status__c = status;

        update serviceRequest;

        return serviceRequest;
    }

   @AuraEnabled
    public static Onboarding_Task__c updateOnboardingTaskStatus(
     Id taskId,
     String status
)  {

     Onboarding_Task__c onboardingTask = [
        SELECT Id, Status__c, Completion_Date__c
        FROM Onboarding_Task__c
        WHERE Id = :taskId
        LIMIT 1
     ];

    // Update Status
    onboardingTask.Status__c = status;

    // If task is completed, set today's date
    if (status == 'Completed') {
        onboardingTask.Completion_Date__c = Date.today();
    } 
    // If status is changed to anything else, clear completion date
    else {
        onboardingTask.Completion_Date__c = null;
    }

    update onboardingTask;

    return onboardingTask;
}

}