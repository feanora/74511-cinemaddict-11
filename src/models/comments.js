export default class Comments {
  constructor() {
    this._comments = [];
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = Array.from(comments);
  }

  getCommentsByIds(ids) {
    return ids.map((it) => this._comments.find((comment) => comment.id === it));
  }

  deleteComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));
    return true;
  }

  addComment(comment) {
    this._comments = [].concat(comment, this._comments);
  }
}
