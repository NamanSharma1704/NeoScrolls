import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB, Manhwa } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Root route
app.get('/', (req, res) => {
    res.send('Neo-Scrolls API is running');
});

// GET all manhwa
app.get('/api/manhwa', async (req, res) => {
    try {
        await connectDB(); // Ensure connection
        const manhwa = await Manhwa.find().sort({ lastUpdated: -1 });
        res.json(manhwa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new manhwa
app.post('/api/manhwa', async (req, res) => {
    try {
        await connectDB();
        const { id, title, coverUrl, status, currentChapter, totalChapters, rating, link, synopsis, lastUpdated } = req.body;

        await Manhwa.create({
            id,
            title,
            coverUrl,
            status,
            currentChapter,
            totalChapters,
            rating,
            link,
            synopsis,
            lastUpdated
        });

        res.status(201).json({ message: 'Created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update manhwa
app.put('/api/manhwa/:id', async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        const { title, coverUrl, status, currentChapter, totalChapters, rating, link, synopsis, lastUpdated } = req.body;

        await Manhwa.findOneAndUpdate(
            { id: id },
            {
                title,
                coverUrl,
                status,
                currentChapter,
                totalChapters,
                rating,
                link,
                synopsis,
                lastUpdated
            }
        );

        res.json({ message: 'Updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE manhwa
app.delete('/api/manhwa/:id', async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        await Manhwa.findOneAndDelete({ id: id });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Only start server if run directly (local dev)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
