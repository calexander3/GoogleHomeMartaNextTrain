import * as Url from 'url';
import { Fulfillment } from "../models/google-home";
import { ApiRequestService } from "./api-request";
import { RiderAlert } from "../models/rider-alert"

export class RiderAlertService {
    private alertsPath = 'http://developer.itsmarta.com/service_alerts.xml';
    private apiRequestService = new ApiRequestService();

    public GetActiveAlerts(): Promise<RiderAlert[]> {
        return new Promise((resolve:any, reject:any) => {
            this.apiRequestService.getContent<{alerts: {alert: RiderAlert[]} }>(Url.parse(this.alertsPath))
            .then(alertsCollection => {
                console.log(JSON.stringify(alertsCollection.alerts.alert));
                resolve([]);
            });
        });
    }
}