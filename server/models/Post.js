const { db } = require('../config/firebase');

class Post {
  static collection = db.collection('posts');

  static async create(postData) {
    const postRef = this.collection.doc();
    await postRef.set({
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return postRef.id;
  }

  static async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async findByUserId(userId) {
    const snapshot = await this.collection.where('createdBy', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async update(id, data) {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date()
    });
  }

  static async delete(id) {
    await this.collection.doc(id).delete();
  }

  static async search(query) {
    const snapshot = await this.collection.get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = Post;
