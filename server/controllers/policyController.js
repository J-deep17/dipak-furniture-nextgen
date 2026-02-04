const Policy = require('../models/Policy');

// @desc    Get all policies
// @route   GET /api/policies
// @access  Public
const getPolicies = async (req, res) => {
    try {
        const policies = await Policy.find({ isActive: true })
            .select('type title slug lastUpdated')
            .sort({ type: 1 });

        res.json(policies);
    } catch (error) {
        console.error('Get policies error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single policy
// @route   GET /api/policies/:slug
// @access  Public
const getPolicy = async (req, res) => {
    try {
        const { slug } = req.params;

        const policy = await Policy.findOne({ slug, isActive: true });

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        res.json(policy);
    } catch (error) {
        console.error('Get policy error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create or update policy
// @route   POST /api/policies
// @access  Private/Admin
const upsertPolicy = async (req, res) => {
    try {
        const { type, title, slug, content } = req.body;

        let policy = await Policy.findOne({ type });

        if (policy) {
            // Update existing
            policy.title = title;
            policy.slug = slug;
            policy.content = content;
            await policy.save();
        } else {
            // Create new
            policy = new Policy({ type, title, slug, content });
            await policy.save();
        }

        res.json({
            success: true,
            message: 'Policy saved successfully',
            policy
        });
    } catch (error) {
        console.error('Upsert policy error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete policy
// @route   DELETE /api/policies/:id
// @access  Private/Admin
const deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;

        const policy = await Policy.findById(id);

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        policy.isActive = false;
        await policy.save();

        res.json({ message: 'Policy deactivated successfully' });
    } catch (error) {
        console.error('Delete policy error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getPolicies,
    getPolicy,
    upsertPolicy,
    deletePolicy
};
