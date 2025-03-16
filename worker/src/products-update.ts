import { getDb, productsTable } from './db/schema';
import { eq } from 'drizzle-orm';

export async function saveProductInDb(env: Env, product:any) {
    await getDb(env)
    .insert(productsTable)
    .values({
      ean: product.ean,
      name: product.name,
      data: product.data,
      created_at: Date.now(),
      status: 'submitted',
      source: 'app',
      company_tag: product.company_tag,
      company_name: product.company_name,
      image_url: product.image_url,
    })
    .onConflictDoNothing();
}

export async function getProductByEan(env: Env, ean:string) {
    console.log('env', env);
    const company = await getDb(env).select().from(productsTable).where(eq(productsTable.ean, ean)).get();
}