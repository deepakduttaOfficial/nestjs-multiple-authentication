import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    const PORT = process.env.PORT || 3000;
    await app.listen(3000, () => console.log(`Server running at port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
