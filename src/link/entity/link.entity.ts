import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('links')
export class Link {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    url!: string;

    @Column()
    short_url!: string;

    @Column({ default: 0 })
    view!: number;

    @Column({ default: 1 })
    status!: number;
    // 1: active, 0: passive

    @Column({ type: 'datetime', nullable: true })
    deleted_at!: Date | null;

    @CreateDateColumn({ type: 'datetime' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at!: Date;
}
