import { useState, useEffect, useCallback } from 'react'

function usePaginatedFetch(fetchFn, params = {}) {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const paramsKey = JSON.stringify(params)

  const fetchData = useCallback(
    async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await fetchFn(params)
        setItems(result.data.docs)
        setPagination(result.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramsKey],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  return { items, pagination, isLoading, error, refetch: fetchData }
}

export default usePaginatedFetch