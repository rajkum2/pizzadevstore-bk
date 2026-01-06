const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'New York Pizza Dashboard API',
      version: '1.0.0',
      description: 'Complete API documentation for the New York Pizza ordering system with payment tracking using Stripe',
      contact: {
        name: 'API Support',
        email: 'support@newyorkpizza.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3008',
        description: 'Development server'
      },
      {
        url: 'https://api.newyorkpizza.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: your-token-here'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            }
          }
        },
        Pizza: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Pizza name'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              description: 'Quantity ordered'
            },
            price: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Price per pizza'
            }
          },
          required: ['name', 'quantity', 'price']
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Order ID'
            },
            userId: {
              type: 'string',
              description: 'User ID who placed the order'
            },
            pizzas: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Pizza'
              }
            },
            totalAmount: {
              type: 'number',
              format: 'float',
              description: 'Total order amount'
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'paid', 'failed', 'shipped', 'canceled'],
              description: 'Payment status'
            },
            stripeSessionId: {
              type: 'string',
              description: 'Stripe checkout session ID'
            },
            stripePaymentId: {
              type: 'string',
              description: 'Stripe payment intent ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Detailed error information'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Success status'
            },
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
