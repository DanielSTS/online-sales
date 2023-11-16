import { compare, hash } from 'bcrypt';

export async function createHashedPassword(password: string): Promise<string> {
  const saltOrRounds = 10;
  return await hash(password, saltOrRounds);
}

export async function validatePassword(
  password: string,
  passwordHashed: string,
): Promise<boolean> {
  return compare(password, passwordHashed);
}
