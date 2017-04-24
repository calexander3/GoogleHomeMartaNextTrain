import * as Url from 'url';
import * as moment from 'moment-timezone'
import { Fulfillment } from "../models/google-home";
import { ApiRequestService } from "./api-request";
import { RiderAlert } from "../models/rider-alert"

export class RiderAlertService {
    private alertsPath = 'http://developer.itsmarta.com/service_alerts.xml';
    private apiRequestService = new ApiRequestService();

    public GetActiveAlerts(): Promise<Fulfillment> {
        return new Promise((resolve:any, reject:any) => {
            this.apiRequestService.getContent<{alerts: {alert: RiderAlert[]} }>(Url.parse(this.alertsPath))
            .then(alertsCollection => {
                let now = moment();
                let currentAlerts = alertsCollection.alerts.alert
                .filter(alert => {
                    let alertStart = moment.tz(alert.start, 'MM/DD/YYYY HH:mm:ss', 'America/New_York');
                    let alertExpire = moment.tz(alert.expire, 'MM/DD/YYYY HH:mm:ss', 'America/New_York');
                    return alertStart.isBefore(now) && alertExpire.isAfter(now);
                });

                let response = 'There are no active rider alerts right now'

                if (currentAlerts.length) {
                    response = `There ${currentAlerts.length > 1 ? 'are' : 'is'} ${currentAlerts.length} active alert${currentAlerts.length > 1 ? 's' : ''}`
                    currentAlerts.forEach(alert =>{
                        response += '. ' + alert.desc.split('\"').join('').split('\r').join('').split('\n').join('');
                    });
                }

                resolve({
                    source: 'AtlantaRail',
                    speech: response + '.',
                    displayText: response + '.'
                });
            });
        });
    }
}