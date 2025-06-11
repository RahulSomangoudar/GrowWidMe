const { db } = require('../config/firebase');

class User {
  static collection = db.collection('users');

  static async create(userData) {
    const userRef = this.collection.doc();
    await userRef.set({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return userRef.id;
  }

  static async findByEmail(email) {
    const snapshot = await this.collection.where('email', '==', email).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, data) {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date()
    });
  }
}

module.exports = User;
