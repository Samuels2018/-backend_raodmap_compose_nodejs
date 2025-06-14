import { FindOptions, WhereOptions } from 'sequelize';

interface QueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  fields?: string;
  [key: string]: any;
}

class APIFeatures<T> {
  constructor(
    private model: any,
    private queryParams: QueryParams,
    private where: WhereOptions<T> = {}
  ) {}

  filter() {
    const queryObj = { ...this.queryParams };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.where = { ...this.where, ...JSON.parse(queryStr) };

    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(',').map((field) => {
        if (field.startsWith('-')) {
          return [field.slice(1), 'DESC'] as [string, 'DESC'];
        }
        return [field, 'ASC'] as [string, 'ASC'];
      });
      this.options.order = sortBy;
    } else {
      this.options.order = [['createdAt', 'DESC']];
    }

    return this;
  }

  limitFields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(',');
      this.options.attributes = fields;
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryParams.page || '1', 10);
    const limit = parseInt(this.queryParams.limit || '10', 10);
    const offset = (page - 1) * limit;

    this.options.limit = limit;
    this.options.offset = offset;

    return this;
  }

  private options: FindOptions = {};

  async execute() {
    const results = await this.model.findAll({
      ...this.options,
      where: this.where,
    });

    const total = await this.model.count({ where: this.where });

    return {
      data: results,
      total,
      page: parseInt(this.queryParams.page || '1', 10),
      limit: parseInt(this.queryParams.limit || '10', 10),
    };
  }
}

export default APIFeatures;