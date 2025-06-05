import { prisma } from "../config/db.js";
import Alumni from "../models/alumni.model.js";

export const getAlumniList = async (req, res) => {
    try {
      const alumni = await Alumni.find({})
        .select('name email graduatedIn dept jobRole company phone avatar verified');
  
      res.status(200).json({ success: true, alumni });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };