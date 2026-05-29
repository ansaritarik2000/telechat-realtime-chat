export function formatFileSize(sizeInBytes) {
    if (sizeInBytes === 0) return "0 Bytes";
  
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    const k = 1024; // 1 KB = 1024 Bytes
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(k)); // Determine the unit
  
    const size = (sizeInBytes / Math.pow(k, i)).toFixed(2); // Convert size to the appropriate unit
    return `${size} ${units[i]}`; // Combine size with unit
  }