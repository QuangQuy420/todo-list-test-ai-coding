import { create } from 'zustand'

type Filter = 'all' | 'active' | 'completed'

export type SortOrder = 'created_desc' | 'due_asc' | 'due_desc'

export type DateFilter = null | 'today' | string

interface UIState {
  filter: Filter
  editingId: number | null
  searchQuery: string
  sortOrder: SortOrder
  dateFilter: DateFilter
  setFilter: (filter: Filter) => void
  setEditingId: (id: number | null) => void
  setSearchQuery: (q: string) => void
  setSortOrder: (s: SortOrder) => void
  setDateFilter: (v: DateFilter) => void
}

export const useUIStore = create<UIState>((set) => ({
  filter: 'all',
  editingId: null,
  searchQuery: '',
  sortOrder: 'created_desc',
  dateFilter: null,
  setFilter: (filter) => set({ filter }),
  setEditingId: (id) => set({ editingId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSortOrder: (s) => set({ sortOrder: s }),
  setDateFilter: (v) => set({ dateFilter: v }),
}))
