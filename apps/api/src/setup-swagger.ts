import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()

    // .setSchemes('http', 'https')
    .setTitle('API Swagger')
    .setDescription(
      'API Description. [http://localhost:8080](http://localhost:8080)',
    )
    .setVersion('0.0.1')
    .setContact('Aginix', 'www.aginix.tech', 'aginix@aginix.tech')
    .addTag('employees')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/doc', app, document);
}
