import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = [
    {
        name: 'Luxury Bath Soap',
        description: 'A premium soap with lavender scent.',
        variant: '150g',
        category: 'bath-soaps',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1600857065991-6ef89df66861?w=500&q=80'
    },
    {
        name: 'Super Detergent',
        description: 'Removes stains effectively.',
        variant: '2kg',
        category: 'detergents',
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&q=80'
    }
];

const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(data);

xlsx.utils.book_append_sheet(wb, ws, 'Products');

const outputPath = path.join(__dirname, '../../sample_products.xlsx');
xlsx.writeFile(wb, outputPath);

console.log(`Sample Excel file created at: ${outputPath}`);
