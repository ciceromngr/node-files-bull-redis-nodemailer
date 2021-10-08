import { Column, CreateDateColumn, PrimaryColumn } from "typeorm"

class Users {

    @PrimaryColumn({
        generated: 'increment',
        type: 'integer'
    })
    readonly id: number

    @Column()
    name: string
    
    @Column()
    email: string

    @CreateDateColumn()
    createdAt: Date
}

export { Users }