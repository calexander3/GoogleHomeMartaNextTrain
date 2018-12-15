import { ApiRequestService } from "./api-request";
import { RiderAlertService } from "./rider-alert";

describe("rider alert service", () => {
    it("should return empty message when no alerts are present", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve({alerts: { alert: [] }}));
        let alertService = new RiderAlertService(apiRequestService);
        alertService.GetActiveAlerts()
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('There are no active rider alerts right now.');
            expect(result.displayText).toBe('There are no active rider alerts right now.');
            done();
        });
    });
    it("should return empty message when all alerts are in the past", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve(
            {alerts: { alert: [
                {start: '05/15/2017 12:15:54', expire: '05/15/2018 12:15:54', desc: 'Please stand by while repairs are being conducted'}
            ]}}
        ));
        let alertService = new RiderAlertService(apiRequestService);
        alertService.GetActiveAlerts()
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('There are no active rider alerts right now.');
            expect(result.displayText).toBe('There are no active rider alerts right now.');
            done();
        });
    });
    it("should return empty message when all alerts are in the future", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve(
            {alerts: { alert: [
                {start: '05/15/2098 12:15:54', expire: '05/15/2099 12:15:54', desc: 'Please stand by while repairs are being conducted'}
            ]}}
        ));
        let alertService = new RiderAlertService(apiRequestService);
        alertService.GetActiveAlerts()
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('There are no active rider alerts right now.');
            expect(result.displayText).toBe('There are no active rider alerts right now.');
            done();
        });
    });
    it("should return alert when all alerts are in array form", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve(
                {alerts: { alert: [
                    {start: '05/15/2017 12:15:54', expire: '05/15/2099 12:15:54', desc: 'Please stand by while repairs are being conducted'}
                ]}}
            ));
        let alertService = new RiderAlertService(apiRequestService);
        alertService.GetActiveAlerts()
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('There is 1 active alert. Please stand by while repairs are being conducted.');
            expect(result.displayText).toBe('There is 1 active alert. Please stand by while repairs are being conducted.');
            done();
        });
    });
    it("should return alert when all alert is in property form", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve(
                {alerts: { alert: 
                    {start: '05/15/2017 12:15:54', expire: '05/15/2099 12:15:54', desc: 'Please stand by while repairs are being conducted'}
                }}
            ));
        let alertService = new RiderAlertService(apiRequestService);
        alertService.GetActiveAlerts()
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('There is 1 active alert. Please stand by while repairs are being conducted.');
            expect(result.displayText).toBe('There is 1 active alert. Please stand by while repairs are being conducted.');
            done();
        });
    });
    it("should plurlalize correctly when there are multiple alerts", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve(
                {alerts: { alert: [
                    {start: '05/15/2017 12:15:54', expire: '05/15/2099 12:15:54', desc: 'Please stand by while repairs are being conducted'},
                    {start: '05/15/2017 12:15:54', expire: '05/15/2099 12:15:54', desc: 'Please stand by while more repairs are being conducted'}
                ]}}
            ));
        let alertService = new RiderAlertService(apiRequestService);
        alertService.GetActiveAlerts()
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('There are 2 active alerts. Please stand by while repairs are being conducted. Please stand by while more repairs are being conducted.');
            expect(result.displayText).toBe('There are 2 active alerts. Please stand by while repairs are being conducted. Please stand by while more repairs are being conducted.');
            done();
        });
    });
});