import { Item } from "src/items/entities/item.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER'
}

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    username: string;

    @Column({
        nullable: true
    })
    description: string;

    @Column()
    password: string;

    @Column({
        nullable: false,
        default: Role.USER
    })
    role: Role;

    @OneToMany(() => Item, item => item.owner)
    items: Item[];

    @OneToMany(() => Item, item => item.approver)
    approvedItems: Item[];
}

