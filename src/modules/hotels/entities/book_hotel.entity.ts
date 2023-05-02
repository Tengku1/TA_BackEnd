import {
  Column, Entity, PrimaryColumn
} from 'typeorm';

@Entity('hotels_book_hotel')
export class HotelBookHotelEntity {
  @PrimaryColumn()
  code: number;

  @Column({ type: 'text' })
  check_in: string;
  
  @Column({ type: 'text' })
  check_out: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  category_code: string;
  
  @Column({ type: 'text' })
  category_name: string;

  @Column({ type: 'text' })
  destination_code: string;

  @Column({ type: 'text' })
  destination_name: string;

  @Column({ type: 'integer' })
  zone_code: number;

  @Column({ type: 'text' })
  zone_name: string;

  @Column({ type: 'text' })
  latitude: string;

  @Column({ type: 'text' })
  longitude: string;

  @Column({ type: 'json', nullable: true })
  rooms: any;
}