const swaggerAutogen = require('swagger-autogen')();
const fs = require('fs');

const doc = {
  info: {
    title: 'E-Voting System  API',
    description: 'REST API for E-voting Website'
  },
  host: 'e-voting-system-server.onrender.com'
};

const outputFile = './swagger-output.json';
const routes = ['./index.js'];

// Check if the output file exists
if (fs.existsSync(outputFile)) {
  // Read existing Swagger file
  const existingSwaggerData = require(outputFile);

  // Merge existing Swagger data with generated Swagger data
  const updatedSwaggerData = {
    ...existingSwaggerData,
    ...doc,
    paths: {
      ...existingSwaggerData.paths,
      ...doc.paths
    }
  };

  // Add tags from existing Swagger data to new routes
  routes.forEach(route => {
    if (existingSwaggerData.paths[route]) {
      updatedSwaggerData.paths[route] = {
        ...existingSwaggerData.paths[route],
        tags: existingSwaggerData.paths[route].tags
      };
    }
  });

  // Generate Swagger documentation
  swaggerAutogen(outputFile, routes, updatedSwaggerData);
} else {
  // Generate Swagger documentation from scratch
  swaggerAutogen(outputFile, routes, doc);
}
