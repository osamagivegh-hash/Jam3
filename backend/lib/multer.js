const fs = require('fs');
const path = require('path');

function diskStorage(options = {}) {
  const destination = options.destination || ((req, file, cb) => cb(null, ''));
  const filename = options.filename || ((req, file, cb) => cb(null, file.originalname));
  return { destination, filename };
}

function bufferSplit(buffer, delimiter) {
  const parts = [];
  let start = 0;
  let index = buffer.indexOf(delimiter);
  while (index !== -1) {
    parts.push(buffer.slice(start, index));
    start = index + delimiter.length;
    index = buffer.indexOf(delimiter, start);
  }
  parts.push(buffer.slice(start));
  return parts;
}

function parseMultipartBody(body, boundary) {
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const rawParts = bufferSplit(body, boundaryBuffer).slice(1, -1); // Skip preamble and final boundary
  const parts = [];

  rawParts.forEach((part) => {
    // Remove leading CRLF
    if (part.slice(0, 2).toString() === '\r\n') {
      part = part.slice(2);
    }

    const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
    if (headerEnd === -1) return;

    const headerText = part.slice(0, headerEnd).toString('utf8');
    let content = part.slice(headerEnd + 4);

    // Remove trailing CRLF if present
    if (content.slice(-2).toString() === '\r\n') {
      content = content.slice(0, -2);
    }

    const dispositionMatch = /name="?([^";]+)"?(?:;\s*filename="?([^";]*)"?)?/i.exec(headerText);
    if (!dispositionMatch) return;

    const name = dispositionMatch[1];
    const filename = dispositionMatch[2];
    const typeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(headerText);

    parts.push({
      name,
      filename,
      headers: headerText,
      mimetype: typeMatch ? typeMatch[1].trim() : 'application/octet-stream',
      content
    });
  });

  return parts;
}

function multer(options = {}) {
  const storage = options.storage || diskStorage();
  const fileFilter = options.fileFilter;

  function single(fieldName) {
    return (req, res, next) => {
      const contentType = req.headers['content-type'] || '';
      const boundaryMatch = /boundary=(?:(?:"([^\"]+)")|([^;]+))/i.exec(contentType);
      if (!boundaryMatch) {
        next(new Error('Invalid multipart/form-data request.'));
        return;
      }

      const boundary = boundaryMatch[1] || boundaryMatch[2];
      const chunks = [];

      req.on('data', (chunk) => chunks.push(chunk));
      req.on('error', (err) => next(err));
      req.on('end', () => {
        try {
          const body = Buffer.concat(chunks);
          const parts = parseMultipartBody(body, boundary);
          const filePart = parts.find((part) => part.name === fieldName && part.filename);

          if (!filePart) {
            next(new Error('No file uploaded.'));
            return;
          }

          const file = {
            fieldname: fieldName,
            originalname: filePart.filename,
            mimetype: filePart.mimetype,
            size: filePart.content.length
          };

          const continueWithStorage = () => {
            storage.destination(req, file, (destErr, destination) => {
              if (destErr) {
                next(destErr);
                return;
              }

              const safeDestination = destination || '';
              fs.mkdirSync(safeDestination, { recursive: true });

              storage.filename(req, file, (nameErr, finalName) => {
                if (nameErr) {
                  next(nameErr);
                  return;
                }

                const finalFilename = finalName || file.originalname;
                const filePath = path.join(safeDestination, finalFilename);
                fs.writeFile(filePath, filePart.content, (writeErr) => {
                  if (writeErr) {
                    next(writeErr);
                    return;
                  }

                  req.file = {
                    ...file,
                    destination: safeDestination,
                    filename: finalFilename,
                    path: filePath
                  };
                  next();
                });
              });
            });
          };

          if (typeof fileFilter === 'function') {
            fileFilter(req, file, (filterErr, passed) => {
              if (filterErr || passed === false) {
                next(filterErr || new Error('File rejected by filter.'));
                return;
              }
              continueWithStorage();
            });
          } else {
            continueWithStorage();
          }
        } catch (error) {
          next(error);
        }
      });
    };
  }

  return { single };
}

multer.diskStorage = diskStorage;

module.exports = multer;
