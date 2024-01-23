const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, "Uid is required"],
      unique: true
    },
    username: {
      type: String,
      maxlength: 50
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
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
