/* ************************************************************************** */
/* /src/models/carts.js - Mongoose-definición de un esquema de carrito y creación
 de un modelo correspondiente */
/* ************************************************************************** */

const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true, collection: 'carts' }
);

cartSchema.plugin(mongoosePaginate);

const Cart = model('Cart', cartSchema);

module.exports = {
  Cart,
};
