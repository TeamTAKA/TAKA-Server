import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

const port: number = Number(process.env.PORT) || 3000;
app
  .listen(port, () => {
    console.log(`
    ################################################
            Server listening on port: ${port}
    ################################################
  `);
  })
  .on('error', error => {
    console.error(error);
    process.exit(1);
  });
