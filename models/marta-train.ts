export interface MartaTrain {
    DIRECTION: 'N'|'S'|'E'|'W';
    EVENT_TIME: string;
    DESTINATION: string;
    NEXT_ARR: string;
    LINE: 'GOLD'|'BLUE'|'RED'|'Green';
    STATION: string;
    TRAIN_ID: string;
    WAITING_MINUTES: number;
    WAITING_SECONDS: string;
    WAITING_TIME: string;
}