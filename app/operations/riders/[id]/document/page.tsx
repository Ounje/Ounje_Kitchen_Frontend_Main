// app/operations/riders/[id]/document/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useRiderDocument } from '@/hooks/useRiders';

export default function RiderDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const riderId = params.id as string;

  const { data: document, isLoading, error } = useRiderDocument(riderId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8F7E8' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#1A3F1C' }}></div>
          <p style={{ color: '#1A3F1C' }}>Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A3F1C' }}>
              Document Upload
            </h1>
            <div
              className="h-1 w-full mt-2"
              style={{ backgroundColor: '#1E90FF' }}
            ></div>
          </div>
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" style={{ color: '#1A3F1C' }} />
          </button>
        </div>

        {/* Document Display */}
        <div className="bg-white rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
            Rider's NIN
          </h2>

          {error || !document ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No document available</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg text-white"
                style={{ backgroundColor: '#1A3F1C' }}
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              {document.documentType === 'pdf' ? (
                <iframe
                  src={document.documentUrl}
                  className="w-full h-[600px] border rounded-lg"
                  title="Rider Document"
                />
              ) : (
                <img
                  src={document.documentUrl}
                  alt="Rider Document"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}