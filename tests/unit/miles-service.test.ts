import { findMiles, saveMiles } from "../../src/repositories/miles-repository";
import prisma from "../../src/database";

jest.mock("../../src/database", () => ({
    miles: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}));

describe("Miles Repository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findMiles", () => {
        it("should call prisma.miles.findUnique with the correct code and return result", async () => {
            const code = "TEST1234";
            const mockResult = { id: 1, code, miles: 100 };

            (prisma.miles.findUnique as jest.Mock).mockResolvedValue(mockResult);

            const result = await findMiles(code);

            expect(prisma.miles.findUnique).toHaveBeenCalledWith({
                where: { code },
            });

            expect(result).toEqual(mockResult);
        });

        it("should return null if miles are not found", async () => {
            (prisma.miles.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await findMiles("NOTFOUND");

            expect(result).toBeNull();
        });
    });

    describe("saveMiles", () => {
        it("should call prisma.miles.create with the correct data and return the created object", async () => {
            const code = "NEWTRIP";
            const miles = 500;
            const mockResult = { id: 2, code, miles };

            (prisma.miles.create as jest.Mock).mockResolvedValue(mockResult);

            const result = await saveMiles(code, miles);

            expect(prisma.miles.create).toHaveBeenCalledWith({
                data: {
                    code,
                    miles,
                },
            });

            expect(result).toEqual(mockResult);
        });
    });
});