const app = require("../../app");
const request = require('supertest');
const { sequelize, User } = require("../../models");
const { testAccountEmail, testAccountPassword } = require("../utils");




describe('POST /api/v1/auth/register', () => {
   beforeAll(async () => {
    await sequelize.authenticate();
   });

   beforeEach( async () => {
    await User.destroy(({where: {}, force: true}))
   });

   afterAll(async  () =>{
    await sequelize.close();
   });


   it('Should successfully register a new user', async () => {

      const res = await request(app).post("/api/v1/auth/register").send({
        email: testAccountEmail,
        password: testAccountPassword
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "User created successfully");
      expect(res.body).toHaveProperty("success",true);

      const userInDB = await User.findOne({where: {email: testAccountEmail}});
      expect(userInDB).toBeDefined();
      expect(userInDB.email).toBe(testAccountEmail);
   });


   it('Should fail if email is already in use', async () => {
    await User.create({
        email: testAccountEmail,
        password: testAccountPassword
        });

        const res = await request(app).post("/api/v1/auth/register").send({
            email: testAccountEmail,
            password: testAccountPassword
        });


        expect(res.statusCode).toBe(409);
        expect(res.body.success).toBe(false)
    });


it('Should fail if email os missing', async() => {
    const res = await request(app).post("/api/v1/auth/register").send({
        password: testAccountPassword
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
});

});
