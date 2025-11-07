import { Trip, ServiceClass, AffiliateStatus } from "../../src/protocols";
import { faker } from "@faker-js/faker";

export function createTrip(overrides?: Partial<Trip>): Trip {
    return {
        code: faker.string.alphanumeric(6).toUpperCase(),
        origin: {
            lat: Number(faker.location.latitude()),
            long: Number(faker.location.longitude())
        },
        destination: {
            lat: Number(faker.location.latitude()),
            long: Number(faker.location.longitude()),
        },
        miles: faker.datatype.boolean(),
        plane: faker.helpers.arrayElement(["Boeing 737", "Airbus A320", "Boeing 777"]),
        service: faker.helpers.arrayElement([
            ServiceClass.ECONOMIC,
            ServiceClass.EXECUTIVE
        ]),

        affiliate: faker.helpers.arrayElement([
            AffiliateStatus.BRONZE,
            AffiliateStatus.SILVER
        ]),
        date: faker.date.future().toISOString().split("T")[0],
        ...overrides,
    };
}
