import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ code: 1, data: null, msg: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ code: 1, data: null, msg: `Method '${req.method}' Not Allowed` });
  },
});

const uploadMiddleware = upload.array('file');

apiRoute.use(uploadMiddleware);

apiRoute.post((req, res) => {
  res.status(200).json({ code: 0, data: null, msg: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    // Disallow body parsing, consume as stream
    bodyParser: false,
  },
};