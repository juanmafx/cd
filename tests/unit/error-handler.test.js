import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import { createErrorHandler } from '../../src/http/middleware/error-handler.js';

const createResponse = (headersSent = false) => {
  const response = { headersSent, statusCode: undefined, contentType: undefined, body: undefined };
  response.status = (code) => {
    response.statusCode = code;
    return response;
  };
  response.type = (value) => {
    response.contentType = value;
    return response;
  };
  response.send = (value) => {
    response.body = value;
    return response;
  };
  return response;
};

test('delegates when headers were already sent', () => {
  const next = mock.fn();
  const error = new Error('late failure');
  createErrorHandler(mock.fn())(error, {}, createResponse(true), next);
  assert.deepEqual(next.mock.calls[0].arguments, [error]);
});

test('hides internal error messages and logs only the error name', () => {
  const logError = mock.fn();
  const response = createResponse();
  createErrorHandler(logError)(new TypeError('internal detail'), {}, response, mock.fn());
  assert.equal(response.statusCode, 500);
  assert.equal(response.body, 'Internal Server Error');
  assert.deepEqual(logError.mock.calls[0].arguments, ['Request failed: TypeError']);
});

test('maps client errors to a generic body', () => {
  const error = Object.assign(new URIError('raw path detail'), { status: 400 });
  const response = createResponse();
  createErrorHandler(mock.fn())(error, {}, response, mock.fn());
  assert.equal(response.statusCode, 400);
  assert.equal(response.body, 'Bad Request');
});

test('treats non-client status values as server errors', () => {
  const error = Object.assign(new Error('upstream'), { status: 503 });
  const response = createResponse();
  createErrorHandler(mock.fn())(error, {}, response, mock.fn());
  assert.equal(response.statusCode, 500);
});
