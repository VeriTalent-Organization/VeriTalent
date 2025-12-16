import React, { useState } from "react";
import { Upload } from "lucide-react";

interface InternalLPIFeedProps {
  onBack: () => void;
}

export default function InternalLPIFeed({ onBack }: InternalLPIFeedProps) {
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("file");
  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionCategory, setSubmissionCategory] = useState("");
  const [pasteLink, setPasteLink] = useState("");

  return (
    <div>
      {/* Header with back navigation */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-brand-primary hover:text-cyan-700 mb-4 flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Reports
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Internal LPI Feed</h2>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <div className="flex items-start gap-2 mb-4">
          <input
            type="radio"
            id="upload-file"
            checked={uploadMethod === "file"}
            onChange={() => setUploadMethod("file")}
            className="w-4 h-4 text-brand-primary mt-0.5 shrink-0"
          />
          <label htmlFor="upload-file" className="text-xs sm:text-sm text-gray-700">
            Upload any verified body of work or activity footprint for LPI analysis (PDF, DOCX, TXT)
          </label>
        </div>

        {uploadMethod === "file" && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-12 text-center bg-white">
            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-700 mb-1">Upload file (pdf, Docx, TXT) or</p>
            <p className="text-sm sm:text-base text-gray-700 mb-2">click to browse</p>
            <p className="text-xs sm:text-sm text-gray-500">Upload Multiple files (limit 100MB total)</p>
          </div>
        )}
      </div>

      {/* Or Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-gray-500 text-sm">Or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Paste Link Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="radio"
            id="paste-link"
            checked={uploadMethod === "link"}
            onChange={() => setUploadMethod("link")}
            className="w-4 h-4 text-brand-primary"
          />
          <label htmlFor="paste-link" className="text-xs sm:text-sm font-medium text-brand-primary">
            Paste Link
          </label>
        </div>

        {uploadMethod === "link" && (
          <input
            type="text"
            value={pasteLink}
            onChange={(e) => setPasteLink(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm sm:text-base"
            placeholder="Enter link..."
          />
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Title
          </label>
          <input
            type="text"
            value={submissionTitle}
            onChange={(e) => setSubmissionTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm sm:text-base"
            placeholder="Enter title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Category
          </label>
          <select
            value={submissionCategory}
            onChange={(e) => setSubmissionCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none text-sm sm:text-base"
          >
            <option value="">Select category...</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="research">Research</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Note Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-gray-900 mb-2">Note:</p>
        <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 space-y-1">
          <li>Submitted work must be publicly or administratively recognised</li>
          <li>Unverified uploads may be rejected.</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm sm:text-base">
          Submit
        </button>
      </div>
    </div>
  );
}