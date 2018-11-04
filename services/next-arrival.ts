import * as Url from 'url';
import { Fulfillment } from "../models/google-home";
import { ApiRequestService } from "./api-request";
import { MartaTrain } from "../models/marta-train";

export class NextArrivalService {
    private martaApiPath = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals?apikey='
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
            this.apiRequestService.getContent<MartaTrain[]>(Url.parse(`${this.martaApiPath}${process.env.API_KEY}`))
            .then(arrivals => {
                let response: string;
                let stationDisplayName = station.split(' ')
                                                .map(i => i[0].toUpperCase() + i.substr(1).toLowerCase())
                                                .join(' ');

                let filteredArrivals = arrivals
                .filter(a =>a.STATION === station && !isNaN(parseInt(a.WAITING_SECONDS)) && parseInt(a.WAITING_SECONDS) > 0)
                .distinct((a: MartaTrain) => a.DIRECTION + a.WAITING_SECONDS + a.DESTINATION);

                filteredArrivals.forEach(a => {
                    a.WAITING_MINUTES = Math.ceil(parseInt(a.WAITING_SECONDS) / 60);
                });

                let destFilter: (a: MartaTrain) => boolean;   
                let trainCriteria: string;                         
                if (destination) {
                    destFilter = ((a: MartaTrain) => a.DESTINATION === destination);
                    trainCriteria = `${destination} bound`
                }
                else if(direction) {
                    destFilter = ((a: MartaTrain) => a.DIRECTION === direction);
                    trainCriteria = `${this.expandDirection(direction)}bound`
                }
                else if (line) {
                    destFilter = ((a: MartaTrain) => a.LINE.toLowerCase() === line.toLowerCase());
                    trainCriteria = `${line} line`
                }

                if (destFilter) {
                    filteredArrivals = filteredArrivals.filter(destFilter);
                
                    if (!filteredArrivals.length) {
                        response = `I'm sorry, I wasn't able to find any ${trainCriteria} trains arriving at ${stationDisplayName}`;
                    }
                    else {
                        response = `The next ${trainCriteria} train will arrive at ${stationDisplayName} in ${filteredArrivals[0].WAITING_MINUTES}` +
                        ` minute${filteredArrivals[0].WAITING_MINUTES > 1 ? 's' : ''}`;

                        if (filteredArrivals.length > 1) {
                            response += ` followed by another in ${filteredArrivals[1].WAITING_MINUTES} minute${filteredArrivals[1].WAITING_MINUTES > 1 ? 's' : ''}`
                        }
                    }
                }
                else {
                    if (!filteredArrivals.length) {
                        response = `I'm sorry, I wasn't able to find any trains arriving at ${stationDisplayName}`;
                    }
                    else {
                        response = `The next train is heading ${this.getHeading(filteredArrivals[0].DESTINATION, filteredArrivals[0].DIRECTION)} and will arrive at ${stationDisplayName} in ${filteredArrivals[0].WAITING_MINUTES}` +
                            ` minute${filteredArrivals[0].WAITING_MINUTES > 1 ? 's' : ''}`;

                        if (filteredArrivals.length > 1) {
                            response += ` followed by another train heading ${this.getHeading(filteredArrivals[1].DESTINATION, filteredArrivals[1].DIRECTION)} in ${filteredArrivals[1].WAITING_MINUTES} minute${filteredArrivals[1].WAITING_MINUTES > 1 ? 's' : ''}`
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