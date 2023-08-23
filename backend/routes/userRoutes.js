import express from 'express'
import { admin, protect} from '../middleware/authMiddleware.js'
import {authUser, registerUser, logoutUser, getUserProfile, updateUserProfile,
     getUsers, getUserById, deleteUser, updateUser} from '../controllers/usersController.js'

     

const router = express.Router();

router.route('/').get(protect, admin, getUsers).post(registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect,updateUserProfile);
router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

// router.route('/login').post(authUser);
// router.route('/').post(registerUser);
// router.route('/logout').post(logoutUser);
// router.route('/').get(getUserProfile);
// router.route('/').put(updateUserProfile);
// router.route('/').get(getUsers);
// router.route('/:id').get(getUserById);
// router.route('/:id').put(updateUser);
// router.route('/:id').delete(deleteUser);

export default router;