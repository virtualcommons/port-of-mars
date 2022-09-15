import { createClient, RedisClient } from "redis";
import { EntityManager } from "typeorm";
export class ServiceProvider {
  constructor(public em: EntityManager) {}


}
