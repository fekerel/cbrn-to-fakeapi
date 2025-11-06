import { userService } from "@/api/fakeApi/UserService";
import { categoryService } from "@/api/fakeApi/CategoryService";
import { productService } from "@/api/fakeApi/ProductsService";
import { orderService } from "@/api/fakeApi/OrderService";

const COUNT = 50;

// Environment'ı FakeAPI olarak ayarla (localhost:8000 için)
if (!process.argv.includes('--environment=FakeAPI') && !process.argv.includes('--environment=FAKEAPI')) {
    process.argv.push('--environment=FakeAPI');
}

async function seedDatabase() {
    // URL kontrolü
    const currentUrl = "http://localhost:8000";

    console.log("Veritabanına veri ekleme işlemi başlatılıyor...\n");

    try {
        // 1. User oluşturma (50 adet)
        console.log(`1. ${COUNT} adet User oluşturuluyor...`);
        const userPromises = [];
        for (let i = 0; i < COUNT; i++) {
            userPromises.push(
                userService.createNewUser()
                    .then(() => {
                        if ((i + 1) % 10 === 0) {
                            console.log(`   ${i + 1}/${COUNT} user oluşturuldu`);
                        }
                    })
                    .catch((error) => {
                        console.error(`   User ${i + 1} oluşturulurken hata:`, error.message);
                    })
            );
        }
        await Promise.all(userPromises);
        console.log(`✓ ${COUNT} adet User başarıyla oluşturuldu.\n`);

        // 2. Category oluşturma (50 adet)
        console.log(`2. ${COUNT} adet Category oluşturuluyor...`);
        const categoryPromises = [];
        for (let i = 0; i < COUNT; i++) {
            categoryPromises.push(
                categoryService.createCategory()
                    .then(() => {
                        if ((i + 1) % 10 === 0) {
                            console.log(`   ${i + 1}/${COUNT} category oluşturuldu`);
                        }
                    })
                    .catch((error) => {
                        console.error(`   Category ${i + 1} oluşturulurken hata:`, error.message);
                    })
            );
        }
        await Promise.all(categoryPromises);
        console.log(`✓ ${COUNT} adet Category başarıyla oluşturuldu.\n`);

        // 3. Product oluşturma (50 adet) - Category ve User'lara ihtiyaç var
        console.log(`3. ${COUNT} adet Product oluşturuluyor...`);
        const productPromises = [];
        for (let i = 0; i < COUNT; i++) {
            productPromises.push(
                productService.createNewProduct()
                    .then(() => {
                        if ((i + 1) % 10 === 0) {
                            console.log(`   ${i + 1}/${COUNT} product oluşturuldu`);
                        }
                    })
                    .catch((error) => {
                        console.error(`   Product ${i + 1} oluşturulurken hata:`, error.message);
                    })
            );
        }
        await Promise.all(productPromises);
        console.log(`✓ ${COUNT} adet Product başarıyla oluşturuldu.\n`);

        // 4. Order oluşturma (50 adet) - User ve Product'lara ihtiyaç var
        console.log(`4. ${COUNT} adet Order oluşturuluyor...`);
        const orderPromises = [];
        for (let i = 0; i < COUNT; i++) {
            orderPromises.push(
                orderService.createNewOrder()
                    .then(() => {
                        if ((i + 1) % 10 === 0) {
                            console.log(`   ${i + 1}/${COUNT} order oluşturuldu`);
                        }
                    })
                    .catch((error) => {
                        console.error(`   Order ${i + 1} oluşturulurken hata:`, error.message);
                    })
            );
        }
        await Promise.all(orderPromises);
        console.log(`✓ ${COUNT} adet Order başarıyla oluşturuldu.\n`);

        console.log("=".repeat(50));
        console.log("Tüm veriler başarıyla eklendi!");
        console.log(`- ${COUNT} User`);
        console.log(`- ${COUNT} Category`);
        console.log(`- ${COUNT} Product`);
        console.log(`- ${COUNT} Order`);
        console.log(`Toplam: ${COUNT * 4} kayıt`);
        console.log("=".repeat(50));

    } catch (error) {
        console.error("Veri ekleme işlemi sırasında genel bir hata oluştu:", error);
        throw error;
    }
}

// Script direkt çalıştırıldığında
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log("\nİşlem tamamlandı.");
            process.exit(0);
        })
        .catch((error) => {
            console.error("\nİşlem başarısız oldu:", error);
            process.exit(1);
        });
}

export default seedDatabase;
