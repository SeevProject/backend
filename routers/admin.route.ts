import { Router } from 'express';

import { requiresAdmin, requiresSession } from '../middleware/auth.middleware';
import { getAdminData } from '../controllers/admin.conttroller';

export const adminRouter = Router();

// all routes require a session

adminRouter.get('/admin', requiresSession, getAdminData);
