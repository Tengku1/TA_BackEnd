import {
  Column, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('hotels_book_hotel')
export class HotelBookHotelEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({type: 'integer'})
  code: number;

  @Column({ type: 'text' })
  rateKey: string;

  @Column({ type: 'text' })
  check_in: string;
  
  @Column({ type: 'text' })
  check_out: string;

  @Column({ type: 'text' })
  paxId: string;

  @Column({ type: 'text' })
  roomType: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  category_name: string;

  @Column({ type: 'text' })
  destination_name: string;

  @Column({ type: 'text' })
  zone_name: string;

  @Column({ type: 'text' })
  latitude: string;

  @Column({ type: 'text' })
  longitude: string;

  @Column({ type: 'json', nullable: true })
  rooms: any;
}