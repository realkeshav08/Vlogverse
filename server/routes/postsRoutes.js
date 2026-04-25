const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middleware/verifyJWT');
const { verifyRoles } = require('../middleware/verifyRoles');
const { getAllPosts, getPostById, createPost, updatePost, deletePost, likePost, addComment, deleteComment } = require('../controllers/postsController')

router.route('/')
    .get(verifyJWT, verifyRoles('user', 'moderator', 'admin', 'owner'), getAllPosts)
    .post(verifyJWT, verifyRoles('user', 'moderator', 'admin', 'owner'), createPost)

router.route('/:id')
    .get(verifyJWT, verifyRoles('user', 'moderator', 'admin', 'owner'), getPostById)
    .put(verifyJWT, verifyRoles('user', 'moderator', 'admin', 'owner'), updatePost)
    .delete(verifyJWT, verifyRoles('user', 'moderator', 'admin', 'owner'), deletePost)

router.route('/:id/like')
    .patch(verifyJWT, verifyRoles('user', 'moderator', 'admin', 'owner'), likePost)

router.route('/:id/comments')
    .post(verifyJWT, verifyRoles('user', 'moderator', 'admin', 'owner'), addComment);

router.route('/:id/comments/:commentId')
    .delete(verifyJWT, verifyRoles('user', 'moderator', 'admin', 'owner'), deleteComment);

module.exports = router;