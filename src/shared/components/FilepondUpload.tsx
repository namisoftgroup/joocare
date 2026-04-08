"use client";

import { useMemo } from "react";
import { FilePond } from "react-filepond";

import "./filepondPlugins";

// styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

interface FilepondUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
  name?: string;
  serverEndpoint?: string;
  allowMultiple?: boolean;
  maxFiles?: number;
  required?: boolean;
  allowImagePreview?: boolean;
  className?: string;
  error?: string | boolean;
  hint?: string;
  processFile?: (file: File) => Promise<{ path: string }>;
  onStoredPathChange?: (path: string | null) => void;
}

export function FilepondUpload({
  files,
  onChange,
  label,
  name = "files",
  allowMultiple = true,
  maxFiles = 3,
  required = false,
  allowImagePreview = false,
  className,
  error,
  hint,
  processFile,
  onStoredPathChange,
}: FilepondUploadProps) {
  const server = useMemo(() => {
    if (!processFile) {
      return null;
    }

    return {
      process: (
        _fieldName: string,
        file: File,
        _metadata: unknown,
        load: (serverFileId: string) => void,
        errorHandler: (errorText: string) => void,
        progress: (
          isLengthComputable: boolean,
          loadedDataAmount: number,
          totalDataAmount: number,
        ) => void,
        abort: () => void,
      ) => {
        let isAborted = false;

        progress(true, 0, 1);

        processFile(file)
          .then((result) => {
            if (isAborted) {
              return;
            }

            onStoredPathChange?.(result.path);
            progress(true, 1, 1);
            load(result.path);
          })
          .catch((uploadError) => {
            if (isAborted) {
              return;
            }

            onStoredPathChange?.(null);
            errorHandler(
              uploadError instanceof Error
                ? uploadError.message
                : "Upload failed.",
            );
          });

        return {
          abort: () => {
            isAborted = true;
            onStoredPathChange?.(null);
            abort();
          },
        };
      },
    };
  }, [onStoredPathChange, processFile]);

  return (
    <div className={`w-full space-y-2 ${className}`} >
      {label && (
        <label className="block text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
          {hint && (
            <span className="text-muted-foreground text-sm font-normal">
              {" "}
              {hint}{" "}
            </span>
          )}
        </label>
      )}


      <FilePond
        id={error ? "filepond-error" : ""}
        files={files}
        onupdatefiles={(fileItems) => {
          const files = fileItems.map((item) => item.file as File);
          onChange(files);
        }}
        onremovefile={() => {
          onStoredPathChange?.(null);
        }}
        instantUpload={Boolean(processFile)}
        allowProcess={Boolean(processFile)}
        allowImagePreview={allowImagePreview}
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        name={name}
        server={server}
        labelIdle={`
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
              <img src="/assets/icons/Group.svg" alt="icon image" width="20" height="20"/>
              <span style="font-size:14px;">Drag & Drop your files or Browse</span>
          </div>
        `}
      />

      {error && <span className="mt-1 text-[12px] text-red-500">{error}</span>}
    </div>
  );
}
