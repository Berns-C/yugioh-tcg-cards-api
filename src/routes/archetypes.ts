import { Router } from 'express';
import {
  getAllArchetypes,
  getArchetypeByID,
  getArchetypeByName,
  addArchetypes,
  updateArchetype,
  deleteArchetype,
} from '../controllers/archetypes';

const router = Router();

router.route('/').get(getAllArchetypes).post(addArchetypes);
router.route('/name/:name').get(getArchetypeByName);
router
  .route('/:id')
  .get(getArchetypeByID)
  .put(updateArchetype)
  .delete(deleteArchetype);

export default router;
