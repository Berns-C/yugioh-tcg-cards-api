import { Router } from 'express';
import {
  addCards,
  getCardByID,
  getCardByName,
  getAllCards,
  updateCard,
  deleteCard,
} from '../controllers/cards';

const router = Router();

router.route('/').get(getAllCards).post(addCards);
router.route('/name/:name').get(getCardByName);
router.route('/:id').get(getCardByID).put(updateCard).delete(deleteCard);

export default router;
