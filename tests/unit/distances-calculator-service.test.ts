import * as DistancesCalculator from "../../src/services/distances-calculator-service"

describe("distance-calculator-service", () => {
    describe("toRadius", () => {
        it("should convert degrees to radians correctly", () => {
            const result = DistancesCalculator.toRadius(180)
            expect(result).toBeCloseTo(Math.PI)
        })

        it("should return 0 when angle is 0", () => {
            const result = DistancesCalculator.toRadius(0);
            expect(result).toBe(0)
        })
    })

    it("should calculate distance between two points in km", () => {
        const origin = { lat: 0, long: 0 }
        const destination = { lat: 0, long: 1 }

        const distance = DistancesCalculator.calculateDistance(origin, destination);

        expect(distance).toBeCloseTo(111, 0)
    });

    it("should return 0 if origin and destination are the same", () => {
        const point = { lat: 10, long: 10 }
        const distance = DistancesCalculator.calculateDistance(point, point)

        expect(distance).toBe(0)
    })

    it("should calculate distance in miles if isMiles=true", () => {
        const origin = { lat: 0, long: 0 }
        const destination = { lat: 0, long: 1 }

        const distance = DistancesCalculator.calculateDistance(origin, destination, true);

        expect(distance).toBeCloseTo(69, 0);
    })
})