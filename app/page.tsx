import prisma from "../lib/prisma";

export default async function Page() {
    // Query the database to get the product count
    const productCount = await prisma.product.count();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-8 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Database Connection Test
                </h1>
                <p className="text-gray-600 mb-6">
                    Successfully connected to Neon PostgreSQL via the Prisma 7 serverless adapter!
                </p>
                <div className="bg-gray-50 rounded-md p-4 border border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Products in DB:</span>
                    <span className="text-lg font-mono font-bold text-blue-600">{productCount}</span>
                </div>
            </div>
        </main>
    );
}