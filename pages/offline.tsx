import React from 'react';
import Head from 'next/head';

const OfflinePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>You are Offline</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
        <h1 className="text-4xl font-bold mb-4">You are Offline</h1>
        <p className="text-lg text-center mb-8">
          It looks like you're not connected to the internet. Please check your connection and try again.
        </p>
        <p className="text-md text-center">
          Some content might be available from your last visit.
        </p>
      </div>
    </>
  );
};

export default OfflinePage;
