import { useEffect, useState } from "react";
import { fetcher, isAbortError } from "../utils/fetcher";
import { HttpStatusError } from "../utils/http-status-error";

interface FetchResult<T> {
  isLoading: boolean;
  data: T | null;
  error: Error | null;
  mutate: () => void
}

interface FetchOptions<T> {
  initialValue?: T | null;
}

export default function useFetch<T>(url: string, options: FetchOptions<T> = {}): FetchResult<T> {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<T | null>(options.initialValue??null)
  const [error, setError] = useState<Error | null>(null)
  const [refresh, setRefresh] = useState(false)

  const mutate = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      try{
        const result = await fetcher<T>(url, {signal: abortController.signal})
        setData(result.data)
      }
      catch(e){
        if(e instanceof HttpStatusError) setError(new Error(e.statusText))
        else if(isAbortError(e)) return
        else if(e instanceof Error) setError(e)
      }
        setIsLoading(false)
    }
    setIsLoading(true)
    setError(null)
    fetchData()

    return () => {
      abortController.abort()
    }
  }, [url, refresh])


  return {
    isLoading: isLoading,
    data: data,
    error: error,
    mutate: mutate
  }
}

