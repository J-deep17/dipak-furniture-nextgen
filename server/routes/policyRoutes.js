const express = require('express');
const router = express.Router();
const {
    getPolicies,
    getPolicy,
    upsertPolicy,
    deletePolicy
} = require('../controllers/policyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getPolicies);
router.get('/:slug', getPolicy);
router.post('/', protect, admin, upsertPolicy);
router.delete('/:id', protect, admin, deletePolicy);

module.exports = router;
