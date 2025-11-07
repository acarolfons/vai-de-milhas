import { createTrip } from "../factories/trip-factory";
import * as MilesCalculator from "../../src/services/miles-calculator-service";
import * as DistancesCalculator from "../../src/services/distances-calculator-service";
import { ServiceClass, AffiliateStatus } from "protocols";

describe("miles-calculator-service", () => {
  beforeEach(() => {
    jest
      .spyOn(DistancesCalculator, "calculateDistance")
      .mockImplementation((origin, destination) => {
        if (origin.lat === destination.lat && origin.long === destination.long) return 0;
        return 100;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should calculate miles for ECONOMIC class with BRONZE affiliate and no birthday bonus", () => {
    const trip = createTrip({
      service: ServiceClass.ECONOMIC,
      affiliate: AffiliateStatus.BRONZE,
      date: "2025-06-01",
      miles: false
    });
    const miles = MilesCalculator.calculateMiles(trip);
    expect(miles).toBe(110);
  });

  it("should calculate miles for EXECUTIVE class with GOLD affiliate", () => {
    const trip = createTrip({
      service: ServiceClass.EXECUTIVE,
      affiliate: AffiliateStatus.GOLD,
      date: "2025-06-01",
      miles: false
    });
    const miles = MilesCalculator.calculateMiles(trip);
    expect(miles).toBe(206);
  });

  it("should apply birthday bonus in May", () => {
    const trip = createTrip({
      service: ServiceClass.ECONOMIC_PREMIUM,
      affiliate: AffiliateStatus.SILVER,
      date: "2025-05-15",
      miles: false
    });
    const miles = MilesCalculator.calculateMiles(trip);
    expect(miles).toBe(151);
  });

  it("should return 0 if trip already uses miles", () => {
    const trip = createTrip({ miles: true });
    const miles = MilesCalculator.calculateMiles(trip);
    expect(miles).toBe(0);
  });

  it("should round miles correctly for FIRST_CLASS with PLATINUM and birthday bonus", () => {
    const trip = createTrip({
      service: ServiceClass.FIRST_CLASS,
      affiliate: AffiliateStatus.PLATINUM,
      date: "2025-05-01",
      miles: false
    });
    const miles = MilesCalculator.calculateMiles(trip);
    expect(miles).toBe(300);
  });

  it("should handle very small trips with same origin and destination", () => {
    const trip = createTrip({
      origin: { lat: 0, long: 0 },
      destination: { lat: 0, long: 0 },
      service: ServiceClass.ECONOMIC,
      affiliate: AffiliateStatus.BRONZE,
      date: "2025-06-01",
      miles: false
    });
    const miles = MilesCalculator.calculateMiles(trip);
    expect(miles).toBe(0);
  });
});