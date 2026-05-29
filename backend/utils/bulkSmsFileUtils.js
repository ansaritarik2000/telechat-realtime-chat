import fs from "fs";
import multer from "multer";
import XLSX from "xlsx";
import csv from "csv-parser";

// Supported file types
const supportedMimeTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
];

// Multer storage setup for temporary storage before upload to Supabase
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/";

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// File filter to check file type
const fileFilter = (req, file, cb) => {
    if (supportedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

// Process the uploaded file (Excel or CSV)
export const processFile = async (file, requiredColumns) => {
    const filePath = file.path;
    const fileType = file.mimetype;
    let missingColumns = [];
    let parsedData = [];

    if (fileType === "text/csv") {
        // Process CSV file and validate headers
        const { headers, data } = await parseCSVFile(filePath);

        missingColumns = requiredColumns.filter(
            (col) => !headers.includes(col)
        );
        parsedData = data;
    } else if (
        fileType ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileType === "application/vnd.ms-excel"
    ) {
        // Process Excel file and validate headers
        const { headers, data } = parseExcelFile(filePath);

        missingColumns = requiredColumns.filter(
            (col) => !headers.includes(col)
        );
        parsedData = data;
    } else {
        throw new Error("Unsupported file type");
    }

    // Clean up local file after upload
    fs.unlinkSync(filePath);

    // Check for missing columns and return an error if any are missing
    if (missingColumns.length > 0) {
        throw new Error(
            `Missing required columns: ${missingColumns.join(", ")}`
        );
    }

    return { message: "File processed successfully!", data: parsedData };
};

// Excel File Reader (XLSX and XLS)
export const readExcel = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    return data;
};

// csv files parse with header and data

export const parseCSVFile = async (filePath) => {
    const headers = [];
    const data = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("headers", (csvHeaders) => {
                headers.push(...csvHeaders);
            })
            .on("data", (row) => {
                data.push(row);
            })
            .on("end", () => {
                resolve({ headers, data });
            })
            .on("error", (error) => {
                reject(error);
            });
    });
};

// Excel files parse with header and data
export const parseExcelFile = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = jsonData[0];
    const data = jsonData.slice(1).map((row) =>
        headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
            return acc;
        }, {})
    );

    return { headers, data };
};
