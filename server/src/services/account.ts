import {User} from "@/entity/User";
import jwt from "jsonwebtoken";
import {getConnection} from "@/util";
import * as fs from "fs";

export const JWT_SECRET: string = fs.readFileSync('/run/secrets/jwt', 'utf8').trim();

export async function getUserByJWT(token: string): Promise<User | undefined> {
  const decoded = await jwt.verify(token, JWT_SECRET);
  const username = (decoded as any).username;
  return getUserByUsername(username);
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  return await getConnection().getRepository(User).findOne({username})
}