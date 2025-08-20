import { INestApplication } from '@nestjs/common';

let app: INestApplication;

const setApp = (application: INestApplication) => {
  app = application;
};

export { app, setApp };
