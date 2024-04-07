import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    UserModule, 
    DocumentModule,
    MongooseModule.forRoot('mongodb://localhost:27017',{dbName : "dbname"})
  ],
})
export class AppModule {}
