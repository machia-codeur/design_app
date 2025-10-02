
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Spinner } from './components/Spinner';
import { generateProductScene } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

// Define the Icon as a separate component to avoid re-definition on each render
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c.321.64.321 1.393 0 2.034l-1.39 2.78a1.5 1.5 0 00.907 2.05l2.78 1.39c.64.321 1.393.321 2.034 0l2.78-1.39a1.5 1.5 0 00.907-2.05l-1.39-2.78a1.448 1.448 0 000-2.034l1.39-2.78a1.5 1.5 0 00-.907-2.05l-2.78-1.39a1.448 1.448 0 00-2.034 0l-2.78 1.39a1.5 1.5 0 00-.907 2.05l1.39 2.78zM5.568 11.884c.321.64.321 1.393 0 2.034l-1.39 2.78a1.5 1.5 0 00.907 2.05l2.78 1.39c.64.321 1.393.321 2.034 0l2.78-1.39a1.5 1.5 0 00.907-2.05l-1.39-2.78a1.448 1.448 0 000-2.034l1.39-2.78a1.5 1.5 0 00-.907-2.05l-2.78-1.39a1.448 1.448 0 00-2.034 0l-2.78 1.39a1.5 1.5 0 00-.907 2.05l1.39 2.78z" clipRule="evenodd" />
  </svg>
);

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [scene, setScene] = useState<string>('');

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = productImage && logoImage && subject.trim() && scene.trim();

  const handleGenerate = useCallback(async () => {
    if (!isFormValid) {
      setError("Please fill in all fields and upload both images.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const productB64 = await fileToBase64(productImage);
      const logoB64 = await fileToBase64(logoImage);
      
      const resultImage = await generateProductScene(productB64, logoB64, subject, scene);
      setGeneratedImage(resultImage);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [productImage, logoImage, subject, scene, isFormValid]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
            Product Scene Generator
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Upload a product, a logo, and describe a scene. Our AI will merge them into a stunning, realistic image for your brand.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-indigo-400">1. Upload Your Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ImageUploader id="product-image" label="Product Image" onFileChange={setProductImage} />
              <ImageUploader id="logo-image" label="Logo Image" onFileChange={setLogoImage} />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-indigo-400">2. Describe Your Vision</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., A professional athlete running"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="scene" className="block text-sm font-medium text-gray-300 mb-2">Scene</label>
                <textarea
                  id="scene"
                  value={scene}
                  onChange={(e) => setScene(e.target.value)}
                  placeholder="e.g., On a sunny beach during sunset, with waves in the background"
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>
            
            <div className="mt-8">
              <button
                onClick={handleGenerate}
                disabled={!isFormValid || isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700 flex flex-col justify-center items-center min-h-[300px] lg:min-h-0">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400 self-start">3. Your Generated Image</h2>
            <div className="w-full h-full flex justify-center items-center bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-600">
              {isLoading && (
                <div className="text-center">
                  <Spinner className="w-12 h-12 mx-auto" />
                  <p className="mt-4 text-gray-400 animate-pulse">AI is crafting your scene...</p>
                </div>
              )}
              {error && (
                <div className="text-center text-red-400 p-4">
                  <p><strong>Error:</strong> {error}</p>
                </div>
              )}
              {generatedImage && !isLoading && (
                <img src={generatedImage} alt="Generated product scene" className="rounded-lg object-contain max-w-full max-h-full" />
              )}
              {!isLoading && !error && !generatedImage && (
                <div className="text-center text-gray-500">
                  <p>Your generated image will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
