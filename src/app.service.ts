import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Go to the <a href="/graphql">playground</a>';
  }
}
