'use strict';
var _ = require('underscore');
var CSV = requireModule('csv');
var log = requireModule('logger').rest;
var h = requireModule('helper');

function handle(request, response, err) {
  var code = err.code;
  var error = err.error;

  log.info({err: err}, 'Building error response: ' + code);
  response.status(code);
  var errorDescriptionFilePath = __dirname + '/resources/RestErrors.csv';
  log.info('Parse error description file: ' + errorDescriptionFilePath);
  CSV.parse(errorDescriptionFilePath, function onParse(err, errorTable) {
    if (err) {
      log.error({err: err}, 'Error while parsing error file');
      response
        .status(500)
        .json(generateControllerError(
          response,
          'Error on server side (Cannot generate client error info)',
          // jscs:disable maximumLineLength
          'An error happened on server side while parsing the Error reference file',
          // jscs:enable maximumLineLength
          code,
          error,
          request
        ));
    } else {
      var errors = _.filter(errorTable, function filter(errorLine) {
        return errorLine[0] === code.toString();
      });
      if (0 === errors.length) {
        log.error(
          {err: err, errorFilePath: errorDescriptionFilePath},
          'Cannot find error code in error description file: ' + code);
        response
          .status(500)
          .json(generateControllerError(
            response,
            'Error on server side (Cannot generate client error info)',
            // jscs:disable maximumLineLength
            'An error happened on server side - Error code not recognized: ' + code,
            // jscs:enable maximumLineLength
            code,
            error,
            request
          ));
      } else if (1 === errors.length) {
        var line = errors[0];
        response
          .status(h.getAsInteger(line[1]))
          .json(generateError(
            code,
            line[1],
            line[2],
            line[3],
            5000 === error ? error : line[4],
            request
          ));
      } else {
        log.error(
          {err: err, errorFilePath: errorDescriptionFilePath},
          'Duplicate error code in error description file: ' + code);
        response
          .status(500)
          .json(generateControllerError(
            response,
            'Error on server side (Cannot generate client error info)',
            // jscs:disable maximumLineLength
            'An error happened on server side while parsing the Error reference file: duplicate code key:' + code,
            // jscs:enable maximumLineLength
            code,
            error,
            request
          ));
      }
    }
  });
}

function generateError(errorBodyOptions) {
  var toSend;
  if (undefined !== errorBodyOptions.request) {
    toSend = {
      url: h.request.getFullUrl(errorBodyOptions.request),
      method: errorBodyOptions.request.method,
    };
  }
  var errorResponseBody = {
    code: errorBodyOptions.code,
    httpStatus: errorBodyOptions.httpStatus,
    moreInfoUri: errorBodyOptions.moreInfoUri,
    message: errorBodyOptions.message,
    developerMessage: errorBodyOptions.developerMessage,
    request: toSend,
    time: new Date().toISOString(),
  };
  log.debug({response: errorResponseBody}, 'Error response body built');
  return errorResponseBody;
}

function generateControllerError(errorBodyOptions) {
  var responseBody = generateError({
    code: 50000,
    httpStatus: 500,
    moreInfoUrl: '',
    message: errorBodyOptions.message,
    developerMessage: errorBodyOptions.developerMessage,
    request: errorBodyOptions.request,
  });
  responseBody.original = {
    code: errorBodyOptions.original.code,
    error: errorBodyOptions.original.error,
  };
  log.debug(
    {response: responseBody},
    'Error response body extended with original code/error');
  return responseBody;
}

module.exports.handle = handle;
