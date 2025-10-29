import { create } from 'zustand'

interface Post {
  id: string
  content: string
  mediaUrls: string[]
  platforms: string[]
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt?: string
  publishedAt?: string
  createdAt: string
}

interface PostState {
  posts: Post[]
  currentPost: Post | null
  setPosts: (posts: Post[]) => void
  setCurrentPost: (post: Post | null) => void
  addPost: (post: Post) => void
  updatePost: (id: string, updates: Partial<Post>) => void
  removePost: (id: string) => void
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  currentPost: null,
  
  setPosts: (posts) => set({ posts }),
  
  setCurrentPost: (post) => set({ currentPost: post }),
  
  addPost: (post) => set((state) => ({
    posts: [post, ...state.posts],
  })),
  
  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === id ? { ...post, ...updates } : post
    ),
  })),
  
  removePost: (id) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== id),
  })),
}))

