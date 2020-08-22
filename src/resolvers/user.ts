import { Resolver, Arg, InputType, Field, Mutation, Ctx, ObjectType } from 'type-graphql';
import { MyContext } from 'src/types';
import argon2 from 'argon2'
import { User } from '../entities/User';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}
@ObjectType()
class UserResponse {
    @Field(()=> [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field( () => User, {nullable: true} )
    user?: User
}


@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg("options", ()=> UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
     ) : Promise<UserResponse> {
        if (options.username.length <= 2) {
                return {
                    errors: [{
                        field: "username",
                        message: "username has to be longer than 2 characters"
                    },
                ],
            }
        }
        if (options.password.length < 3) {
            return {
                errors: [{
                    field: "password",
                    message: "password has to be longer than 3 characters"
                },
            ],
            }
        }
        const hashedPassword = await argon2.hash(options.password)

        const user = em.create(User, { 
            username: options.username,
            password: hashedPassword
         });

        try {
            await em.persistAndFlush(user)
            return { user };

        } catch(err) {
            if (err.code === '23505'){
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'username already taken '
                        }
                    ]
                }
            }
        }
    }
}

@Resolver()
export class LoginResolver {
    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
     ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username})
        if (!user) {
            return {
                errors: [{
                    field: "username",
                    message: "username does not exist"
                },
            ],

            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                    errors: [{
                        field: "password",
                        message: "invalid password"
                    },
                ],
            };
        }

        return {user,}
    }
}