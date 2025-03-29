import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose, { Document, Schema } from 'mongoose';

dotenv.config({ path: './.env' });

const app = express();
const PORT: string | undefined = process.env.PORT || '5000';
const APPURL: string | undefined = process.env.APP_URL;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 MongoDB Connection
const mongoURI: string = 'mongodb+srv://fluteadmin:YMyQlZMGZ7T1BbET@flutecluster.jcvldbk.mongodb.net/flutedb?retryWrites=true&w=majority&appName=FluteCluster';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err: Error) => console.error('❌ Failed to connect to MongoDB:', err));

// Define Interface for URLs
interface IUrl extends Document {
    audioSrc: [string];
    imageSrc: [string];
    title: string;
    timestamp?: Date;
}

// Function to Get a Collection Model Dynamically
const getCollectionModel = (collectionName: string) => {
    // Allowed collections
    const allowedCollections = ['songs', 'albums', 'artists'];

    if (!allowedCollections.includes(collectionName)) {
        throw new Error('❌ Invalid collection');
    }

    // Define Schema for URLs (multiple audio and image support)
    const urlSchema: Schema<IUrl> = new Schema({
        audioSrc: { type: [String], required: true },  // Allow multiple audio links
        imageSrc: { type: [String], required: true },  // Allow multiple image links
        title: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    });

    return mongoose.models[collectionName] || mongoose.model<IUrl>(collectionName, urlSchema);
};

// Serve the HTML Upload Page
app.get('/', (_req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, 'public', 'songupload.html'));
});

// Save Data to a Specific Collection
app.post('/save-urls/:collection', async (req: Request, res: Response): Promise<void> => {
    try {
        const { collection } = req.params;
        console.log(`📥 Saving data to collection: ${collection}`);

        if (!Array.isArray(req.body)) {
            res.status(400).json({ message: '❌ Invalid data format' });
            return;
        }

        const Model = getCollectionModel(collection);
        const urlObjects = req.body.map(({ title, audio, image }) => ({
            title,
            audioSrc: Array.isArray(audio) ? audio : [audio], // Ensure array format
            imageSrc: Array.isArray(image) ? image : [image],
            timestamp: new Date()
        }));

        await Model.insertMany(urlObjects);
        res.status(200).json({ message: `✅ Data saved successfully to ${collection}` });

    } catch (error) {
        console.error('❌ Error saving data:', error);
        res.status(500).json({ message: '❌ Error saving data', error });
    }
});

// Retrieve Data from a Specific Collection
app.get('/get-urls/:collection', async (req: Request, res: Response): Promise<void> => {
    try {
        const { collection } = req.params;
        console.log(`📤 Fetching data from collection: ${collection}`);

        const Model = getCollectionModel(collection);
        const urls = await Model.find();

        res.status(200).json({ urls });

    } catch (error) {
        console.error('❌ Error retrieving data:', error);
        res.status(500).json({ message: '❌ Error retrieving data', error });
    }
});

// Delete Data by ID from a Specific Collection
app.delete('/delete-url-by-id/:collection/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { collection, id } = req.params;
        console.log(`🗑️ Deleting data from collection: ${collection}, ID: ${id}`);

        if (!['songs', 'albums', 'artists'].includes(collection)) {
            res.status(400).json({ message: '❌ Invalid collection name' });
        }
        
        const Model = getCollectionModel(collection);
        const deletedUrl = await Model.findByIdAndDelete(id);
        
        if (!deletedUrl) {
            res.status(404).json({ message: '❌ No matching document found in database' });
        }

        res.status(200).json({ message: `✅ Data deleted successfully from ${collection}` });

    } catch (error) {
        console.error('❌ Error deleting data:', error);
        res.status(500).json({ message: '❌ Error deleting data', error });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on ${APPURL || `http://localhost:${PORT}`}`);
});
