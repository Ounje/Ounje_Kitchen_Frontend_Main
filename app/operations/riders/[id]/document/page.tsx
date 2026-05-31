'use client';

import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useRiderDocument } from '@/hooks/useRiders';

export default function RiderDocumentPage() {
  const params  = useParams();
  const router  = useRouter();
  const riderId = params.id as string;

  const { data: document, isLoading, error } = useRiderDocument(riderId);

  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        className="bg-gray-50"
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            className="border-[#1a3f1c]"
          />
          <p className="text-[#1a3f1c]">Loading document...</p>
        </div>
      </div>
    );
  }

  // Resolve document URL — backend may return documentUrl, url, nin, driversLicense etc.
  const docUrl: string =
    (document as any)?.documentUrl    ??
    (document as any)?.url            ??
    (document as any)?.nin            ??
    (document as any)?.driversLicense ??
    (document as any)?.fileUrl        ??
    "";

  // Detect type from extension or explicit field
  const docType: string =
    (document as any)?.documentType ??
    (docUrl.toLowerCase().endsWith(".pdf") ? "pdf" : "image");

  const hasDoc = !!docUrl;

  return (
    <div className="min-h-screen w-full" className="bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold" className="text-[#1a3f1c]">
              Document Upload
            </h1>
            <div className="h-1 w-full mt-2 rounded" style={{ backgroundColor: '#1E90FF' }} />
          </div>
          <button
            onClick={() => router.back()}
            className="ml-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" className="text-[#1a3f1c]" />
          </button>
        </div>

        {/* Document Card */}
        <div className="bg-white rounded-xl p-4 sm:p-6 w-full">
          <h2 className="text-lg sm:text-xl font-bold mb-4" className="text-[#1a3f1c]">
            Rider's NIN
          </h2>

          {error || !hasDoc ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No document available for this rider.</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg text-white"
                className="bg-[#1a3f1c]"
              >
                Go Back
              </button>
            </div>
          ) : docType === 'pdf' ? (
            <iframe
              src={docUrl}
              className="w-full h-[500px] sm:h-[600px] border rounded-lg"
              title="Rider Document"
            />
          ) : (
            /* Guard: only render img when docUrl is a non-empty string */
            <div className="flex justify-center">
              <img
                src={docUrl}
                alt="Rider Document"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}