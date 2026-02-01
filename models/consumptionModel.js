// models/consumption.js
const consumptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // 正数为充值，负数为消费
  type: { type: String, enum: ["recharge", "download"] },
  createdAt: { type: Date, default: Date.now },
});

// 数据格式化处理 transform
consumptionSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Consumption", consumptionSchema);
