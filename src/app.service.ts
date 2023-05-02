import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { version } from '../package.json';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }

  hello() {
    return { message: `xplorin v${version}` };
  }

  async test_env() {
    let isDev = process.env.IS_DEVELOPER == "true" ? true : false;

    if (isDev) {
      return {
        //IS_DEVELOPER: isDev,
        BASE_URL: this.configService.get('BASE_URL'),
        NODE_ENV: this.configService.get('NODE_ENV'),
      };
    } else {
      return {
        BASE_URL: this.configService.get('BASE_URL'),
        NODE_ENV: this.configService.get('NODE_ENV'),
      }
    }

  }
}