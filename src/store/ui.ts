import { create } from 'zustand'

type Filter = 'all' | 'active' | 'completed'

export type SortOrder = 'created_desc' | 'due_asc' | 'due_desc'

interface UIState {
  filter: Filter
  editingId: number | null
  searchQuery: string
  sortOrder: SortOrder
  setFilter: (filter: Filter) => void
  setEditingId: (id: number | null) => void
  setSearchQuery: (q: string) => void
  setSortOrder: (s: SortOrder) => void
}

export const useUIStore = create<UIState>((set) => ({
  filter: 'all',
  editingId: null,
  searchQuery: '',
  sortOrder: 'created_desc',
  setFilter: (filter) => set({ filter }),
  setEditingId: (id) => set({ editingId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSortOrder: (s) => set({ sortOrder: s }),
}))
