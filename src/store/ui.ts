import { create } from 'zustand'

type Filter = 'all' | 'active' | 'completed'

interface UIState {
  filter: Filter
  editingId: number | null
  setFilter: (filter: Filter) => void
  setEditingId: (id: number | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  filter: 'all',
  editingId: null,
  setFilter: (filter) => set({ filter }),
  setEditingId: (id) => set({ editingId: id }),
}))
