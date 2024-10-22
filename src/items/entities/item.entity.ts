import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({
        nullable: false,
    })
    owner_id: number;

    @ManyToOne(() => User, user => user.items)
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @Column({
        nullable: true,
    })
    approver_id: number;
    @ManyToOne(() => User, user => user.approvedItems)
    @JoinColumn({ name: 'approver_id' })
    approver: User;


    @Column({
        nullable: false,
        default: new Date()
    })
    created_at: Date;

    @Column({
        nullable: true,
        default: new Date()
    })
    updated_status_at: Date;
}