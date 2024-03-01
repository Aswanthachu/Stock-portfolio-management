import mongoose from 'mongoose'

const resetAttemptSchema =  mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const ResetAttempt = mongoose.model('ResetAttempt', resetAttemptSchema);

export default ResetAttempt;