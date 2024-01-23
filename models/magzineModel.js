const mongoose = require("mongoose");


const magzineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      maxlength: 13,
      unique: true
    },
    type: String,
    coverUrl: String,
    panUrl: String,
    datetime: {
      type: Date,
      required: true
    },
    tags: String     // 数据验证
  },
  {
    timestamps: true
  }
)


// 数据格式化处理 transform
magzineSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Magzine", magzineSchema);
