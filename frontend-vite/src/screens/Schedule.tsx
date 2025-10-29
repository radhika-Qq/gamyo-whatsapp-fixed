import { useEffect, useState } from 'react'
import { Calendar, Clock, Send } from 'lucide-react'
import { postApi } from '../services/api'
import { toast } from 'react-toastify'

export default function Schedule() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await postApi.list(params)
      setPosts(response.data.posts)
    } catch (error) {
      toast.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const publishPost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to publish this post now?')) {
      return
    }

    try {
      await postApi.publish(postId)
      toast.success('Post published successfully!')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to publish post')
    }
  }

  const deletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await postApi.delete(postId)
      toast.success('Post deleted successfully!')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const filters = [
    { value: 'all', label: 'All Posts' },
    { value: 'draft', label: 'Drafts' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'published', label: 'Published' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        <p className="mt-1 text-gray-600">Manage and schedule your posts</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium line-clamp-2">{post.content}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    {post.scheduledAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(post.scheduledAt).toLocaleString()}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {post.platforms.map((platform: string) => (
                        <span
                          key={platform}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : post.status === 'scheduled'
                        ? 'bg-yellow-100 text-yellow-800'
                        : post.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {post.status}
                  </span>
                  {post.status === 'draft' && (
                    <button
                      onClick={() => publishPost(post.id)}
                      className="btn-primary py-1 px-3 text-sm flex items-center gap-1"
                    >
                      <Send className="w-4 h-4" />
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No posts found</p>
          </div>
        )}
      </div>
    </div>
  )
}

