import React, { useState, DragEvent, ChangeEvent } from 'react';

export default function BulkUpload() {
  const [jobId, setJobId] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // <--- specify File type
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files); // File[]
    handleFiles(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files); // File[]
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => { // <-- type the parameter
    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'docx', 'txt', 'doc'].includes(extension || '');
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Bulk Upload</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-4xl">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Job ID</label>
            <input
              type="text"
              placeholder="Job Title"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Company Name</label>
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-400 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="max-w-4xl">
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Upload CV / VeriTalent AI Card ID (PDF, DOCX, TXT)
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging 
                ? 'border-brand-primary bg-teal-50' 
                : 'border-gray-300 bg-white'
            }`}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.doc"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>

              <p className="text-gray-600 mb-1">
                Upload Bulk CVs file (pdf, Docx, TXT) or{' '}
                <label htmlFor="file-upload" className="text-brand-primary cursor-pointer hover:underline">
                  click to browse
                </label>
              </p>
              <p className="text-gray-400 text-sm">Upload Multiple files (limit 100MB total)</p>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
