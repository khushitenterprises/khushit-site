
import React, { useCallback, useState } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import * as api from '../../services/api'; // Adjust path if needed
import { Product } from '../../data/products'; // Adjust path if needed

interface ProductUploadProps {
    onUploadSuccess: (products: Product[]) => void;
}

export function ProductUpload({ onUploadSuccess }: ProductUploadProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    }, []);

    const validateFile = (file: File) => {
        // Check if file is excel
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            setError('Please upload a valid Excel file (.xlsx, .xls)');
            return false;
        }
        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        setError(null);
        setSuccess(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
            }
        }
    };

    const removeFile = () => {
        setFile(null);
        setError(null);
        setSuccess(false);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const products = await api.uploadProductsFile(file);
            setSuccess(true);
            onUploadSuccess(products);
            // Optional: clear file after success
            // setFile(null); 
        } catch (err) {
            console.error('Upload failed:', err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-10">
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                    error ? "border-destructive/50 bg-destructive/5" : "",
                    success ? "border-green-500/50 bg-green-500/5" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={handleChange}
                    disabled={uploading}
                />

                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="p-4 rounded-full bg-primary/10 text-primary">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Click to upload or drag and drop</p>
                                <p className="text-sm text-muted-foreground mt-1">Excel files only (max 10MB)</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file-preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-4 bg-background p-4 rounded-lg shadow-sm border"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-3 rounded-lg bg-green-100 text-green-600">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                                onClick={removeFile}
                                disabled={uploading}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex items-center gap-2 text-destructive text-sm"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex items-center gap-2 text-green-600 text-sm"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Products uploaded successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            {file && !success && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex justify-end"
                >
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Process File'
                        )}
                    </button>
                </motion.div>
            )}
        </div>
    );
}
