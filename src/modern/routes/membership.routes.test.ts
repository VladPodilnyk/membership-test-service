import request from "supertest";
import express from "express";
import membershipRoutes from "./membership.routes";
import db from "../repository/db";

// Mock the database
jest.mock("../repository/db", () => ({
  memberships: [],
  membershipPeriods: [],
}));

const app = express();
app.use(express.json());
app.use("/memberships", membershipRoutes);

describe("Membership Routes", () => {
  beforeEach(() => {
    db.memberships = [];
    db.membershipPeriods = [];
  });

  describe("GET /memberships", () => {
    it("should return all memberships with their periods", async () => {
      const testMembership = {
        id: 1,
        uuid: "test-uuid-1",
        name: "Test Membership 1",
        userId: 200,
        recurringPrice: 50,
        validFrom: new Date("2024-01-01"),
        validUntil: new Date("2024-07-01"),
        state: "active" as const,
        assignedBy: "system",
        paymentMethod: "credit card" as const,
        billingInterval: "monthly" as const,
        billingPeriods: 6,
      };

      const testPeriod = {
        id: 1,
        uuid: "period-uuid-1",
        membership: 1,
        start: new Date("2024-01-01"),
        end: new Date("2024-02-01"),
        state: "planned" as const,
      };

      db.memberships.push(testMembership);
      db.membershipPeriods.push(testPeriod);

      const response = await request(app).get("/memberships").expect(200);

      // Expected response structure
      const expectedResponse = [
        {
          membership: {
            id: 1,
            uuid: "test-uuid-1",
            name: "Test Membership 1",
            userId: 200,
            recurringPrice: 50,
            validFrom: "2024-01-01T00:00:00.000Z",
            validUntil: "2024-07-01T00:00:00.000Z",
            state: "active",
            assignedBy: "system",
            paymentMethod: "credit card",
            billingInterval: "monthly",
            billingPeriods: 6,
          },
          periods: [
            {
              id: 1,
              uuid: "period-uuid-1",
              membership: 1,
              start: "2024-01-01T00:00:00.000Z",
              end: "2024-02-01T00:00:00.000Z",
              state: "planned",
            },
          ],
        },
      ];

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe("POST /memberships", () => {
    describe("successful creation", () => {
      it("should create a membership and return 201 with data", async () => {
        const membershipData = {
          name: "Premium Monthly",
          recurringPrice: 99.99,
          paymentMethod: "credit card",
          billingInterval: "monthly",
          billingPeriods: 6,
        };

        const response = await request(app)
          .post("/memberships")
          .send(membershipData)
          .expect(201);

        // Expected membership object
        const expectedMembership = {
          id: 1,
          uuid: expect.any(String),
          name: "Premium Monthly",
          userId: 2000,
          recurringPrice: 99.99,
          validFrom: expect.any(String),
          validUntil: expect.any(String),
          state: "active",
          assignedBy: "system",
          paymentMethod: "credit card",
          billingInterval: "monthly",
          billingPeriods: 6,
        };

        expect(db.memberships).toHaveLength(1);
        expect(response.body.membership).toEqual(expectedMembership);
        expect(response.body.membershipPeriods).toHaveLength(6);
        for (let i = 0; i < response.body.membershipPeriods.length; i++) {
          const period = response.body.membershipPeriods[i];
          expect(period).toEqual({
            id: i + 1,
            uuid: expect.any(String),
            membership: db.memberships[0].id,
            start: expect.any(String),
            end: expect.any(String),
            state: "planned",
          });
        }
      });
    });

    describe("validation errors", () => {
      it("should return 400 for missing mandatory fields", async () => {
        const invalidData = {
          recurringPrice: 50,
          billingInterval: "monthly",
          billingPeriods: 6,
        };

        const response = await request(app)
          .post("/memberships")
          .send(invalidData)
          .expect(400);

        expect(response.body).toEqual({ message: "missingMandatoryFields" });
      });

      it("should return 400 for negative recurring price", async () => {
        const invalidData = {
          name: "Test Membership",
          recurringPrice: -10,
          billingInterval: "monthly",
          billingPeriods: 6,
        };

        const response = await request(app)
          .post("/memberships")
          .send(invalidData)
          .expect(400);

        expect(response.body).toEqual({ message: "negativeRecurringPrice" });
      });

      it("should return 400 for cash payment with price > 100", async () => {
        const invalidData = {
          name: "Test Membership",
          recurringPrice: 150,
          paymentMethod: "cash",
          billingInterval: "monthly",
          billingPeriods: 6,
        };

        const response = await request(app)
          .post("/memberships")
          .send(invalidData)
          .expect(400);

        expect(response.body).toEqual({ message: "cashPriceBelow100" });
      });

      it("should return 400 for invalid billing interval", async () => {
        const invalidData = {
          name: "Test Membership",
          recurringPrice: 50,
          billingInterval: "invalid",
          billingPeriods: 6,
        };

        const response = await request(app)
          .post("/memberships")
          .send(invalidData)
          .expect(400);

        expect(response.body).toEqual({ message: "invalidBillingPeriods" });
      });

      it("should return 400 for monthly periods > 12", async () => {
        const invalidData = {
          name: "Test Membership",
          recurringPrice: 50,
          billingInterval: "monthly",
          billingPeriods: 15,
        };

        const response = await request(app)
          .post("/memberships")
          .send(invalidData)
          .expect(400);

        expect(response.body).toEqual({
          message: "billingPeriodsMoreThan12Months",
        });
      });

      it("should return 400 for monthly periods < 6", async () => {
        const invalidData = {
          name: "Test Membership",
          recurringPrice: 50,
          billingInterval: "monthly",
          billingPeriods: 3,
        };

        const response = await request(app)
          .post("/memberships")
          .send(invalidData)
          .expect(400);

        expect(response.body).toEqual({
          message: "billingPeriodsLessThan6Months",
        });
      });

      it("should return 400 for yearly periods > 10", async () => {
        const invalidData = {
          name: "Test Membership",
          recurringPrice: 50,
          billingInterval: "yearly",
          billingPeriods: 15,
        };

        const response = await request(app)
          .post("/memberships")
          .send(invalidData)
          .expect(400);

        expect(response.body).toEqual({
          message: "billingPeriodsMoreThan10Years",
        });
      });

      it("should return 400 for yearly periods < 3", async () => {
        const invalidData = {
          name: "Test Membership",
          recurringPrice: 50,
          billingInterval: "yearly",
          billingPeriods: 2,
        };

        const response = await request(app)
          .post("/memberships")
          .send(invalidData)
          .expect(400);

        expect(response.body).toEqual({
          message: "billingPeriodsLessThan3Years",
        });
      });
    });
  });
});
