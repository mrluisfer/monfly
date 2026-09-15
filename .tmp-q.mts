import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
console.log('--- card statuses ---');
console.table(await sql`select status, count(*) n, round(sum(balance)::numeric*100) cents from "Card" group by 1`);
console.log('--- the two users where the rule misses ---');
console.table(await sql`
  select u.email, round(u."totalBalance"::numeric*100) v1_total, u."createdAt"::date user_since,
    (select count(*) from "Card" c where c."userEmail"=u.email) cards,
    (select round(coalesce(sum(balance),0)::numeric*100) from "Card" c where c."userEmail"=u.email) card_cents,
    (select round(coalesce(sum(case when type='income' then amount else -amount end),0)::numeric*100) from "Transaction" t where t."userEmail"=u.email) all_tx_net,
    (select min(date)::date from "Transaction" t where t."userEmail"=u.email) first_tx
  from "User" u where u.email in ('lolesuncrak@gmail.com','Kurizddrive@gmail.com')`);
