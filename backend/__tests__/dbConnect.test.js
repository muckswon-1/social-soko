"use strict";

const { sequelize } = require("../models");

describe("Database Configuration and Connection", () => {
  beforeAll(() => {
    expect(process.env.NODE_ENV).toBe("test");
    
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("Should be using the test database", () => {
    const activeDb = sequelize.config.database;
    console.log(sequelize.config);
    expect(activeDb).toBe("social_soko_test");
  });

  it("Should be able to connect to the database", async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });
});
