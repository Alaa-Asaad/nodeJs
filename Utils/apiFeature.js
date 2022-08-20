class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtter() {
    //1A)Filltering
    const queryObj = { ...this.queryString };
    const exludedFildes = ['page', 'limit', 'fields', 'sort'];
    exludedFildes.forEach((el) => delete queryObj[el]);

    //1B)Advanced Filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    //3)Select  Fields to Return or limit the result
    if (this.queryString.fields) {
      const limitBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(limitBy);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagnate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
