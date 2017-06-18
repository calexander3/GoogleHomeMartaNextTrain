import * as Url from 'url';
import { Fulfillment } from "../models/google-home";
import { ApiRequestService } from "./api-request";
import { MartaTrain } from "../models/marta-train";

export class NextArrivalService {
    private martaApiPath = 'http://developer.itsmarta.com/NextTrainService/RestServiceNextTrain.svc/GetNextTrain/'
    private apiRequestService = new ApiRequestService();

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

    private getHeading(destination: string, direction: string): string {
        if (destination) {
            return `toward ${destination} station`;
        }
        else {
            return this.expandDirection(direction);
        }
    }

    public GetNextArrival(station: string, destination: string, direction: string, line: string): Promise<Fulfillment> {
         return new Promise((resolve:any, reject:any) => {
            this.apiRequestService.getContent<MartaTrain[]>(Url.parse(`${this.martaApiPath}${station}`))
            .then(arrivals => {
                let response: string;
                let stationDisplayName = station.replace('%20', ' ')
                                                .split(' ')
                                                .map(i => i[0].toUpperCase() + i.substr(1).toLowerCase())
                                                .join(' ');

                let destFilter: (a: MartaTrain) => boolean;   
                let trainCriteria: string;                         
                if (destination) {
                    destFilter = ((a: MartaTrain) => a.HEAD_SIGN === destination);
                    trainCriteria = `${destination} bound`
                }
                else if(direction) {
                    destFilter = ((a: MartaTrain) => a.DIRECTION === direction);
                    trainCriteria = `${this.expandDirection(direction)}bound`
                }
                else if (line) {
                    destFilter = ((a: MartaTrain) => a.ROUTE.toLowerCase() === line.toLowerCase());
                    trainCriteria = `${line} line`
                }

                let filteredArrivals = arrivals
                .filter(a => !isNaN(parseInt(a.WAITING_TIME)) && parseInt(a.WAITING_TIME) > 0)
                .distinct((a: MartaTrain) => a.DIRECTION + a.WAITING_TIME + a.HEAD_SIGN);

                if (destFilter) {
                    filteredArrivals = filteredArrivals.filter(destFilter);
                
                    if (!filteredArrivals.length) {
                        response = `I'm sorry, I wasn't able to find any ${trainCriteria} trains arriving at ${stationDisplayName} station`;
                    }
                    else {
                        response = `The next ${trainCriteria} train will arrive at ${stationDisplayName} station in ${filteredArrivals[0].WAITING_TIME}` +
                        ` minute${parseInt(filteredArrivals[0].WAITING_TIME) > 1 ? 's' : ''}`;

                        if (filteredArrivals.length > 1) {
                            response += ` followed by another in ${filteredArrivals[1].WAITING_TIME} minute${parseInt(filteredArrivals[1].WAITING_TIME) > 1 ? 's' : ''}`
                        }
                    }
                }
                else {
                    if (!filteredArrivals.length) {
                        response = `I'm sorry, I wasn't able to find any trains arriving at ${stationDisplayName} station`;
                    }
                    else {
                        response = `The next train is heading ${this.getHeading(filteredArrivals[0].HEAD_SIGN, filteredArrivals[0].DIRECTION)} and will arrive at ${stationDisplayName} station in ${filteredArrivals[0].WAITING_TIME}` +
                            ` minute${parseInt(filteredArrivals[0].WAITING_TIME) > 1 ? 's' : ''}`;

                        if (filteredArrivals.length > 1) {
                            response += ` followed by another train heading ${this.getHeading(filteredArrivals[1].HEAD_SIGN, filteredArrivals[1].DIRECTION)} in ${filteredArrivals[1].WAITING_TIME} minute${parseInt(filteredArrivals[1].WAITING_TIME) > 1 ? 's' : ''}`
                        }
                    }
                }

                resolve({
                        source: 'AtlantaRail',
                        speech: response + '.',
                        displayText: response + '.'
                    });
            })
            .catch(err => reject(err));
         });
    }
}