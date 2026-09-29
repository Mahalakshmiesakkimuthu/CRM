require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

// PostgreSQL / Neon connection
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect()
    .then((client) => {
        console.log("PostgreSQL connected");
        client.release();
    })
    .catch((err) => {
        console.log("Database connection failed");
        console.log(err.message);
    });

const app = express();

app.use(cors());
app.use(express.json());


// ==================== ACTIVITIES ====================

// GET all activities
app.get("/activities", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM activities");

        res.json(result.rows);
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// ADD activity
app.post("/activities", async (req, res) => {
    const { title, type, company, date, status } = req.body;

    const sql = `
        INSERT INTO activities
        (title, type, company, date, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `;

    try {
        const result = await db.query(sql, [
            title,
            type,
            company,
            date,
            status
        ]);

        res.json({
            message: "Activity added successfully",
            id: result.rows[0].id
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// UPDATE activity
app.put("/activities/:id", async (req, res) => {
    const id = req.params.id;
    const { title, type, company, date, status } = req.body;

    const sql = `
        UPDATE activities
        SET
            title = $1,
            type = $2,
            company = $3,
            date = $4,
            status = $5
        WHERE id = $6
    `;

    try {
        await db.query(sql, [
            title,
            type,
            company,
            date,
            status,
            id
        ]);

        res.json({
            message: "Activity updated successfully"
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// DELETE activity
app.delete("/activities/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await db.query(
            "DELETE FROM activities WHERE id = $1",
            [id]
        );

        res.json({
            message: "Activity deleted successfully"
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// ==================== CONTACTS ====================

// GET all contacts
app.get("/contacts", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM contacts"
        );

        res.json(result.rows);
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// ADD contact
app.post("/contacts", async (req, res) => {
    const { name, email, phone, company } = req.body;

    const sql = `
        INSERT INTO contacts
        (name, email, phone, company)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;

    try {
        const result = await db.query(sql, [
            name,
            email,
            phone,
            company
        ]);

        res.json({
            message: "Contact added successfully",
            id: result.rows[0].id
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// UPDATE contact
app.put("/contacts/:id", async (req, res) => {
    const id = req.params.id;
    const { name, email, phone, company } = req.body;

    const sql = `
        UPDATE contacts
        SET
            name = $1,
            email = $2,
            phone = $3,
            company = $4
        WHERE id = $5
    `;

    try {
        await db.query(sql, [
            name,
            email,
            phone,
            company,
            id
        ]);

        res.json({
            message: "Contact updated successfully"
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// DELETE contact
app.delete("/contacts/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await db.query(
            "DELETE FROM contacts WHERE id = $1",
            [id]
        );

        res.json({
            message: "Contact deleted successfully"
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// ==================== PIPELINE ====================

// GET pipeline
app.get("/pipeline", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM pipeline"
        );

        res.json(result.rows);
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// ADD deal
app.post("/pipeline", async (req, res) => {
    const { name, company, value, stage, owner } = req.body;

    const sql = `
        INSERT INTO pipeline
        (name, company, value, stage, owner)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `;

    try {
        const result = await db.query(sql, [
            name,
            company,
            value,
            stage,
            owner
        ]);

        res.json({
            message: "Deal added successfully",
            id: result.rows[0].id
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// UPDATE deal
app.put("/pipeline/:id", async (req, res) => {
    const id = req.params.id;
    const { name, company, value, stage, owner } = req.body;

    const sql = `
        UPDATE pipeline
        SET
            name = $1,
            company = $2,
            value = $3,
            stage = $4,
            owner = $5
        WHERE id = $6
    `;

    try {
        await db.query(sql, [
            name,
            company,
            value,
            stage,
            owner,
            id
        ]);

        res.json({
            message: "Deal updated successfully"
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// DELETE deal
app.delete("/pipeline/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await db.query(
            "DELETE FROM pipeline WHERE id = $1",
            [id]
        );

        res.json({
            message: "Deal deleted successfully"
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// ==================== DASHBOARD ====================

app.get("/dashboard", async (req, res) => {
    const sql = `
        SELECT
            COUNT(*)::int AS "totalDeals",
            COALESCE(SUM(value), 0) AS "pipelineValue",
            COALESCE(
                SUM(
                    CASE
                        WHEN stage = 'Closed Won' THEN 1
                        ELSE 0
                    END
                ),
                0
            )::int AS "closedWon"
        FROM pipeline
    `;

    try {
        const result = await db.query(sql);

        const totalDeals = result.rows[0].totalDeals;
        const closedWon = result.rows[0].closedWon;

        const winRate =
            totalDeals > 0
                ? ((closedWon / totalDeals) * 100).toFixed(1)
                : 0;

        res.json({
            totalDeals,
            pipelineValue: result.rows[0].pipelineValue,
            closedWon,
            winRate
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
});


// ==================== SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});