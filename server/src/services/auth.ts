import {User} from "@/entity/User";
import jwt from "jsonwebtoken";
import {getUserByUsername} from "@/services/account"
import * as fs from "fs";
import { Response } from "express";

export const JWT_SECRET: string = fs.readFileSync('/run/secrets/jwt', 'utf8').trim();

export async function getUserByJWT(token: string): Promise<User | undefined> {
  const decoded = await jwt.verify(token, JWT_SECRET);
  const username = (decoded as any).username;
  return getUserByUsername(username);
}

export function authenticate(username: string): Promise<User | undefined> {
    return Promise.resolve(undefined);
}

export function generateJWT(username: string): string {
    return jwt.sign({ username }, JWT_SECRET, { expiresIn: '12h' })
}

export function setJWTCookie(res: Response, username: string): any {
    const expiration = 604800000;
    return res.cookie('jwt', generateJWT(username), {
        expires: new Date(Date.now() + expiration),
        secure: true,
        httpOnly: false,
    });
}