import { changeRequestsTable, getDb, newPoductTable, productsTable } from './db/schema';
import { and, eq } from 'drizzle-orm';

export async function saveProductInDb(env: Env, product:LocalProduct) {
    await getDb(env)
    .insert(newPoductTable)
    .values({
      ean: product.ean,
      name: product.name,
      data: product.data,
      ip_address: product.ip_address,
      created_at: new Date().toISOString(),
      status: 'submitted',
    })
    .onConflictDoNothing()
    .execute();
}

export async function getProductByEan(env: Env, ean: string) {
    const company = await getDb(env).select().from(newPoductTable).where(
        and(
            eq(newPoductTable.ean, ean),
            eq(newPoductTable.status, 'accepted') 
        )
    ).get();
    return company;
}

export async function saveChangeRequest(env: Env, changeRequest: ChangeRequest) {
    await getDb(env).insert(changeRequestsTable).values({
        data: changeRequest.data,
        created_at: new Date().toISOString(),
        request_type: 'app',
        ip_address: changeRequest.ip_address,
        status: 'submitted',
    }).onConflictDoNothing()
    .execute();
}