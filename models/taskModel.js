const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema(
  {
    text: { type: String, required: [true, 'Please add a text value'] },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }

  },
  {
    timestamps: true
  }
)


// 数据格式化处理 transform
taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model("Task", taskSchema);
