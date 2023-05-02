import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { HotelBookHotelEntity } from './book_hotel.entity';

@Entity('hotels_book')
export class HotelBookingsEntity {
  @PrimaryColumn()
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

  @Column({ type: 'integer', default: 1 })
  totalGuest: number;

  @Column({ type: 'text', nullable:true })
  image: string;

  @Column("decimal", { scale: 2 })
  total_net: number;

  @Column({ type: 'text' })
  pending_amount: string;

  @Column("decimal", { scale: 2 , default: 0})
  net: number;

  @Column({ type: 'text' })
  currency: string;

  @Column({ type: 'decimal', default: 0 })
  fee: number;

  @Column({ type: 'boolean', default: false })
  hotel_mandatory_rate: boolean;

  @Column({ type: 'text', default: 'UNKOWN' })
  payment_status: string;

  @Column({ type: 'text', default:"HOTELBEDS" })
  vendor: string;

  @Column({ type: 'date', default: () => "CURRENT_TIMESTAMP"})
  created_at: Date;

  @Column({ type: 'date', default: () => "CURRENT_TIMESTAMP"})
  update_at: Date;

  @ManyToOne(() => HotelBookHotelEntity, bookHotel => bookHotel.code , { cascade: true })
  @JoinColumn()
  hotel?: HotelBookHotelEntity;

}