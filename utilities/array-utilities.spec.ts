import './array-utilities';

describe("distinct", () => {
    it("should remove duplicate entries", () => {
        let testArr = [
            {key: 1},
            {key: 2},
            {key: 3},
            {key: 3},
            {key: 3}
        ];
        expect(testArr.distinct((x: {key:number}) => x.key).length).toBe(3);
        expect(testArr.distinct((x: {key:number}) => x.key)[0].key).toBe(1);
        expect(testArr.distinct((x: {key:number}) => x.key)[1].key).toBe(2);
        expect(testArr.distinct((x: {key:number}) => x.key)[2].key).toBe(3);
    });
});