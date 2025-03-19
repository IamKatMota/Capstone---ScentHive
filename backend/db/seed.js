const pool = require("./db");
const bcrypt = require("bcrypt"); //import bcrypt lib to hash pass for security

const seedDatabase = async() => {
    try {
        console.log("🌱 Seeding database..."); //DEBUG DELETE LATER

        //clear existing data
        await pool.query("DELETE FROM reviews");
        await pool.query("DELETE FROM fragrances");
        await pool.query("DELETE FROM users");

        //insert test users
        const hashedPassword = await bcrypt.hash("password123", 10);
        const userRes = await pool.query(
            `INSERT INTO users (
                id, 
                name, 
                email, 
                password
            ) 
            VALUES 
                (
                    gen_random_uuid(), 
                    'John Doe', 
                    'john@example.com', 
                    $1
                ),

                (
                    gen_random_uuid(), 
                    'Jane Smith', 
                    'jane@example.com', 
                    $1
                )
            RETURNING id`,
            [hashedPassword] //pass the hashedPassword into $1
        );
        const userIds = userRes.rows.map(row => row.id); //extract user IDs from db response

        //insert test fragrances
        const fragranceRes = await pool.query(
            `INSERT INTO fragrances (id, name, brand, launch_date, perfumers, notes, description, image) 
            VALUES 
            (
                gen_random_uuid(), 
                'Sauvage', 
                'Dior', 
                2015,
                'François Demachy',
                'Calabrian bergamot, Sichuan Pepper, Lavender, Pink Pepper, Vetiver, Patchouli, Geranium, Elemi, Ambroxan, Labdanum', 
                'A fresh and spicy fragrance with a woody base.',
                'https://fimgs.net/mdimg/perfume/375x500.31861.jpg'
            ),
            (
                gen_random_uuid(), 
                'La Nuit de L''Homme', 
                'YSL', 
                2009,
                'Anne Flipo, Pierre Wargnye, Dominique Ropion',
                'Cardamom, Lavender, Virginia Cedar, Bergamot, Vetiver, Caraway', 
                'A woody and spicy fragrance perfect for evenings.',
                'https://fimgs.net/mdimg/perfume/375x500.5521.jpg'
            )
            RETURNING id`
        );
        const fragranceIds = fragranceRes.rows.map(row => row.id);

        //insert test reviews
        await pool.query(
            `INSERT INTO reviews (id, content, rating, fragrance_id, user_id)
            VALUES
                (
                    gen_random_uuid(), 
                    'Amazing fresh scent, lasts all day!', 
                    5, 
                    $1, 
                    $2
                ),
                (
                    gen_random_uuid(), 
                    'Very seductive and smooth fragrance.', 
                    4, 
                    $3, 
                    $4
                )`, [fragranceIds[0], userIds[0], fragranceIds[1], userIds[1]]  
        );
        console.log("✅ Database seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding database:", error)
    }finally {
        pool.end();
    }
};

seedDatabase();