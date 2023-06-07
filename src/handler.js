const { nanoid } = require("nanoid");
const bookshelf = require("./bookshelf.js");

const saveBooks = (request, h) => {
  const id = nanoid(16);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = readPage === pageCount ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined || name === "" || name === null) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(newBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });
  return response;
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const response = h.response({
      status: "success",
      data: {
        books: bookshelf
          .filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
          )
          .map(({ id, name, publisher }) => ({
            id,
            name,
            publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    if (reading === "1") {
      const response = h.response({
        status: "success",
        data: {
          books: bookshelf
            .filter((b) => b.reading === true)
            .map(({ id, name, publisher }) => ({
              id,
              name,
              publisher,
            })),
        },
      });
      response.code(200);
      return response;
    } else if (reading === "0") {
      const response = h.response({
        status: "success",
        data: {
          books: bookshelf
            .filter((b) => b.reading === false)
            .map(({ id, name, publisher }) => ({
              id,
              name,
              publisher,
            })),
        },
      });
      response.code(200);
      return response;
    } else {
      const response = h.response({
        status: "fail",
        message: "Gagal mencari buku",
      });
      response.code(400);
      return response;
    }
  }

  if (finished) {
    if (finished === "1") {
      const response = h.response({
        status: "success",
        data: {
          books: bookshelf
            .filter((b) => b.finished === true)
            .map(({ id, name, publisher }) => ({
              id,
              name,
              publisher,
            })),
        },
      });
      response.code(200);
      return response;
    } else if (finished === "0") {
      const response = h.response({
        status: "success",
        data: {
          books: bookshelf
            .filter((b) => b.finished === false)
            .map(({ id, name, publisher }) => ({
              id,
              name,
              publisher,
            })),
        },
      });
      response.code(200);
      return response;
    } else {
      const response = h.response({
        status: "fail",
        message: "Gagal mencari buku",
      });
      response.code(400);
      return response;
    }
  }

  const response = h.response({
    status: "success",
    data: {
      books: bookshelf.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookDetailsById = (request, h) => {
  const { bookId } = request.params;
  const book = bookshelf.filter((b) => b.id === bookId)[0];

  if (book === undefined) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const updateBookById = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const finished = readPage === pageCount ? true : false;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const index = bookshelf.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = bookshelf.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  saveBooks,
  getAllBooks,
  getBookDetailsById,
  updateBookById,
  deleteBookById,
};
