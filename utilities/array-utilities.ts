export {}
declare global {
    interface Array<T> {
        distinct(produceKey: Function) : T[]
    }
}

Array.prototype.distinct = function(produceKey: Function) {
    let keys: any[] = [];
    let result: any[] = [];
    this.forEach((element: any) => {
        let key = produceKey(element);
        if (!keys.includes(key)) {
            keys.push(key);
            result.push(element);
        }
    });
    return result;
}