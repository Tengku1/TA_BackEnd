import {
    Column, Entity, PrimaryColumn, PrimaryGeneratedColumn
  } from 'typeorm';
  
  @Entity('hotel_orders')
  export class HotelOrderEntity {
    @PrimaryColumn("text")
    id: string;

    @Column({ type: 'text' })
    hotel_id: string;

    @Column({ type: 'text' })
    rooms: string;

    @Column({ type: 'text' })
    hotel_name: string;

    @Column({ type: 'text' })
    pending_amount: string;

    @Column({ type: 'text' })
    cancellationPolicies: string;

    @Column({ type: 'text' })
    image: string;

    @Column({ type: 'text' })
    check_in: string;

    @Column({ type: 'text' })
    check_out: string;

    @Column({ type: 'text' })
    status: string;
  }