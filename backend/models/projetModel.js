const mongoose = require('mongoose');

const ProjetSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: [true, 'Le libellé est obligatoire'],
      trim: true,
    },
    sourceImage: { type: String, default: '' },
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
    },
    technologie: { type: String, default: 'Non précisé' },
    dateCreation: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Projet', ProjetSchema);


