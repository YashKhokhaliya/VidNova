import { useCallback, useEffect, useState } from 'react'

function useFetch(fetchFn) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      setData(result.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Something went wrong',
      )
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    // Fetching data when the dependency changes is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
  
}


export default useFetch