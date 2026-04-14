"use strict";

const request = require('supertest');
const app = require('../app');


describe("GET /api/v1/health", () => {
    it("Should return 200 and { status: ok,  message: Server is healthy, }", async () => {
        const res = await request(app).get("/api/v1/health");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "ok");
        expect(res.body).toHaveProperty("message", "Server is healthy");
    });

});
