import "server-only"

import {neonConfig} from "@neondatabase/serverless"
import {PrismaNeon} from "@prisma/adapter-neon"
import {PrismaClient} from '@/generated/prisma/client'// added th /client to point to the runtime constrictor
import ws from "ws"
import {serverEnv} from "@/lib/server.env";


neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
    //pass the connection config directly to prisma neon, because ts was complaining that pool doesn't have common types as PoolConfig
    const adapter = new PrismaNeon({connectionString: serverEnv.DATABASE_URL})
    return new PrismaClient({adapter})
}

//then set up type-safe global caching using unknown to prevent strict TS errors
const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

//Then use nullish coleasing to spin up a fresh conn pool and cache it to global this incase the conn pool does not exist
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()


//Now ensure that the globalThis caching only applies to non-production environments
if(serverEnv.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}

export default prisma;
