export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Portfolio API',
    version: '1.0.0',
    description: 'API documentation for the Portfolio server',
  },
  servers: [
    {
      url: 'http://localhost:8080/api',
      description: 'Local development server',
    },
  ],
  paths: {
    '/portfolio': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get portfolio data',
        responses: {
          '200': {
            description: 'Portfolio data retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Portfolio',
                },
              },
            },
          },
          '404': {
            description: 'Portfolio not found',
          },
          '500': {
            description: 'Server error',
          },
        },
      },
      put: {
        tags: ['Portfolio'],
        summary: 'Update portfolio data',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Portfolio',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Portfolio updated successfully',
          },
          '400': {
            description: 'Invalid input',
          },
          '500': {
            description: 'Server error',
          },
        },
      },
      post: {
        tags: ['Portfolio'],
        summary: 'Create portfolio data',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Portfolio',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Portfolio created successfully',
          },
          '400': {
            description: 'Invalid input or portfolio already exists',
          },
          '500': {
            description: 'Server error',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Portfolio: {
        type: 'object',
        required: ['personalInfo', 'about', 'experience', 'projects', 'certifications'],
        properties: {
          personalInfo: {
            type: 'object',
            required: ['name', 'title', 'bio', 'email', 'github', 'linkedin', 'portfolio'],
            properties: {
              name: { type: 'string' },
              title: { type: 'string' },
              bio: { type: 'string' },
              email: { type: 'string', format: 'email' },
              github: { type: 'string', format: 'uri' },
              linkedin: { type: 'string', format: 'uri' },
              portfolio: { type: 'string', format: 'uri' },
            },
          },
          about: {
            type: 'object',
            required: [
              'description',
              'skills',
              'interests',
              'currentFocus',
              'education',
              'funFacts',
            ],
            properties: {
              description: { type: 'string' },
              currentFocus: { type: 'string' },
              funFacts: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
  },
};
