import supertest from "supertest";
import app from "../../src/app";
import httpStatus from "http-status";
import { createTrip } from "../factories/trip-factory";
import prisma from "../../src/database";

const api = supertest(app);

beforeEach(async () => {
  await prisma.miles.deleteMany({});
}, 20000);

afterEach(async () => {
    jest.restoreAllMocks(); 
});

describe("POST /miles", () => {
  it("should respond with status 422 if body is incomplete (missing origin)", async () => {
    const incompleteBody = {
      code: "TRIP123",
      destination: { lat: 1, long: 1 },
      miles: false,
      plane: "B737",
      service: "ECONOMIC",
      affiliate: "BRONZE",
      date: "2025-06-01",
    };

    const response = await api.post("/miles").send(incompleteBody);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 201 and generated miles for a valid trip", async () => {
    const validTrip = createTrip({ code: "VALID201", miles: false });
    const response = await api.post("/miles").send(validTrip);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual(
      expect.objectContaining({
        code: "VALID201",
        miles: expect.any(Number), 
      })
    );
    const persistedMiles = await prisma.miles.findUnique({ where: { code: "VALID201" } });
    expect(persistedMiles).not.toBeNull();
  });

  it("should respond with status 409 if miles already exist for the code", async () => {
    const existingCode = "CONFLICT409";
    await prisma.miles.create({ data: { code: existingCode, miles: 50 } });

    const tripWithConflict = createTrip({ code: existingCode, miles: false });

    const response = await api.post("/miles").send(tripWithConflict);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it("should respond with status 500 when an unexpected server error occurs", async () => {
    jest.spyOn(prisma.miles, 'create').mockRejectedValue(new Error('Simulated Database Connection Error'));

    const validTrip = createTrip({ code: "ERROR500", miles: false });

    const response = await api.post("/miles").send(validTrip);

    expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    
    expect(response.body).toEqual({}); 
  });
});

describe("GET /miles/:code", () => {
  it("should respond with status 404 when code is not found", async () => {
    const response = await api.get("/miles/NOTFOUND404");

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should respond with status 200 and the miles object when code exists", async () => {
    const existingCode = "FOUND200";
    const expectedMiles = 1500;
    const createdMiles = await prisma.miles.create({ data: { code: existingCode, miles: expectedMiles } });

    const response = await api.get(`/miles/${existingCode}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      id: createdMiles.id,
      code: existingCode,
      miles: expectedMiles,
    });
  });
});