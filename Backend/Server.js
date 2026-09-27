require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
        return;
    }

    console.log("MySQL connected");
});

const app = express();

app.use(cors());
app.use(express.json());


app.get("/activities", (req, res) => {
    const sql = "SELECT * FROM activities";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
});
app.get("/contacts", (req, res) => {
    const sql = "SELECT * FROM contacts";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
});
app.post("/contacts", (req, res) => {
    const { name, email, phone, company } = req.body;

    const sql = `
        INSERT INTO contacts (name, email, phone, company)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, phone, company],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            res.json({
                message: "Contact added successfully",
                id: result.insertId
            });
        }
    );
});

app.put("/contacts/:id", (req, res) => {
    const id = req.params.id;
    const { name, email, phone, company } = req.body;

    const sql = `
        UPDATE contacts
        SET name = ?, email = ?, phone = ?, company = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, phone, company, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            res.json({
                message: "Contact updated successfully"
            });
        }
    );
});

app.delete("/contacts/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM contacts WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json({
            message: "Contact deleted successfully"
        });
    });
});
app.post("/activities", (req, res) => {
    const { title, type, company, date, status } = req.body;

    const sql = `
        INSERT INTO activities (title, type, company, date, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, type, company, date, status],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            res.json({
                message: "Activity added successfully",
                id: result.insertId
            });
        }
    );
});

app.put("/activities/:id", (req, res) => {
    const id = req.params.id;
    const { title, type, company, date, status } = req.body;

    const sql = `
        UPDATE activities
        SET title = ?, type = ?, company = ?, date = ?, status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title, type, company, date, status, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            res.json({
                message: "Activity updated successfully"
            });
        }
    );
});

app.delete("/activities/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM activities WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json({
            message: "Activity deleted successfully"
        });
    });
});
app.get("/pipeline", (req, res) => {
    const sql = "SELECT * FROM pipeline";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
});
app.post("/pipeline", (req, res) => {
    const { name, company, value, stage, owner } = req.body;

    const sql = `
        INSERT INTO pipeline (name, company, value, stage, owner)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, company, value, stage, owner],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json({
                message: "Deal added successfully",
                id: result.insertId
            });
        }
    );
});
app.put("/pipeline/:id", (req, res) => {
    const id = req.params.id;
    const { name, company, value, stage, owner } = req.body;

    const sql = `
        UPDATE pipeline
        SET name = ?, company = ?, value = ?, stage = ?, owner = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, company, value, stage, owner, id],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json({
                message: "Deal updated successfully"
            });
        }
    );
});
app.delete("/pipeline/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM pipeline WHERE id = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Deal deleted successfully"
        });
    });
});
app.get("/dashboard", (req, res) => {
    const sql = `
        SELECT
            COUNT(*) AS totalDeals,
            COALESCE(SUM(value), 0) AS pipelineValue,
            SUM(CASE WHEN stage = 'Closed Won' THEN 1 ELSE 0 END) AS closedWon
        FROM pipeline
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        const totalDeals = results[0].totalDeals;
        const closedWon = results[0].closedWon || 0;

        const winRate =
            totalDeals > 0
                ? ((closedWon / totalDeals) * 100).toFixed(1)
                : 0;

        res.json({
            totalDeals,
            pipelineValue: results[0].pipelineValue,
            closedWon,
            winRate
        });
    });
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});