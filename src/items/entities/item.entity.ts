import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ItemStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('decimal')
    amount: number;

    @Column('int')
    quantity: number;

    @Column({
        nullable: false,
        default: ItemStatus.PENDING
    })
    status: ItemStatus;
}