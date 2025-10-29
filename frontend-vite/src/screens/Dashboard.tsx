import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Calendar, CheckCircle, XCircle, PlusCircle } from 'lucide-react'
import { analyticsApi } from '../services/api'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const [overview, setOverview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverview()
  }, [])

  const fetchOverview = async () => {
    try {
      const response = await analyticsApi.overview()
      setOverview(response.data.overview)
    } catch (error: any) {
      toast.error('Failed to fetch overview')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Posts',
      value: overview?.totalPosts || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Scheduled',
      value: overview?.scheduled || 0,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Published',
      value: overview?.published || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Failed',
      value: overview?.failed || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome back! Here's an overview of your social media activity.
          </p>
        </div>
        <Link to="/composer" className="btn-primary flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Posts */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
        {overview?.recentPosts && overview.recentPosts.length > 0 ? (
          <div className="space-y-4">
            {overview.recentPosts.map((post: any) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {post.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {post.platforms.join(', ')} • {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No posts yet. Create your first post!</p>
            <Link to="/composer" className="btn-primary mt-4 inline-flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Create Post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

