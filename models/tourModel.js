const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have Max 40 character'],
      minlength: [10, 'A tour must have Min 10 character'],
      // validate: [validator.isAlpha, 'the Name of Tour must be only Alphbet'],
    },
    slug: {
      type: String,
      default: 'undfiend',
    },
    duration: {
      type: Number,
      required: [true, 'A Tour must have Duration'],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have Max Group number'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have Difficuilty'],
      enum: {
        values: ['easy', 'medium', 'difficlt'],
        message: 'Difficulty can  be one of This easy ,medium , difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must at Least 1'],
      max: [10, 'Rating must at most 10'],
    },
    ratingsQuantity: Number,
    price: {
      type: Number,
      required: [true, 'A tour must have a Price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discont ({VALUE}) must be lower the price',
      },
      default: 0,
    },
    summary: {
      type: String,
      required: true,
    },
    description: String,
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    startDates: [Date],
    secertTour: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//to add fields not presist to database only show on the results
tourSchema.virtual('duartionWeeks').get(function () {
  return this.duration / 7;
});

//MiddleWare that runs before .save() or .create() on documents

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//MiddleWare that runs before find query
tourSchema.pre(/^find/, function (next) {
  this.find({ secertTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`query took ${Date.now() - this.start} milleSecond`);
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secertTour: { $ne: true } } });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// U Can add Many pre MiddleWare on save hooks as you wants
// tourSchema.pre('save', (next) => {
//   console.log('WIll run the MiddleWare Documents');
//   next();
// });
//MiddeWare That runs after .save() or .create() on document
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });
