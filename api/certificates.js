const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for some PostgreSQL providers on Vercel
        }
    },
    logging: false // Disable logging SQL queries to the console
});

// Define the Certificate model
const Certificate = sequelize.define('Certificate', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'phone_number' // Map to snake_case in database
    },
    course: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completionDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'completion_date' // Map to snake_case in database
    },
    rollNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'roll_number' // Map to snake_case in database
    }
}, {
    tableName: 'certificates', // Specify the table name explicitly
    timestamps: false // Disable createdAt and updatedAt columns
});

// Synchronize the model with the database (create table if it doesn't exist)
sequelize.sync()
    .then(() => {
        console.log('Database & tables synchronized!');
    })
    .catch(err => {
        console.error('Error synchronizing database:', err);
    });

// API to create a new certificate
app.post('/api/certificates', async (req, res) => {
    try {
        const newCertificate = await Certificate.create(req.body);
        res.status(201).json(newCertificate);
    } catch (err) {
        console.error('Error saving certificate:', err);
        res.status(500).json({ error: 'Failed to save certificate', details: err.message });
    }
});

// API to get all certificates
app.get('/api/certificates', async (req, res) => {
    try {
        const allCertificates = await Certificate.findAll();
        res.json(allCertificates);
    } catch (err) {
        console.error('Error fetching certificates:', err);
        res.status(500).json({ error: 'Failed to fetch certificates', details: err.message });
    }
});

// API to get a single certificate by ID
app.get('/api/certificates/:id', async (req, res) => {
    const certificateId = req.params.id;
    try {
        const certificate = await Certificate.findByPk(certificateId);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json(certificate);
    } catch (err) {
        console.error('Error fetching certificate by ID:', err);
        res.status(500).json({ error: 'Failed to fetch certificate', details: err.message });
    }
});

// API to update a certificate by ID
app.put('/api/certificates/:id', async (req, res) => {
    const certificateId = req.params.id;
    try {
        const [updatedRowsCount, updatedCertificates] = await Certificate.update(req.body, {
            where: { id: certificateId },
            returning: true // Return the updated object
        });
        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json({ message: 'Certificate updated successfully', certificate: updatedCertificates[0] });
    } catch (err) {
        console.error('Error updating certificate:', err);
        res.status(500).json({ error: 'Failed to update certificate', details: err.message });
    }
});

// API to delete a certificate by ID
app.delete('/api/certificates/:id', async (req, res) => {
    const certificateId = req.params.id;
    try {
        const deletedRows = await Certificate.destroy({
            where: { id: certificateId }
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json({ message: 'Certificate deleted successfully' });
    } catch (err) {
        console.error('Error deleting certificate:', err);
        res.status(500).json({ error: 'Failed to delete certificate', details: err.message });
    }
});

// Export the app for Vercel serverless function deployment
module.exports = app;
