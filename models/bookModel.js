const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      maxlength: 50,
      required: [true, 'Book must add a title']
    },
    topics: {
      type: [String],
      maxlength: 50,
      required: [true, 'Book must add a topic']
    },
    coverUrl: {
      type: String,
      // required: [true, 'Book must add a topic']
      default: ""
    },
    downloadUrl: {
      type: String,
      default: ""
    },
    panUrl: {
      type: String,
      default: ""
    },
    ISBN: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
)


// 数据格式化处理 transform
bookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model("Book", bookSchema);
