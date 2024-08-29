const express = require('express');
const cors = require('cors');
const corsOptions = { origin: "*", credentials: true, optionSuccessStatus: 200 };
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const postRoutes = require('./Routes/postRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const userRoutes = require('./Routes/userRoutes');


const app = express();
dotenv.config();



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.error(err));

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'NeedPost API',
      version: '1.0.0',
      description: 'API documentation for the NeedPost application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./Routes/*.js'], // Path to the API docs
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', userRoutes);

// Define a simple route for testing
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`View documentation at http://localhost:${PORT}/api-docs`);
  })
