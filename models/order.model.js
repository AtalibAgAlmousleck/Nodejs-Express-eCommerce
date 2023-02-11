const mongodb = require('mongodb');

const db = require('../data/database');

class Order {
  // Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
       weekday: 'short',
       day: 'numeric',
       month: 'long',
       year: 'numeric'
      });
    }
    this.id = orderId;
  }

  //! transformOrderDocument
  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  //! find All Order
  static async findAll() {
    const orders = await db
      .getDb()
      .collection('orders')
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  //! Find all for user
  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  //! finnd by id
  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  //save order
  save() {
   if (this.id) {
   // updating
   const orderId = new mongodb.ObjectId(this.id);
   return db.getDb().collection('orders')
    .updateOne({ _id: orderId}, {$set: {status: this.status}});
   } else {
    // Saving order
    const orderDocument = {
     userData: this.userData,
     productData: this.productData,
     date: new Date(),
     status: this.status
    };
    return db.getDb().collection('orders').insertOne(orderDocument);
   }
  }

}

module.exports = Order;
