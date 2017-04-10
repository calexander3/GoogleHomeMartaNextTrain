import * as Url from 'url';
import { Fulfillment } from "../models/google-home";
import { ApiRequestService } from "./api-request";
import { MartaTrain } from "../models/marta-train";

export class NextArrivalService {
    martaApiPath = 'http://developer.itsmarta.com/NextTrainService/RestServiceNextTrain.svc/GetNextTrain/'
    apiRequestService = new ApiRequestService();

    private expandDirection(direction: string): string {
        switch(direction) {
            case 'N':
                return 'north';
            case 'S':
                return 'south';
            case 'E':
                return 'east';
            case 'W':
                return 'west';
        }
    }

    public GetNextArrival(station: string, destination: string, direction: string): Promise<Fulfillment> {
         return new Promise((resolve:any, reject:any) => {
            this.apiRequestService.getContent<MartaTrain[]>(Url.parse(`${this.martaApiPath}${station}`))
            .then(arrivals => {
                let response: string;
                let stationDisplayName = station.replace('%20', ' ')
                                                .split(' ')
                                                .map(i => i[0].toUpperCase() + i.substr(1).toLowerCase())
                                                .join(' ');

                if (destination) {
                    var destFilter = ((a: MartaTrain) => a.HEAD_SIGN === destination);
                    var trainCriteria = `${destination} bound`
                }
                else {
                    var destFilter = ((a: MartaTrain) => a.DIRECTION === direction);
                    var trainCriteria = `${this.expandDirection(direction)} bound`
                }

                var filteredArrivals = arrivals.filter(a => !isNaN(parseInt(a.WAITING_TIME)))
                .filter(destFilter);
                
                if (!filteredArrivals.length) {
                    response = `I'm sorry, I wasn't able to find any ${trainCriteria} trains arriving at ${stationDisplayName} station`;
                }
                else {
                    response = `The next ${trainCriteria} train will arrive at ${stationDisplayName} station in ${filteredArrivals[0].WAITING_TIME}` +
                    ` minute${parseInt(filteredArrivals[0].WAITING_TIME) > 1 ? 's' : ''}`;

                    if (filteredArrivals.length > 1) {
                        response += ` followed by another in ${filteredArrivals[1].WAITING_TIME} minute${parseInt(filteredArrivals[0].WAITING_TIME) > 1 ? 's' : ''}`
                    }
                }

                resolve({
                        source: 'MartaBot',
                        speech: response + '.',
                        displayText: response + '.'
                    });
            })
            .catch(err => reject(err));
         });
    }
}