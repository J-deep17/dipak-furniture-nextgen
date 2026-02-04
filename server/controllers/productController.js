const Product = require('../models/Product');

const getFullUrl = (path, req) => {
    if (!path) return path;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${req.protocol}://${req.get('host')}${cleanPath}`;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { sort, priceMin, priceMax, discountMin, ratingMin, colors, materials, tags, categorySlug } = req.query;

        let filterQuery = { isDeleted: { $ne: true } };

        // 0. Category Filter by Slug
        if (categorySlug) {
            const Category = require('../models/Category');
            const cat = await Category.findOne({ slug: categorySlug });
            if (cat) {
                // Find all subcategories recursively
                const subCats = await Category.find({ parent: cat._id });
                const subCatIds = subCats.map(sc => sc._id);
                filterQuery.category = { $in: [cat._id, ...subCatIds] };
            } else {
                return res.status(200).json([]); // Category not found, return empty list
            }
        }

        // 1. Price Filter
        if (priceMin !== undefined || priceMax !== undefined) {
            filterQuery.price = {};
            if (priceMin) filterQuery.price.$gte = Number(priceMin);
            if (priceMax) filterQuery.price.$lte = Number(priceMax);
        }

        // 2. Discount Filter
        if (discountMin) {
            filterQuery.discountPercent = { $gte: Number(discountMin) };
        }

        // 3. Rating Filter
        if (ratingMin) {
            filterQuery.averageRating = { $gte: Number(ratingMin) };
        }

        // 4. Color Filter
        if (colors) {
            const colorList = colors.split(',');
            // Check if any of the product's colors match the list
            filterQuery['colors.name'] = { $in: colorList.map(c => new RegExp(c, 'i')) };
        }

        // 5. Material Filter
        if (materials) {
            const materialList = materials.split(',');
            filterQuery.materialsUsed = { $in: materialList.map(m => new RegExp(m, 'i')) };
        }

        // 6. Tags Filter
        if (tags) {
            const tagList = tags.split(',');
            const orConditions = [];

            // Map special tags to boolean flags
            if (tagList.includes('Best Seller')) orConditions.push({ isBestSeller: true });
            if (tagList.includes('New Launch')) orConditions.push({ isNewLaunch: true });
            if (tagList.includes('Featured')) orConditions.push({ isFeatured: true });

            // Check generic tags array for remaining tags
            const otherTags = tagList.filter(t => !['Best Seller', 'New Launch', 'Featured'].includes(t));
            if (otherTags.length > 0) {
                orConditions.push({ tags: { $in: otherTags } });
            }

            if (orConditions.length > 0) {
                // Combine with existing queries using $and if needed, but here simple $or is fine for this specific filter group.
                // However, adding $or at top level effectively ANDs it with other filters? No, $or property only allows one list.
                // If we had multiple $or requirements it would be trouble. 
                // But simplified:
                filterQuery.$or = orConditions;
            }
        }

        let query = Product.find(filterQuery).populate('category', 'name slug image description');

        // Sorting Logic
        const sortOptions = {};

        switch (sort) {
            case 'price_asc':
                sortOptions.price = 1;
                break;
            case 'price_desc':
                sortOptions.price = -1;
                break;
            case 'discount_desc':
                sortOptions.discountPercent = -1;
                break;
            case 'rating_desc':
                sortOptions.averageRating = -1;
                break;
            case 'name_asc':
                sortOptions.name = 1;
                break;
            case 'name_desc':
                sortOptions.name = -1;
                break;
            case 'latest':
                sortOptions.createdAt = -1;
                break;
            case 'bestseller': // Keep singular as per common URL patterns, but could be plural
                sortOptions.isBestSeller = -1; // Boolean true sorts before false if descending? actually boolean sort is tricky.
                // Better to sort by salesCount if available, or just isBestSeller DESC
                sortOptions.isBestSeller = -1;
                sortOptions.createdAt = -1;
                break;
            default:
                sortOptions.createdAt = -1; // Default to newest
        }

        const products = await query.sort(sortOptions);

        if (!products) return res.status(200).json([]);

        const productsWithUrls = products.map(p => {
            const product = p.toObject();
            product.thumbnail = getFullUrl(product.thumbnail, req);
            if (product.images) {
                product.images = product.images.map(img => getFullUrl(img, req));
            }
            if (product.category && product.category.image) {
                product.category.image = getFullUrl(product.category.image, req);
            }
            return product;
        });
        res.status(200).json(productsWithUrls);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
    try {
        const p = await Product.findById(req.params.id).populate('category', 'name slug image description');
        if (!p) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const product = p.toObject();
        product.thumbnail = getFullUrl(product.thumbnail, req);
        if (product.images) {
            product.images = product.images.map(img => getFullUrl(img, req));
        }
        if (product.category && product.category.image) {
            product.category.image = getFullUrl(product.category.image, req);
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const parseMultiLine = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) {
        let merged = input.join('\n');
        return merged.split(/[\n\r|,|\\]/).map(f => f.trim()).filter(f => f !== '');
    }
    if (typeof input === 'string') {
        return input.split(/[\n\r|,|\\]/).map(f => f.trim()).filter(f => f !== '');
    }
    return [];
};

const parseFeatures = (features) => parseMultiLine(features);
const parseIdealFor = (idealFor) => parseMultiLine(idealFor);

const parseColors = (colors) => {
    if (!colors) return [];

    // Default color map for backward compatibility
    const colorMap = {
        'red': '#ff0000',
        'black': '#000000',
        'white': '#ffffff',
        'brown': '#8b4513',
        'grey': '#808080',
        'gray': '#808080',
        'blue': '#0000ff',
        'green': '#00ff00',
        'yellow': '#ffff00',
        'orange': '#ffa500',
        'purple': '#800080',
        'pink': '#ffc0cb',
        'silver': '#c0c0c0',
        'gold': '#ffd700',
        'beige': '#f5f5dc',
        'ivory': '#fffff0',
        'burgundy': '#800020',
        'navy': '#000080',
        'charcoal': '#36454f'
    };

    if (Array.isArray(colors)) {
        return colors.map(c => {
            if (typeof c === 'string') {
                const name = c.trim();
                const hex = colorMap[name.toLowerCase()] || '#808080';
                return { name, hex, images: [] };
            }
            if (typeof c === 'object' && c.name && c.hex) {
                // Preserve images if they exist
                if (!c.images) c.images = [];
                return c;
            }
            return null;
        }).filter(c => c !== null);
    }

    if (typeof colors === 'string') {
        try {
            // Try parsing as JSON first
            const parsed = JSON.parse(colors);
            return parseColors(parsed); // Recursive call
        } catch (e) {
            // Fallback to comma separation
            return colors.split(/[,|\\]/).map(c => {
                const name = c.trim();
                if (!name) return null;
                const hex = colorMap[name.toLowerCase()] || '#808080';
                return { name, hex, images: [] };
            }).filter(c => c !== null);
        }
    }

    return [];

    return [];
};

// @desc    Create product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    try {
        if (!req.body.category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        let productData = { ...req.body };

        // Parse basic JSON fields
        if (productData.colors) {
            productData.colors = parseColors(productData.colors);
        } else {
            productData.colors = [];
        }

        if (productData.specifications && typeof productData.specifications === 'string') {
            try { productData.specifications = JSON.parse(productData.specifications); } catch (e) { }
        }
        if (productData.dimensions && typeof productData.dimensions === 'string') {
            try { productData.dimensions = JSON.parse(productData.dimensions); } catch (e) { }
        }
        if (productData.warranty && typeof productData.warranty === 'string') {
            try { productData.warranty = JSON.parse(productData.warranty); } catch (e) { }
        }

        // Handle File Uploads (Multipart/Form-Data with upload.any())
        if (req.files && Array.isArray(req.files)) {
            const getFiles = (field) => req.files.filter(f => f.fieldname === field);
            const getFile = (field) => req.files.find(f => f.fieldname === field);

            const thumbFile = getFile('thumbnail');
            if (thumbFile) {
                productData.thumbnail = `uploads/${thumbFile.filename}`;
            }

            const mainImages = getFiles('images').map(f => `uploads/${f.filename}`);
            if (mainImages.length > 0) {
                productData.images = mainImages;
            }

            // Color Variant Images
            if (productData.colors && productData.colors.length > 0) {
                productData.colors = productData.colors.map((color, index) => {
                    const colorFiles = req.files.filter(f => f.fieldname === `color_${index}_images`);
                    const newColorImages = colorFiles.map(f => `uploads/${f.filename}`);
                    return {
                        ...color,
                        images: [...(color.images || []), ...newColorImages]
                    };
                });
            }
        }

        productData.features = parseFeatures(productData.features);
        productData.idealFor = parseIdealFor(productData.idealFor);
        productData.materialsUsed = parseMultiLine(productData.materialsUsed);

        if (productData.warranty) {
            if (productData.warranty.coverage) productData.warranty.coverage = parseMultiLine(productData.warranty.coverage);
            if (productData.warranty.care) productData.warranty.care = parseMultiLine(productData.warranty.care);
        }

        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    try {
        let productData = { ...req.body };
        // Parse basic JSON fields first to establish structure
        if (productData.colors) {
            productData.colors = parseColors(productData.colors);
        } else {
            productData.colors = [];
        }

        // Handle File Uploads (Multipart/Form-Data with upload.any())
        if (req.files && Array.isArray(req.files)) {
            // Helper to get files by fieldname
            const getFiles = (field) => req.files.filter(f => f.fieldname === field);
            const getFile = (field) => req.files.find(f => f.fieldname === field);

            // 1. Thumbnail
            const thumbFile = getFile('thumbnail');
            if (thumbFile) {
                productData.thumbnail = `uploads/${thumbFile.filename}`;
            }

            // 2. Main Gallery Images
            let existingImages = req.body.existingImages || [];
            if (!Array.isArray(existingImages)) existingImages = [existingImages];
            existingImages = existingImages.map(img => {
                if (img.includes('/uploads/')) return 'uploads/' + img.split('/uploads/')[1];
                return img;
            });

            const newMainImages = getFiles('images').map(f => `uploads/${f.filename}`);
            if (req.body.existingImages !== undefined || newMainImages.length > 0) {
                productData.images = [...existingImages, ...newMainImages];
            }

            // 3. Color Variant Images
            // Expecting fieldnames like "color_0_limit_images" or similar? 
            // Actually, best current strategy: "color_0_images"

            // We iterate through the parsed colors array and check for uploads for each index
            if (productData.colors && productData.colors.length > 0) {
                productData.colors = productData.colors.map((color, index) => {
                    // Start with existing images for this color (parsed from JSON body)
                    let currentImages = color.images || [];

                    // Clean up paths for existing images
                    currentImages = currentImages.map(img => {
                        if (img.includes('/uploads/')) return 'uploads/' + img.split('/uploads/')[1];
                        return img;
                    });

                    // Find new uploads for this index
                    // pattern: color_0_images
                    const colorFiles = req.files.filter(f => f.fieldname === `color_${index}_images`);
                    const newColorImages = colorFiles.map(f => `uploads/${f.filename}`);

                    return {
                        ...color,
                        images: [...currentImages, ...newColorImages]
                    };
                });
            }
        }

        if (productData.specifications && typeof productData.specifications === 'string') {
            try {
                productData.specifications = JSON.parse(productData.specifications);
            } catch (e) { }
        }
        if (productData.reviews && typeof productData.reviews === 'string') {
            try {
                productData.reviews = JSON.parse(productData.reviews);
            } catch (e) { }
        }
        if (productData.dimensions && typeof productData.dimensions === 'string') {
            try {
                productData.dimensions = JSON.parse(productData.dimensions);
            } catch (e) { }
        }
        if (productData.colors && typeof productData.colors === 'string') {
            try {
                const parsed = JSON.parse(productData.colors);
                if (Array.isArray(parsed)) productData.colors = parsed;
            } catch (e) { }
        }

        // Tags
        if (typeof productData.tags === 'string') {
            productData.tags = productData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
        }

        // SEO Keywords
        if (typeof productData.seoKeywords === 'string') {
            productData.seoKeywords = productData.seoKeywords.split(',').map(t => t.trim()).filter(t => t !== '');
        }


        if (productData.features) {
            productData.features = parseFeatures(productData.features);
        }
        if (productData.idealFor) {
            productData.idealFor = parseIdealFor(productData.idealFor);
        }
        if (productData.materialsUsed) {
            productData.materialsUsed = parseMultiLine(productData.materialsUsed);
        }
        if (productData.colors) {
            productData.colors = parseColors(productData.colors);
        }
        if (productData.warranty) {
            // Check if warranty comes as stringified JSON or flat fields
            if (typeof productData.warranty === 'string') {
                try {
                    productData.warranty = JSON.parse(productData.warranty);
                } catch (e) { }
            }
            // Re-parse internal arrays
            if (productData.warranty && productData.warranty.coverage !== undefined) {
                productData.warranty.coverage = parseMultiLine(productData.warranty.coverage);
            }
            if (productData.warranty && productData.warranty.care !== undefined) {
                productData.warranty.care = parseMultiLine(productData.warranty.care);
            }
        }

        const product = await Product.findByIdAndUpdate(req.params.id, productData, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.isDeleted = true;
        await product.save();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query 'q' is required" });
        }

        const keyword = new RegExp(q, 'i');

        const products = await Product.find({
            isDeleted: { $ne: true },
            $or: [
                { name: keyword },
                { description: keyword },
                { tags: { $in: [keyword] } },
                { features: { $in: [keyword] } },
                { materialsUsed: { $in: [keyword] } },
                { 'colors.name': keyword }
            ]
        })
            .populate('category', 'name slug')
            .select('name category price mrp image thumbnail slug isBestSeller isNewLaunch discountPercent')
            .limit(8);

        const mappedProducts = products.map(product => ({
            ...product.toObject(),
            image: getFullUrl(product.thumbnail || product.image, req),
            category: product.category?.name || 'Uncategorized'
        }));

        res.json(mappedProducts);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user && r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            isApproved: false // Requires admin approval
        };

        product.reviews.push(review);
        // Stats are updated in pre-save hook, but only for approved reviews. 
        // Initial review won't affect stars until approved.

        await product.save();
        res.status(201).json({ message: 'Review submitted! Waiting for approval.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Approve a review
// @route   PUT /api/products/:id/reviews/:reviewId/approve
// @access  Private/Admin
const approveReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const review = product.reviews.id(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.isApproved = true;
        await product.save();

        res.status(200).json({ message: 'Review approved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.reviews = product.reviews.filter(
            (r) => r._id.toString() !== req.params.reviewId
        );

        await product.save();
        res.status(200).json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Product Stock (Quick Edit)
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
const updateProductStock = async (req, res) => {
    try {
        const { stock, variants } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (stock !== undefined) {
            product.stock = Number(stock);
        }

        if (variants && Array.isArray(variants)) {
            // Update color variant stock
            variants.forEach(v => {
                const color = product.colors.id(v._id) || product.colors.find(c => c.sku === v.sku);
                if (color) {
                    if (v.stock !== undefined) color.stock = Number(v.stock);
                }
            });
        }

        await product.save(); // Pre-save hook will recalculate statuses
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    createProductReview,
    approveReview,
    deleteReview,
    updateProductStock
};
