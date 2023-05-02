import {
  Column, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('hotel_config')
export class HotelConfigurationsEntity {
  @PrimaryGeneratedColumn("increment", { name: 'id' })
  id: number;

  @Column({ type: 'integer' })
  percentage_fee: number;
}