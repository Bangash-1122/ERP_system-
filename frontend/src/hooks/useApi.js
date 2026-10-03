import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/axios'
export function useApiQuery(key, url, options = {}) { return useQuery({ queryKey: key, queryFn: async () => (await api.get(url)).data.data, ...options }) }
export function useApiMutation(url, method = 'post', options = {}) { const qc = useQueryClient(); return useMutation({ mutationFn: async payload => (await api[method](url, payload)).data.data, onSuccess: (...args) => { qc.invalidateQueries(); options.onSuccess?.(...args) }, ...options }) }
