import express, { Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose, { Document, Schema } from 'mongoose';

dotenv.config({ path: './.env' });
const app = express();
const PORT: string | undefined = process.env.PORT;
const APPURL: string | undefined = process.env.APP_URL;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI: string = 'mongodb+srv://fluteadmin:YMyQlZMGZ7T1BbET@flutecluster.jcvldbk.mongodb.net/flutedb?retryWrites=true&w=majority&appName=FluteCluster'; 
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err: Error) => console.error('Failed to connect to MongoDB:', err));

interface IUrl extends Document {
    audioSrc: string;
    imageSrc: string;
    title: string;
    timestamp?: Date;
}

const urlSchema: Schema<IUrl> = new Schema({
    audioSrc: { type: String, required: true },
    imageSrc: { type: String, required: true },
    title: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Url = mongoose.model<IUrl>('Url', urlSchema);

app.get('/', (_req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, 'public', 'songupload.html'));
});

app.post('/save-urls', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Received Data:", req.body);

        if (!Array.isArray(req.body)) {
            res.status(400).json({ message: 'Invalid data format' });   
            return;
        }

        const urlObjects = req.body.map(({ title, audio, image }: { title: string; audio:string; image:string }) => ({
            title,
            audioSrc: audio,
            imageSrc: image,
            timestamp: new Date()
        }));

        await Url.insertMany(urlObjects);
        res.status(200).json({ message: 'URLs and titles saved successfully' });
        
    } catch (error) {
        console.error('Error saving URLs:', error);
        res.status(500).json({ message: 'Error saving data to database', error });
    }
});

app.get('/get-urls', async (req: Request, res: Response): Promise<void> => {
    try {
        const urls = await Url.find();
        res.status(200).json({ urls });
        
    } catch (error) {
        console.error('Error retrieving URLs:', error);
        res.status(500).json({ message:'Error retrieving URLs from database' });
    }
});

app.delete('/delete-url-by-id/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id }: { id:string } = req.params;

        const deletedUrl = await Url.findByIdAndDelete(id);

        if (!deletedUrl) {
            res.status(404).json({ message:'URL not found' });
            return;
        }

        res.status(200).json({ message:'URL deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting URL:', error);
        res.status(500).json({ message:'Error deleting URL from database' });
    }
});

app.listen(PORT, () => {
   console.log(`Server is running on ${APPURL}`);
});