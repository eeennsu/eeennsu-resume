import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';

config({ path: '.env' });

const createDb = () => {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle({ client: sql });
};

type Db = ReturnType<typeof createDb>;

let instance: Db | null = null;

// neon()을 모듈 로드 시점이 아니라 최초 사용(요청) 시점에 초기화한다.
// next build의 page-data 수집 단계에서 DATABASE_URL 없이 import되어도 throw하지 않도록.
const getDb = (): Db => (instance ??= createDb());

const db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop);
    return typeof value === 'function' ? value.bind(real) : value;
  },
});

export default db;
