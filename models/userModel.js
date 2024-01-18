const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      maxlength: 50
    },
    email: String,
    password: String,
  },
  {
    timestamps: true
  }
)


// 数据格式化处理 transform
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("User", userSchema);
