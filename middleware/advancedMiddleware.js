const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
  let reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ["select", "sort", 'page', 'limit'];

  // remove fields from query
  removeFields.forEach(param => delete reqQuery[param]);

  // create mongo operators from  req.query averageCost[lte]=10000 to {"averageCost":{"$lte":"10000"},"location.city":"Boston"}
  const queryString = JSON.stringify(reqQuery).replace(/\b gt|lt|lte|gte|in\b/g,match => `$${match}` );
  
  query = model.find(JSON.parse(queryString));

  // query with select in it
  if (req.query.select) {
    // req.query.select = select=name,description
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // query with sort in it
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  if(populate) {
      query = query.populate(populate);
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1)*limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  const results = await query;

  // Pagination result
  const pagination = {};
  if(endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }

  }
  if(startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit
    }

  }
  res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
  }
  next();

}
module.exports = advancedResults;