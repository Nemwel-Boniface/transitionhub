import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

/**
 * TransitionHub data layer.
 *
 * In production, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * and this talks to real Upstash Redis over REST (one HTTP call per
 * command - see REDIS.md for the rationale on why that client was chosen).
 *
 * For local development/testing with no Upstash account, we fall back to a
 * tiny JSON-file-backed store that implements the same handful of methods
 * we actually use. This means `npm run dev` works out of the box with zero
 * external services, and swapping in real Redis later is a one-line env
 * change - no code changes required.
 */

export interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<string | null>;
  del(...keys: string[]): Promise<number>;
  sadd(key: string, ...members: string[]): Promise<number>;
  srem(key: string, ...members: string[]): Promise<number>;
  smembers(key: string): Promise<string[]>;
  exists(key: string): Promise<number>;
}

class LocalFileRedis implements RedisLike {
  private filePath: string;
  private store: {
    strings: Record<string, string>;
    sets: Record<string, string[]>;
  };

  constructor() {
    const dataDir = path.join(process.cwd(), ".data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, "local-db.json");
    this.store = { strings: {}, sets: {} };
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        this.store = JSON.parse(raw);
      }
    } catch {
      this.store = { strings: {}, sets: {} };
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.store, null, 2));
    } catch (err) {
      console.error("LocalFileRedis: failed to persist local-db.json", err);
    }
  }

  async get(key: string) {
    return this.store.strings[key] ?? null;
  }

  async set(key: string, value: string) {
    this.store.strings[key] = value;
    this.save();
    return "OK";
  }

  async del(...keys: string[]) {
    let count = 0;
    for (const key of keys) {
      if (key in this.store.strings) {
        delete this.store.strings[key];
        count++;
      }
      if (key in this.store.sets) {
        delete this.store.sets[key];
        count++;
      }
    }
    this.save();
    return count;
  }

  async sadd(key: string, ...members: string[]) {
    const set = new Set(this.store.sets[key] ?? []);
    let added = 0;
    for (const m of members) {
      if (!set.has(m)) {
        set.add(m);
        added++;
      }
    }
    this.store.sets[key] = Array.from(set);
    this.save();
    return added;
  }

  async srem(key: string, ...members: string[]) {
    const set = new Set(this.store.sets[key] ?? []);
    let removed = 0;
    for (const m of members) {
      if (set.has(m)) {
        set.delete(m);
        removed++;
      }
    }
    this.store.sets[key] = Array.from(set);
    this.save();
    return removed;
  }

  async smembers(key: string) {
    return this.store.sets[key] ?? [];
  }

  async exists(key: string) {
    return key in this.store.strings || key in this.store.sets ? 1 : 0;
  }
}

class UpstashAdapter implements RedisLike {
  constructor(private client: Redis) {}
  get(key: string) {
    return this.client.get<string>(key);
  }
  set(key: string, value: string) {
    return this.client.set(key, value) as Promise<string | null>;
  }
  del(...keys: string[]) {
    return this.client.del(...(keys as [string, ...string[]]));
  }
  sadd(key: string, ...members: string[]) {
    return this.client.sadd(key, ...(members as [string, ...string[]]));
  }
  srem(key: string, ...members: string[]) {
    return this.client.srem(key, ...(members as [string, ...string[]]));
  }
  smembers(key: string) {
    return this.client.smembers(key);
  }
  exists(key: string) {
    return this.client.exists(key);
  }
}

let instance: RedisLike | null = null;

export function getDb(): RedisLike {
  if (instance) return instance;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    instance = new UpstashAdapter(new Redis({ url, token }));
    console.log("[TransitionHub] Using Upstash Redis.");
  } else {
    instance = new LocalFileRedis();
    console.log(
      "[TransitionHub] No Upstash credentials found - using local file-backed store at .data/local-db.json"
    );
  }
  return instance;
}
