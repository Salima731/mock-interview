const fs = require('fs');
const path = require('path');

/**
 * Deletes one or multiple image files from the server.
 * @param {string | string[]} images - Image path(s) relative to the project root.
 */
const deleteImages = async (images) => {
    if (!images) return;

    const imagePaths = Array.isArray(images) ? images : [images];

    await Promise.all(imagePaths.map(async (imgPath) => {
        const absolutePath = path.resolve(imgPath);
        try {
            if (fs.existsSync(absolutePath)) {
                await fs.promises.unlink(absolutePath);
                console.log(`🧹 Deleted image: ${absolutePath}`);
            } else {
                console.warn(`⚠️ Image not found: ${absolutePath}`);
            }
        } catch (err) {
            console.error(`❌ Failed to delete ${absolutePath}: ${err.message}`);
        }
    }));
};

module.exports = deleteImages;