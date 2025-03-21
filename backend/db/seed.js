const pool = require("./db");
const bcrypt = require("bcrypt"); //import bcrypt lib to hash pass for security
const fs = require("fs"); //import file system module

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
        //read json file
        const rawData = fs.readFileSync("db/fragrances.json")
        const fragrances = JSON.parse(rawData);

        //loop through array of frag objects from the json and extract ids
        let fragranceIds = [];
        for (let frag of fragrances) { 
            const fragranceRes = await pool.query(
            `INSERT INTO fragrances (id, name, brand, launch_date, perfumers, notes, top_notes, heart_notes,base_notes, description, image) 
            VALUES 
            (
                gen_random_uuid(), 
                $1, 
                $2, 
                $3,
                $4,
                $5, 
                $6,
                $7,
                $8,
                $9,
                $10
            )
            RETURNING id`,
            [frag.name, frag.brand, frag.launch_date, frag.perfumers, frag.notes, frag.top_notes, frag.heart_notes, frag.base_notes, frag.description, frag.image]
            );
            fragranceIds.push(fragranceRes.rows[0].id)
        }

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