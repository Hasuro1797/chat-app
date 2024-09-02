import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
  @Length(3, 20, {
    message: 'Username must be between 3 and 20 characters long',
  })
  @IsNotEmpty({ message: 'Username should not be empty.' })
  username: string;

  @IsString({ message: 'Password must be a string' })
  @Length(8, undefined, {
    message: 'Password must be at least 8 characters long',
  })
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @Matches(/^(?=.*[A-Z])(?=.*[^\w\s#<>]).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one special character (excluding #, <, >), and be at least 8 characters long',
  })
  password: string;
}
