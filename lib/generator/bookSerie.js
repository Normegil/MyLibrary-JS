'use strict';

var async = require('async');

var h = requireModule('helper');
var log = requireModule('logger').generator;
var CSV = requireModule('csv');

var BookSerie = requireModule('books').BookSerie;
var titleList = [];
var authorList = [];
var genreList = [];

function initGeneration(callback) {
  var bookTitlesFilePath = __dirname + './resources/books-titles.csv';
  var bookAuthorsFilePath = __dirname + './resources/books-authors.csv';
  var bookGenresFilePath = __dirname + './resources/books-genres.csv';

  log.info('Parsing file containing titles: ' + bookTitlesFilePath);
  CSV.parse(bookTitlesFilePath, function onTitleListParsed(err, titles) {
    if (err) {
      return callback(err);
    }
    titleList = titles;
    log.info('Parsing file containing authors: ' + bookAuthorsFilePath);
    CSV.parse(bookAuthorsFilePath, function onAuthorListParsed(err, authors) {
      if (err) {
        return callback(err);
      }
      authorList = authors;
      log.info('Parsing file containing genres: ' + bookGenresFilePath);
      CSV.parse(bookGenresFilePath, function onGenreListParsed(err, genres) {
        if (err) {
          return callback(err);
        }
        genreList = genres;
        return callback();
      });
    });
  });
}

function generate(numberOfBookSerie, onBooksGenerated) {
  log.info('Generate ' + numberOfBookSerie + ' Books');
  initGeneration(function onInitialized(err) {
    if (err) {
      return onBooksGenerated(err);
    }
    async.each(
      h.getArrayOfIndex(numberOfBookSerie),
      generateBookSerie,
      function onGenerated(err) {
        if (err) {
          return onBooksGenerated(err);
        }
        log.info('Books generated');
        onBooksGenerated();
      }
    );
  });
}

function clean(callback) {
  log.info('Clean books');
  BookSerie.find(function onFound(err, books) {
    if (err) {
      return callback(err);
    }
    async.each(
      books,
      removeBook,
      callback
    );
  });
}

function generateBookSerie(index, onGenerated) {
  /* jshint maxstatements:false */
  log.debug('Generate BookSerie');
  var bookSerie = new BookSerie();
  bookSerie.title = getTitle();
  bookSerie.description = getLoremIpsum();
  bookSerie.tags = [
    'tag1' + index,
    'tag2' + index,
    'tag3' + index,
  ];
  bookSerie.urls = [
    {website: 'wikipedia', url: 'http://wikipedia.com'},
  ];
  if (h.getRandomBoolean()) {
    bookSerie.status = 'Ongoing';
  } else {
    bookSerie.status = 'Finished';
  }
  bookSerie.alternativeTitles = [];
  bookSerie.books = [];
  var alternativeTitles = generateAlternativeTitles();
  bookSerie.alternativeTitles.push.apply(
    bookSerie.alternativeTitles,
    alternativeTitles);
  var numberOfBooks = h.getRandomInteger(3) + 1;
  async.each(
    h.getArrayOfIndex(numberOfBooks),
    function generateBookAndAttachToSerie(index, callback) {
      generateBook(index, bookSerie, callback);
    },
    function onBooksGenerated(err) {
      if (err) {
        return onGenerated(err);
      }
      log.debug('BookSerie generated');
      bookSerie.save(onGenerated);
    }
  );
}

function generateBook(index, bookSerie, callback) {
  /* jshint maxstatements:false */
  log.debug('Generate book');
  var book = {};
  book.isbn = '978-1-56581-231-4';
  book.title = getTitle();
  book.description = index + getLoremIpsum();
  book.tags = [
    'iitag1' + index,
    'itag2' + index,
    'itag3' + index,
  ];
  book.releaseDate = new Date();

  book.alternativeTitles = [];
  book.authors = [];
  book.genres = [];
  var alternativeTitles = generateAlternativeTitles();
  book.alternativeTitles.push.apply(book.alternativeTitles, alternativeTitles);
  var authors = generateAuthors();
  book.authors.push.apply(book.authors, authors);
  var genres = generateGenres();
  book.genres.push.apply(book.genres, genres);
  bookSerie.books.push(book);
  return callback();
}

function generateAlternativeTitles() {
  var alternativeTitles = [];
  var numberOfAlternativeTitles = h.getRandomInteger(2) + 1;
  for (var i = 0;i < numberOfAlternativeTitles;i++) {
    alternativeTitles.push(getTitle());
  }
  return alternativeTitles;
}

function generateAuthors() {
  var authors = [];
  var numberOfAuthors = h.getRandomInteger(3) + 1;
  for (var j = 0;j < numberOfAuthors;j++) {
    authors.push(getAuthor());
  }
  return authors;
}

function generateGenres() {
  var genres = [];
  var numberOfGenres = h.getRandomInteger(2) + 1;
  for (var k = 0;k < numberOfGenres;k++) {
    genres.push(getGenre());
  }
  return genres;
}

function removeBook(book, callback) {
  BookSerie.remove(book, callback);
}

function getTitle() {
  return titleList[h.getRandomInteger(titleList.length)][0];
}

function getAuthor() {
  return authorList[h.getRandomInteger(authorList.length)][0];
}

