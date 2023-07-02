import {
  Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('hotels_book')
export class HotelBookingsEntity {
  @PrimaryGeneratedColumn("uuid")
  booking_reference_code: string;

  @Column({ type: 'text' })
  user: string;

  @Column({ type: 'text' , nullable: true})
  phone: string;

  @Column({ type: 'text' , nullable: true})
  email: string;

  @Column({ type: 'text' })
  clientReference: string;

  @Column({ type: 'text' , nullable: true})
  remark: string;

  @Column({ type: 'text' })
  status: string;

  @Column({ type: 'text' })
  holder_name: string;

  @Column({ type: 'text' })
  holder_surname: string;

  @Column({ type: 'text' })
  pending_amount: string;

  @Column("decimal", { scale: 2 , default: 0})
  net: number;

  @Column({ type: 'text' })
  currency: string;

  @Column({ type: 'text', default: 'UNKOWN' })
  payment_status: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'text' })
  hotel: string;

  @Column({ type: 'date', default: () => "CURRENT_TIMESTAMP"})
  created_at: Date;

  @Column({ type: 'date', default: () => "CURRENT_TIMESTAMP"})
  update_at: Date;
}