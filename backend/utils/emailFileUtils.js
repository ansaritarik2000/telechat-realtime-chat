import multer from "multer";
import csv from "csv-parser";
import XLSX from "xlsx";
import fs from "fs";
import { getValidUniqueEmails } from "./emailsValidation.js";

// Supported file types
const supportedMimeTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
];

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/";

        // Check if directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// File filter to check file type before uploading
const fileFilter = (req, file, cb) => {
    if (supportedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Unsupported file type"), false); // Reject file
    }
};

// Multer middleware with file filter and error handling
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

// CSV File Reader
export const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
};

// Excel File Reader (XLSX and XLS)
export const readExcel = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    return data;
};

// File Processing Function
export const processFile = async (file) => {
    const filePath = file.path;
    const fileType = file.mimetype;
    let fileData;

    if (fileType === "text/csv") {
        fileData = await readCSV(filePath);
    } else if (
        fileType ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileType === "application/vnd.ms-excel"
    ) {
        fileData = readExcel(filePath);
    } else {
        throw new Error("Unsupported file type");
    }

    // Extract and validate emails
    const emails = fileData
        .map((row) => row["emails"])
        .filter(Boolean);

    if (emails.length === 0) {
        throw new Error(
            "Missing 'emails' column or no emails found"
        );
    }

   // This function gets valid, invalid, and unique emails
    const { validEmails, invalidEmails } =
    getValidUniqueEmails (emails);

    // Get the rows where emails are valid
    const validRows = fileData.filter((row) =>
        validEmails.includes(row["emails"])
    );

    // Extract column names (keys) from the first row
    const columns = fileData.length > 0 ? Object.keys(fileData[0]) : [];

    // Return emails, full row data, valid row data, and columns
    return {
        allEmails: emails,
        invalidEmails,
        validEmails,
        validRows, // rows with valid emails 
        allData: fileData,
        columns,
    };

    return { emails};
};

// Upload to Supabase
export const uploadToSupabase = async (file, supabase) => {
    const filePath = file.path;

    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
        .from("telepiefile")
        .upload(`uploads/${file.filename}`, fileBuffer, {
            contentType: file.mimetype, // Specify the  content type
        });

    if (error) throw error;
    // Clean up local file after upload
    fs.unlinkSync(filePath);

    return { data, error };
};
