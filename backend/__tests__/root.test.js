import request from "supertest";
import app from "../app";

describe("health check endpoint", () => {
  it("should return healthy status on health check", async () => {
    const mockPrisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    };
    global.prisma = mockPrisma;

    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Healthy");
  });
});
