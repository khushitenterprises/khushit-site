import xlsx from 'xlsx';

export const parseExcel = (buffer) => {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Convert to JSON with first row as headers
    const data = xlsx.utils.sheet_to_json(sheet);

    // Normalize keys to lowercase? Or keep as is.
    // Let's assume the user uses "Name", "Price", "Description", "Image" or similar.
    // We can map them if needed, but for now raw data is fine.
    // However, for consistency, let's try to standardize if possible, or just return as is.
    return data;
};
