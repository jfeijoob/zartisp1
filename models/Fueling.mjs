import mongoose from 'mongoose';
const Fueling = new mongoose.Schema( {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    liters: Number,
    literPrice: String,
    date: Date,
    amount: Number,
    odometer: Number
} );

export default Fueling;