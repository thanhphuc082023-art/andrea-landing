/* eslint-disable */
import { useGlobal } from '@/providers/GlobalProvider';
import StrapiLogo from '@/components/StrapiLogo';
import GlobalInfo from '@/components/GlobalInfo';
import StrapiHead from '@/components/meta/StrapiHead';

function StrapiTestPage() {
  const { global, isLoading, error } = useGlobal();

  return (
    <>
      <StrapiHead
        title="Strapi Integration Test"
        description="Test page for Strapi integration"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-8 text-center text-3xl font-bold">
            Strapi Integration Test
          </h1>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center">
              <div className="border-brand-orange mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2" />
              <p>Loading Strapi data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong>Error:</strong>{' '}
              {error.message || 'Failed to load Strapi data'}
            </div>
          )}

          {/* Success State */}
          {global && !isLoading && (
            <div className="space-y-8">
              {/* Logo Section */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Logo from Strapi</h2>
                <div className="flex items-center justify-center">
                  <StrapiLogo width={200} height={80} />
                </div>
              </div>

              {/* Global Information */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">
                  Global Information
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="siteName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Site Name:
                    </label>
                    <GlobalInfo
                      id="siteName"
                      type="siteName"
                      fallback="No site name found"
                      className="text-gray-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="siteDescription"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Description:
                    </label>
                    <GlobalInfo
                      id="siteDescription"
                      type="siteDescription"
                      fallback="No description found"
                      className="text-gray-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Email:
                    </label>
                    <GlobalInfo
                      id="email"
                      type="email"
                      fallback="No email found"
                      className="text-gray-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Phone:
                    </label>
                    <GlobalInfo
                      id="phone"
                      type="phone"
                      fallback="No phone found"
                      className="text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Raw Data */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Raw Strapi Data</h2>
                <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
                  {JSON.stringify(global, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* No Data State */}
          {!global && !isLoading && !error && (
            <div className="text-center">
              <p className="text-gray-600">No Strapi data available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StrapiTestPage;
