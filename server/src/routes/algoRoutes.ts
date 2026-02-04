import express from 'express';
import Algorithm from '../models/Algorithm';

const router = express.Router();

router.get('/algorithm', async (req, res) => {
  try {
    const algos = await Algorithm.find().sort({ createdAt: -1 });
    res.json(algos);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});


router.post('/algorithm', async (req, res) => {
  const newAlgo = new Algorithm(req.body);
  try {
    const savedAlgo = await newAlgo.save();
    res.status(201).json(savedAlgo);
  } catch (err) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }
});

export default router;