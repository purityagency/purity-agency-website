const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const logger = require('./logger');

const cache = new Map();

// Helper to pre-gzip static assets
function getCachedFile(filePath) {
  if (cache.has(filePath)) {
    return cache.get(filePath);
  }

  try {
    const raw = fs.readFileSync(filePath);
    const gzip = zlib.gzipSync(raw, { level: 6 });
    const fileObj = { raw, gzip, mtime: fs.statSync(filePath).mtimeMs };
    
    cache.set(filePath, fileObj);
    return fileObj;
  } catch (err) {
    logger.error(`Error caching file: ${filePath}`, err);
    return null;
  }
}

// Watch directory for changes and invalidate cache automatically
function watchDirectory(dirPath) {
  const invalidate = (eventType, filename) => {
    if (filename) {
      const fullPath = path.join(dirPath, filename);
      if (cache.has(fullPath)) {
        logger.info(`Invalidating cache for modified file: ${filename}`);
        cache.delete(fullPath);
      }
    }
  };
  try {
    fs.watch(dirPath, { recursive: true }, invalidate);
  } catch (err) {
    logger.warn(`Recursive cache watch unavailable for ${dirPath}: ${err.message}`);
    try { fs.watch(dirPath, invalidate); } catch (fallbackErr) {
      logger.warn(`Cache watch unavailable for ${dirPath}: ${fallbackErr.message}`);
    }
  }
}

module.exports = {
  getCachedFile,
  watchDirectory
};
