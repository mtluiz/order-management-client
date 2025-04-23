import { useState, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdatePrompt() {
  const [offlineReady, setOfflineReady] = useState(false)
  const [needRefresh, setNeedRefresh] = useState(false)
  
  const {
    updateServiceWorker,
    offlineReady: swOfflineReady,
    needRefresh: swNeedRefresh,
  } = useRegisterSW({
    onOfflineReady() {
      setOfflineReady(true)
    },
    onNeedRefresh() {
      setNeedRefresh(true)
    }
  })

  useEffect(() => {
    if (swOfflineReady) {
      setOfflineReady(true)
    }
    if (swNeedRefresh) {
      setNeedRefresh(true)
    }
  }, [swOfflineReady, swNeedRefresh])

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <>
      {(offlineReady || needRefresh) && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-w-sm">
          {offlineReady && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">App ready to work offline</p>
              <button 
                onClick={close}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
          )}
          {needRefresh && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">New content available, click on reload button to update.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => updateServiceWorker(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm"
                >
                  Reload
                </button>
                <button 
                  onClick={close}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded px-4 py-2 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
} 