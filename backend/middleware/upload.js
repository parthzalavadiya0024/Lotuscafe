const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Images folder path (Project Root/images)
const imagesPath = path.join(__dirname, "../../images");

// Folder ન હોય તો create કરી દે
if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesPath);
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;

    const ext = allowed.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mime = allowed.test(file.mimetype);

    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."));
    }
};

module.exports = multer({
    storage,
    fileFilter
});