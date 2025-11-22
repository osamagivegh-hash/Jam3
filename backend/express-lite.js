const http = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');

function enhanceRes(res) {
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };

  res.json = function (payload) {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(payload));
  };

  res.send = function (payload) {
    if (typeof payload === 'object') {
      return res.json(payload);
    }
    res.end(payload);
  };

  return res;
}

function matchPath(target, basePath) {
  if (!basePath || basePath === '/') return true;
  if (target === basePath) return true;
  return target.startsWith(basePath.endsWith('/') ? basePath : `${basePath}/`);
}

function express() {
  const middlewares = [];
  const routes = [];

  const app = function handler(req, res) {
    enhanceRes(res);
    const parsedUrl = parse(req.url, true);
    req.path = parsedUrl.pathname || '/';
    req.query = parsedUrl.query || {};

    let idx = -1;

    const stack = [];

    middlewares.forEach(({ path: basePath, fn }) => {
      if (!basePath || matchPath(req.path, basePath)) {
        stack.push(fn);
      }
    });

    const route = routes.find((r) => r.method === req.method && r.path === req.path);
    if (route && route.handlers.length) {
      stack.push(...route.handlers);
    } else {
      stack.push((req, res) => res.status(404).json({ message: 'Not Found' }));
    }

    const run = (error) => {
      idx += 1;
      if (error) {
        res.status(500).json({ message: error.message || 'Server error' });
        return;
      }

      if (idx >= stack.length) return;

      try {
        const maybePromise = stack[idx](req, res, (nextErr) => run(nextErr));
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.catch((nextErr) => run(nextErr));
        }
      } catch (err) {
        run(err);
      }
    };

    run();
  };

  app.use = function use(pathOrFn, fn) {
    if (typeof pathOrFn === 'string') {
      middlewares.push({ path: pathOrFn, fn });
    } else {
      middlewares.push({ path: undefined, fn: pathOrFn });
    }
  };

  ['GET', 'POST', 'PUT', 'DELETE'].forEach((method) => {
    app[method.toLowerCase()] = (routePath, ...handlers) => {
      routes.push({ method, path: routePath, handlers });
    };
  });

  app.listen = function listen(port, cb) {
    const server = http.createServer(app);
    return server.listen(port, cb);
  };

  return app;
}

express.json = function jsonParser() {
  return (req, res, next) => {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
      next();
      return;
    }

    let data = '';
    req.on('data', (chunk) => {
      data += chunk.toString();
    });

    req.on('end', () => {
      try {
        req.body = data ? JSON.parse(data) : {};
        next();
      } catch (error) {
        res.status(400).json({ message: 'Invalid JSON payload' });
      }
    });
  };
};

express.static = function staticHandler(root) {
  const absoluteRoot = path.resolve(root);
  return (req, res, next) => {
    const filePath = path.join(absoluteRoot, decodeURIComponent(req.path.replace(/^\//, '')));
    if (!filePath.startsWith(absoluteRoot)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        next();
        return;
      }

      const stream = fs.createReadStream(filePath);
      stream.on('error', () => res.status(500).json({ message: 'File error' }));
      stream.pipe(res);
    });
  };
};

module.exports = express;
