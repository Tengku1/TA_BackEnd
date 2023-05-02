import {
  Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('hotel_locations')
export class HotelLocationsEntity {
  @PrimaryGeneratedColumn("increment", { name: 'id' })
  id: number;

  @Column({ 
    type: 'text'
  })
  name: string;
  
  @Column({ type: 'text' })
  country: string;

  @Column({ type: 'text' })
  province: string;

  @Column({ type: 'text', nullable: true })
  latitude: string;

  @Column({ type: 'text', nullable: true })
  longitude: string;

  @Column({ type: 'text', nullable: true })
  area: string;

  @Column({ type: 'text', nullable: true })
  unit: string;

  @Column({ type: 'boolean', default: false })
  is_popular: boolean;

  @Column({ type: 'text', nullable:true })
  image: string;
}