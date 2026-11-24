import http from 'node:http';

export const sendRaw = (port, { method = 'GET', path = '/' } = {}) =>
  new Promise((resolve, reject) => {
    const request = http.request({ host: '127.0.0.1', port, method, path }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () =>
        resolve({
          status: response.statusCode,
          headers: response.headers,
          body: Buffer.concat(chunks).toString('utf8'),
        }),
      );
    });
    request.on('error', reject);
    request.end();
  });
