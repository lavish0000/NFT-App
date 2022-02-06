import express from 'express';

const router = express.Router();

import nft from '../modules/NFT';


router.use('/nft', nft);

export default router;
