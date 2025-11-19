const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDefinition = require("./swaggerDefinition");
const path = require('path')

const options = {
  swaggerDefinition,
  // Important! This tells swagger-jsdoc where to scan for @swagger blocks
  apis: [
    path.join(__dirname, '../server.js'),
    path.join(__dirname,'../routes/**/*.js'),
    path.join(__dirname,"../admin/routes/**/*.js")
   
  ],
};

const swaggerSpec = swaggerJSDoc(options);

console.log("Swagger paths:", Object.keys(swaggerSpec.paths || {})); 

module.exports = swaggerSpec;