function getGenre() {
  return genreList[h.getRandomInteger(genreList.length)][0];
}

function getLoremIpsum() {
  // jscs:disable maximumLineLength
  return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum, ligula pulvinar interdum tristique, erat tellus vehicula lacus, non euismod neque nibh a tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut feugiat fermentum justo, sed rhoncus neque lobortis quis. Aliquam erat volutpat. Sed eget egestas mi. Integer condimentum congue ultrices. Cras eu ligula sit amet tortor laoreet consectetur. Nullam blandit id velit vitae feugiat. Suspendisse potenti. Nullam justo magna, molestie lobortis orci ac, consequat pharetra ipsum. Proin et diam ac enim viverra semper nec porta ante. Donec vel auctor mi, tincidunt scelerisque ante. Vivamus vitae dui mauris. Vestibulum nulla quam, gravida quis lectus eget, vehicula venenatis libero. Sed condimentum, orci non venenatis gravida, turpis massa egestas velit, et tempus lacus sem ut ex.\n\nDonec at nunc nec odio faucibus volutpat eget et metus. Donec pharetra sem sed risus fringilla pharetra. Nam eget nisi sed urna porta mollis quis ac nulla. Mauris tincidunt nibh ut lacus efficitur, eu mattis ipsum condimentum. Curabitur nec elit quis est tempor suscipit tincidunt ac elit. Vestibulum sit amet lectus fringilla, fringilla ante eu, eleifend sem. Nullam viverra ultrices nulla, vitae maximus sapien gravida id. Donec augue ligula, mollis ac nisi a, fermentum luctus neque. Nam egestas justo justo, sit amet pellentesque dui pharetra sit amet. Etiam sed purus orci. Vivamus odio neque, sagittis a molestie non, pellentesque non augue. Nulla eu tellus at lorem ornare finibus eget ac sapien. Vivamus gravida eros eget suscipit pellentesque. Integer ut elementum purus. Morbi elementum diam non tortor fringilla pretium. Ut eget consectetur risus.\n\nIn gravida, justo eget scelerisque ullamcorper, ante velit posuere nunc, nec ornare justo quam ut dolor. Nullam quis elementum felis, eu facilisis arcu. Nullam pharetra arcu sed nisl mattis ullamcorper. Sed et venenatis nisi. In erat eros, sagittis sed ultricies id, aliquam vitae risus. Aenean maximus eleifend orci, a lacinia magna sodales nec. Vestibulum sit amet auctor lectus. Suspendisse tempor dolor et auctor faucibus. Donec varius lacinia eros, vel pharetra arcu dictum vitae. Sed ultrices elit sit amet odio elementum, vestibulum imperdiet arcu accumsan. Mauris convallis aliquam erat, et commodo tellus aliquet ut. Cras quam massa, mattis eget ex ut, ornare sollicitudin nulla. Ut sed malesuada nibh. Proin sit amet dolor quis sapien vulputate convallis vel id mi. Aliquam tellus urna, rhoncus ac neque porttitor, consequat malesuada tortor. Vestibulum ligula diam, facilisis nec vulputate eget, aliquet ac enim.\n\nFusce quam mauris, congue a scelerisque ac, mattis quis est. Suspendisse et magna id turpis malesuada commodo. Proin nunc quam, facilisis quis maximus sed, pulvinar a nisi. Curabitur varius nisi et sem vehicula, vitae porta enim tempus. Aliquam sit amet justo luctus, vulputate dui ac, suscipit urna. Cras id volutpat est. In a leo tristique, vulputate tellus in, pulvinar augue. Sed eu dapibus velit, a venenatis mi. Donec sit amet dui sed felis tincidunt faucibus sed eget turpis. Morbi neque tortor, aliquet a lobortis ac, vehicula id tortor. Vestibulum nisl ligula, dictum a odio id, mattis interdum tortor. Nulla suscipit dolor magna, nec auctor ex lobortis in. Nam auctor nisl sit amet augue rhoncus, in interdum nisi ullamcorper. Vivamus eget fringilla sem. Nunc egestas eu sem eget egestas.\n\n Suspendisse tempus lacinia lacus vel tempor. Integer sodales augue lacus, eu molestie augue fringilla ac. Donec quis fermentum erat, ut ullamcorper odio. Fusce dictum risus pellentesque velit vulputate, vel malesuada lacus hendrerit. Sed sodales dui in eros egestas, non auctor ipsum interdum. Integer vitae finibus purus. Duis nec rutrum quam. Phasellus mollis erat eget quam tristique varius. Fusce id euismod dolor, et imperdiet tortor. Quisque elementum nunc vitae tellus tempor, sed fringilla urna sollicitudin. Nunc quis pulvinar purus, nec iaculis ante. Pellentesque gravida maximus vestibulum. Etiam ac purus non arcu condimentum fringilla. Duis feugiat, libero sed scelerisque posuere, augue tellus cursus leo, et tempus mauris lorem dignissim nulla. Vivamus fringilla sem dapibus, luctus quam auctor, feugiat ipsum. Vivamus faucibus nisi in turpis convallis, non imperdiet arcu porttitor.';
  // jscs:enable maximumLineLength
}

module.exports.generate = generate;
module.exports.clean = clean;
