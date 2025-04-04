import { changeRequestsTable, getDb, newPoductTable, productsTable } from './db/schema';
import { and, eq } from 'drizzle-orm';

export async function saveProductInDb(env: Env, product:LocalProduct, isAbusive:boolean) {
    if (isAbusive === true) {
        return;
        // No need to save
    }

    const existing = await getDb(env)
        .select()
        .from(newPoductTable)
        .where(eq(newPoductTable.ean, product.ean))
        .get();

    if (existing) {
        const oldData = JSON.parse(existing.data ?? '');
        const newData = JSON.parse(product.data ?? '');

        const merged = { ...oldData, ...newData };

        await getDb(env)
            .update(newPoductTable)
            .set({
                name: product.name,
                data: JSON.stringify(merged),
                ip_address: product.ip_address,
                created_at: new Date().toISOString(),
                status:
                isAbusive == null
                    ? 'submitted'
                    : isAbusive
                    ? 'declined'
                    : 'accepted',
            })
            .where(eq(newPoductTable.ean, product.ean));
    return;
    }

    await getDb(env)
    .insert(newPoductTable)
    .values({
      ean: product.ean,
      name: product.name,
      data: product.data,
      ip_address: product.ip_address,
      created_at: new Date().toISOString(),
      status: (isAbusive == null || isAbusive == undefined) ? 'submitted' : (isAbusive) ? 'declined' : 'accepted',
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
        status: 'accepted',
    }).onConflictDoNothing()
    .execute();
}