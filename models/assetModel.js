import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },

  // Status and Assignment
  status: {
    type: String,
    enum: ['available', 'assigned', 'maintenance', 'retired'],
    default: 'available',
  },
  assignedTo: { type: ObjectId, ref: 'User' }, // Reference to User

  // Purchase Information
  purchaseDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  supplier: { type: String, required: true },

  // Location and Identification
  location: { type: String, required: true },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good',
  },
  serialNumber: { type: String, unique: true, sparse: true },

  // Maintenance and Warranty
  lastMaintenanceDate: { type: Date },
  nextMaintenanceDate: { type: Date },
  warrantyExpiry: { type: Date },

  // Metadata
  tags: [{ type: String }],
  images: [{ type: String }], // Array of image URLs

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Asset = mongoose.model('Asset', assetSchema);

// db.assets.createIndex({ code: 1 }, { unique: true })
// db.assets.createIndex({ status: 1 })
// db.assets.createIndex({ category: 1 })
// db.assets.createIndex({ assignedTo: 1 })
// db.assets.createIndex({ serialNumber: 1 }, { sparse: true })

export default Asset;
