const buildBlogQuery = (req, isOwner = false) => {
    let query = {};
    let sort = {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Default to 20 blogs per page
    const skip = (page - 1) * limit;

    // Filter blog by state
    if (isOwner && req.query.state) {
        query.state = req.query.state; 
    } else if (!isOwner) {
        query.state = 'published'; 
    }

    // Search by title or tags
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i'); 
        query.$or = [{ title: searchRegex }, { tags: searchRegex }];
    }



    // Ordering (sort)
    if (req.query.orderBy) {
        switch (req.query.orderBy) {
            case 'read_count':
                sort.read_count = parseInt(req.query.order) || -1; 
                break;
            case 'reading_time':
                sort.reading_time = parseInt(req.query.order) || -1;
                break;
            case 'timestamp':
                sort.timestamp = parseInt(req.query.order) || -1; 
                break;
            default:
                sort.timestamp = -1; 
        }
    } else {
        sort.timestamp = -1;
    }

    return { query, sort, page, limit, skip };
};

module.exports = { buildBlogQuery };