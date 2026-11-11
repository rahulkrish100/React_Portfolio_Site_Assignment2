import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'

// Loads a list from the API and tracks loading / error state.
// Returns setItems so callers can update the list after create/update/delete
// without refetching.
export default function useApiList(endpoint) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.get(endpoint)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    reload()
  }, [reload])

  return { items, setItems, loading, error, reload }
}
