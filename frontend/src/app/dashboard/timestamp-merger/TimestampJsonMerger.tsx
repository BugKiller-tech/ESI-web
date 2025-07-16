'use client';
import { Button } from '@/components/ui/button';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

type JSONObject = Record<string, any>;

type LoadedFile = {
  name: string;
  data: JSONObject;
};
type Entry = {
  horseNumber: string;
  startTime: string;
  endTime: string;
  [key: string]: string;
};

export default function () {
  const [files, setFiles] = useState<LoadedFile[]>([]);

  const handleFiles = useCallback((incomingFiles: File[]) => {
    incomingFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (typeof json !== 'object' || json === null || Array.isArray(json)) {
            toast.info(`${file.name} is not a valid top-level JSON object.`);
            return;
          }

          // Avoid duplicate file names
          setFiles((prev) => {
            if (prev.find(f => f.name === file.name)) {
              toast.info(`File "${file.name}" is already loaded.`);
              return prev;
            }
            return [...prev, { name: file.name, data: json }];
          });
        } catch {
          toast.info(`Error parsing ${file.name}`);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/json': ['.json'] },
    multiple: true,
    onDrop: handleFiles,
  });

  const mergeCustom = (dataList: JSONObject[]): JSONObject => {
    const result: JSONObject = {};

    dataList.forEach((json) => {
      for (const key in json) {
        const value = json[key];

        if (Array.isArray(value)) {
          if (!Array.isArray(result[key])) {
            result[key] = [];
          }
          result[key] = [...result[key], ...value];
        } else if (!(key in result)) {
          result[key] = value;
        }
      }
    });

    // 🔽 Special handling for sorting "entries" by "startTime"
    if (Array.isArray(result.entries)) {
      result.entries.sort((a, b) => {
        const aTime = new Date(a.startTime).getTime();
        const bTime = new Date(b.startTime).getTime();
        return aTime - bTime;
      });
    }

    // 🔽 Remove exact duplicates
    const seen = new Set<string>();
    result.entries = result.entries.filter((entry: Entry) => {
      const key = JSON.stringify(entry);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return result;
  };

  const handleMergeAndDownload = () => {
    if (files.length < 2) {
      toast.info("Please upload at least 2 JSON files.");
      return;
    }

    let inputtedFileName = window.prompt('Please input the file name. if you do not input, file name should be merged.json');
    let fileName = inputtedFileName || 'merged.json';

    const merged = mergeCustom(files.map((f) => f.data));
    const blob = new Blob([JSON.stringify(merged, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <div>
      <div className="bg-white border shadow-xl rounded-xl p-8 w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Merge JSON Files</h1>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          `}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">
            Drag & drop or click to upload <strong>multiple .json files</strong>
          </p>
        </div>

        {/* File List with Remove Buttons */}
        {files.length > 0 && (
          <div className="bg-gray-50 rounded p-4 text-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-700">Loaded Files:</p>
              <button
                onClick={clearFiles}
                className="text-sm text-red-500 hover:underline"
              >
                Clear All
              </button>
            </div>
            <ul className="space-y-2">
              {files.map((file, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-white border rounded px-3 py-2"
                >
                  <span className="text-green-700">✅ {file.name}</span>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Merge Button */}
        <Button
          onClick={handleMergeAndDownload}
          disabled={files.length < 2}
          className={`w-full bg-main-color`}
        >
          Merge & Download
        </Button>
      </div>
    </div>
  );
}