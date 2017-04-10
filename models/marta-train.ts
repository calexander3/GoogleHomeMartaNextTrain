export interface MartaTrain {
    DIRECTION: 'N'|'S'|'E'|'W';
    EVENT_TIME: string;
    HEAD_SIGN: string;
    NEXT_ARR: string;
    ROUTE: string;
    STOP_NAME: string;
    STOP_TYPE: string;
    WAITING_SECONDS: string;
    WAITING_TIME: string;
}