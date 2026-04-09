"use client";

import { useMemo, useSyncExternalStore } from "react";
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
  onUploadError?: (message: string | null) => void;
  acceptedFileTypes?: string[];
  existingFileUrl?: string | null;
  existingFileLabel?: string | null;
  onExistingFileRemove?: () => void;
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
  onUploadError,
  acceptedFileTypes,
  existingFileUrl,
  existingFileLabel,
  onExistingFileRemove,
}: FilepondUploadProps) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

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
            onUploadError?.(null);
            progress(true, 1, 1);
            load(result.path);
          })
          .catch((uploadError) => {
            if (isAborted) {
              return;
            }

            onStoredPathChange?.(null);
            const message =
              uploadError instanceof Error
                ? uploadError.message
                : "Upload failed.";
            onUploadError?.(message);
            errorHandler(message);
          });

        return {
          abort: () => {
            isAborted = true;
            onStoredPathChange?.(null);
            onUploadError?.(null);
            abort();
          },
        };
      },
    };
  }, [onStoredPathChange, onUploadError, processFile]);

  const pondFiles = useMemo(() => {
    if (files.length > 0) {
      return files;
    }

    if (!existingFileUrl) {
      return [];
    }

    return [
      {
        source: existingFileUrl,
        options: {
          type: "local" as const,
          file: {
            name: existingFileLabel || "Current file",
            size: 0,
          },
        },
      },
    ];
  }, [existingFileLabel, existingFileUrl, files]);

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

      {isMounted ? (
        <FilePond
          id={error ? "filepond-error" : ""}
          files={pondFiles}
          onupdatefiles={(fileItems) => {
            const files = fileItems
              .map((item) => item.file)
              .filter((file): file is File => file instanceof File);
            onUploadError?.(null);
            onChange(files);
          }}
          onremovefile={() => {
            onStoredPathChange?.(null);
            onUploadError?.(null);
            onExistingFileRemove?.();
          }}
          instantUpload={Boolean(processFile)}
          allowProcess={Boolean(processFile)}
          allowImagePreview={allowImagePreview}
          allowFileTypeValidation={Boolean(acceptedFileTypes?.length)}
          allowMultiple={allowMultiple}
          maxFiles={maxFiles}
          name={name}
          server={server}
          acceptedFileTypes={acceptedFileTypes}
          labelIdle={`
            <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
                <img src="/assets/icons/Group.svg" alt="icon image" width="20" height="20"/>
                <span style="font-size:14px;">Drag & Drop your files or Browse</span>
            </div>
          `}
        />
      ) : (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
          Loading uploader...
        </div>
      )}

      {error && <span className="mt-1 text-[12px] text-red-500">{error}</span>}
    </div>
  );
}
