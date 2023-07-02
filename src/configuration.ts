import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { name, version } from '../package.json';

export default () => ({
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    PORT: parseInt(process.env.PORT, 10) || 3000,
    IS_DEVELOPER: process.env.IS_DEVELOPER == "true" ? true : false,

    HOTELS_BASE_URL: process.env.HOTELS_BASE_URL || null,
    HOTELS_API_KEY: process.env.HOTELS_API_KEY || null,
    HOTELS_API_PATH: process.env.HOTELS_API_PATH || null,
    HOTELS_SECRET_KEY: process.env.HOTELS_SECRET || null,
    HOTELS_CONTENT_API_PATH: process.env.HOTELS_CONTENT_API_PATH || null,
    HOTELS_CONTENT_TYPES_API_PATH: process.env.HOTELS_CONTENT_TYPES_API_PATH || null,
    HOTELS_GEOLOCATION_RADIUS: process.env.HOTELS_GEOLOCATION_RADIUS || null,
    HOTELS_GEOLOCATION_UNIT: process.env.HOTELS_GEOLOCATION_UNIT || null,
    HOTELS_LIST_LIMIT: process.env.HOTELS_LIST_LIMIT || null,
    ADMIN_HOTEL_LIST_LIMIT: process.env.ADMIN_HOTEL_LIST_LIMIT || null,

    // TODO: CHANGE THIS TO NULL
    ANDROID_APP_PACKAGE_NAME: process.env.ANDROID_APP_PACKAGE_NAME || null,

    database: {
        applicationName: `${name}_${version}`,
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: true,
        logging: (process.env.IS_DEVELOPER == 'true'),
        entities: ["dist/**/*.entity{.ts,.js}"],
        subscribers: ["dist/**/*.subscriber{.ts,.js}"],
        migrations: ["dist/migrations/*{.ts,.js}"],
        migrationsRun: false,
    } as TypeOrmModuleOptions,
});