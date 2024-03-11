import { Router } from 'express';
import { getCardList } from '@Controllers/cards.js';
// import { getCardList, getCard } from '../controllers/cards.js';
//const { getCardList, getCard } = require('@Controllers/cards');
const router = Router();
router.route('/').get(getCardList);
module.exports = router;
//# sourceMappingURL=cards.js.map