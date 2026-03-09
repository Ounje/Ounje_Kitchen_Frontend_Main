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
      <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: '#E8F7E8' }}>
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#1A3F1C' }}
          />
          <p style={{ color: '#1A3F1C' }}>Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A3F1C' }}>
              Document Upload
            </h1>
            <div className="h-1 w-full mt-2 rounded" style={{ backgroundColor: '#1E90FF' }} />
          </div>
          <button
            onClick={() => router.back()}
            className="ml-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" style={{ color: '#1A3F1C' }} />
          </button>
        </div>

        {/* Document Card */}
        <div className="bg-white rounded-xl p-4 sm:p-6 w-full">
          <h2 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
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
                  className="w-full h-[500px] sm:h-[600px] border rounded-lg"
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