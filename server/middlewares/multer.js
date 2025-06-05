import multer from "multer";

// Set up multer storage using Cloudinary
const storage = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  };

const upload = multer({ storage, fileFilter });

export default upload;