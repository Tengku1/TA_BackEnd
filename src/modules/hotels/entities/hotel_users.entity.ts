import {
    Column, Entity, PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('hotel_users')
  export class HotelUsersEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ length: 100 })
    name: string;

    @Column({ length: 100 })
    surname: string;

    @Column({ length: 100 })
    email: string;
    
    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text' })
    telephone: string;
  }