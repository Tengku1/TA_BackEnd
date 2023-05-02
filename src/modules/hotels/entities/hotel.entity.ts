import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity("hotels")
export class HotelEntity {
  @PrimaryColumn({ type: "integer" })
  code: number;

  @Column({ type: "text", nullable: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "json", nullable: true })
  country: any;

  @Column({ type: "json", nullable: true })
  state: any;

  @Column({ type: "json", nullable: true })
  destination: any;

  @Column({ type: "json", nullable: true })
  zone: any;

  @Column({ type: "json", nullable: true })
  coordinates: any;

  @Column({ type: "json", nullable: true })
  category: any;

  @Column({ type: "json", nullable: true })
  categoryGroup: any;

  @Column({ type: "json", nullable: true })
  chain: any;

  @Column({ type: "json", nullable: true })
  accommodationType: any;

  @Column({ type: "json", nullable: true })
  boards: any;

  @Column({ type: "json", nullable: true })
  segments: any;

  @Column({ type: "json", nullable: true })
  address: any;

  @Column({ type: "text", nullable: true })
  postalCode: string;

  @Column({ type: "text", nullable: true })
  city: string;

  @Column({ type: "text", nullable: true })
  email: string;

  @Column({ type: "text", nullable: true })
  license: string;

  @Column({ type: "json", nullable: true })
  phones: any;

  @Column({ type: "json", nullable: true })
  rooms: any[];

  @Column({ type: "json", nullable: true })
  facilities: any;

  @Column({ type: "json", nullable: true })
  terminals: any;

  @Column({ type: "json", nullable: true })
  issues: any;

  @Column({ type: "json", nullable: true })
  interestPoints: any;

  @Column({ type: "json", nullable: true })
  images: any;

  @Column({ type: "json", nullable: true })
  wildcards: any;

  @Column({ type: "text", nullable: true })
  web: string;

  @Column({ type: "date" , nullable: true })
  lastUpdate: Date;

  @Column({ type: "text", nullable: true })
  S2C: string;

  @Column({ type: "integer", nullable: true })
  ranking: number;
}
