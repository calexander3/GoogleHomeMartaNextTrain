import { ApiRequestService } from "./api-request";
import { NextArrivalService } from "./next-arrival";

describe("next arrival service", () => {
    it("should return empty message when no trains are present", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve([]));
        let arrivalService = new NextArrivalService(apiRequestService);
        arrivalService.GetNextArrival('MIDTOWN STATION','','','')
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('I\'m sorry, I wasn\'t able to find any trains arriving at Midtown Station.');
            expect(result.displayText).toBe('I\'m sorry, I wasn\'t able to find any trains arriving at Midtown Station.');
            done();
        });
    });
    it("should return empty message when no trains are present with filter", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve([
            {STATION: 'MIDTOWN STATION', LINE:'GOLD', WAITING_MINUTES: 1, WAITING_SECONDS: 60}
        ]));
        let arrivalService = new NextArrivalService(apiRequestService);
        arrivalService.GetNextArrival('MIDTOWN STATION','','','Red')
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('I\'m sorry, I wasn\'t able to find any Red line trains arriving at Midtown Station.');
            expect(result.displayText).toBe('I\'m sorry, I wasn\'t able to find any Red line trains arriving at Midtown Station.');
            done();
        });
    });
    it("should return train when a train is present with filter", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve([
            {STATION: 'MIDTOWN STATION', LINE:'RED', DIRECTION: 'S',  WAITING_MINUTES: 1, WAITING_SECONDS: 60}
        ]));
        let arrivalService = new NextArrivalService(apiRequestService);
        arrivalService.GetNextArrival('MIDTOWN STATION','','','Red')
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('The next Red line train will arrive at Midtown Station in 1 minute.');
            expect(result.displayText).toBe('The next Red line train will arrive at Midtown Station in 1 minute.');
            done();
        });
    });
    it("should pluralize properly when a train is more than one minute away", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve([
            {STATION: 'MIDTOWN STATION', LINE:'RED', DIRECTION: 'S',  WAITING_MINUTES: 2, WAITING_SECONDS: 120}
        ]));
        let arrivalService = new NextArrivalService(apiRequestService);
        arrivalService.GetNextArrival('MIDTOWN STATION','','','Red')
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('The next Red line train will arrive at Midtown Station in 2 minutes.');
            expect(result.displayText).toBe('The next Red line train will arrive at Midtown Station in 2 minutes.');
            done();
        });
    });
    it("should return multiple trains when more than one train matches the filter", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve([
            {STATION: 'MIDTOWN STATION', LINE:'RED', DIRECTION: 'S', WAITING_MINUTES: 1, WAITING_SECONDS: 60},
            {STATION: 'MIDTOWN STATION', LINE:'RED', DIRECTION: 'S',  WAITING_MINUTES: 10, WAITING_SECONDS: 600}
        ]));
        let arrivalService = new NextArrivalService(apiRequestService);
        arrivalService.GetNextArrival('MIDTOWN STATION','','','Red')
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('The next Red line train will arrive at Midtown Station in 1 minute followed by another in 10 minutes.');
            expect(result.displayText).toBe('The next Red line train will arrive at Midtown Station in 1 minute followed by another in 10 minutes.');
            done();
        });
    });
    it("should filter properly by station", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve([
            {STATION: 'MIDTOWN STATION', LINE:'RED', DIRECTION: 'S', WAITING_MINUTES: 1, WAITING_SECONDS: 60},
            {STATION: 'FIVE POINTS STATION', LINE:'RED', DIRECTION: 'S',  WAITING_MINUTES: 10, WAITING_SECONDS: 600}
        ]));
        let arrivalService = new NextArrivalService(apiRequestService);
        arrivalService.GetNextArrival('MIDTOWN STATION','','','Red')
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('The next Red line train will arrive at Midtown Station in 1 minute.');
            expect(result.displayText).toBe('The next Red line train will arrive at Midtown Station in 1 minute.');
            done();
        });
    });
    it("should filter properly by direction", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve([
            {STATION: 'MIDTOWN STATION', LINE:'RED', DIRECTION: 'N', WAITING_MINUTES: 1, WAITING_SECONDS: 60},
            {STATION: 'MIDTOWN STATION', LINE:'RED', DIRECTION: 'S',  WAITING_MINUTES: 10, WAITING_SECONDS: 600}
        ]));
        let arrivalService = new NextArrivalService(apiRequestService);
        arrivalService.GetNextArrival('MIDTOWN STATION','','N','')
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('The next northbound train will arrive at Midtown Station in 1 minute.');
            expect(result.displayText).toBe('The next northbound train will arrive at Midtown Station in 1 minute.');
            done();
        });
    });
    it("should filter properly by line", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve([
            {STATION: 'MIDTOWN STATION', LINE:'RED', DIRECTION: 'S', WAITING_MINUTES: 1, WAITING_SECONDS: 60},
            {STATION: 'MIDTOWN STATION', LINE:'GOLD', DIRECTION: 'S',  WAITING_MINUTES: 10, WAITING_SECONDS: 600}
        ]));
        let arrivalService = new NextArrivalService(apiRequestService);
        arrivalService.GetNextArrival('MIDTOWN STATION','','','Red')
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('The next Red line train will arrive at Midtown Station in 1 minute.');
            expect(result.displayText).toBe('The next Red line train will arrive at Midtown Station in 1 minute.');
            done();
        });
    });
    it("should filter properly by destination", (done: any) => {
        let apiRequestService = new ApiRequestService();
        spyOn(apiRequestService, 'getContent').and.returnValue(Promise.resolve([
            {STATION: 'MIDTOWN STATION', LINE:'GOLD', DIRECTION: 'N', DESTINATION: 'Doraville', WAITING_MINUTES: 1, WAITING_SECONDS: 60},
            {STATION: 'MIDTOWN STATION', LINE:'RED', DIRECTION: 'N', DESTINATION: 'North Springs',  WAITING_MINUTES: 10, WAITING_SECONDS: 600}
        ]));
        let arrivalService = new NextArrivalService(apiRequestService);
        arrivalService.GetNextArrival('MIDTOWN STATION','Doraville','','')
        .then((result) => {
            expect(result.source).toBe('AtlantaRail');
            expect(result.speech).toBe('The next Doraville bound train will arrive at Midtown Station in 1 minute.');
            expect(result.displayText).toBe('The next Doraville bound train will arrive at Midtown Station in 1 minute.');
            done();
        });
    });
});