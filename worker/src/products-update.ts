import { changeRequestsTable, confirmationTable, getDb, newPoductTable, productsTable } from './db/schema';
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

export async function getConfirmations(env: Env, ean: string) {
    const result = await getDb(env).select().from(confirmationTable).where(
        eq(confirmationTable.code, ean)
    ).get();

    if (result && result.confirmations) {
        try {
          return JSON.parse(result.confirmations);
        } catch (err) {
          console.error("Error parsing confirmations:", err);
          return [];
        }
      }
    
      return [];
}

export async function addConfirmation(env: Env, ean: string, ip: string) {
    const db = getDb(env);
    
    const existing = await db
      .select()
      .from(confirmationTable)
      .where(eq(confirmationTable.code, ean))
      .get();
  
    if (existing) {
      let currentIPs: string[] = [];
  
      try {
        currentIPs = JSON.parse(existing.confirmations || '[]');
      } catch (err) {
        console.error("Failed to parse confirmations:", err);
      }
  
      // Add IP only if it doesn't exist already
      if (!currentIPs.includes(ip)) {
        currentIPs.push(ip);
        await db
          .update(confirmationTable)
          .set({ confirmations: JSON.stringify(currentIPs) })
          .where(eq(confirmationTable.code, ean));
      }
    } else {
      // No entry yet, create it with current IP
      await db.insert(confirmationTable).values({
        code: ean,
        confirmations: JSON.stringify([ip]),
      });
    }
}

export async function clearConfirmations(env: Env, ean: string) {
    const db = getDb(env);

    await db
        .delete(confirmationTable)
        .where(eq(confirmationTable.code, ean));
}

export async function getProductByEan(env: Env, ean: string) {
    const product = await getDb(env).select().from(newPoductTable).where(
        and(
            eq(newPoductTable.ean, ean),
            eq(newPoductTable.status, 'accepted') 
        )
    ).get();
    return product;
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