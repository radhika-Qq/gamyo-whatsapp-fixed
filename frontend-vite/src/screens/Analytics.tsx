import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react'
import { analyticsApi } from '../services/api'
import { toast } from 'react-toastify'

export default function Analytics() {
  const [engagement, setEngagement] = useState<any>(null)
  const [platforms, setPlatforms] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [engagementRes, platformsRes] = await Promise.all([
        analyticsApi.engagement(),
        analyticsApi.platforms(),
      ])
      setEngagement(engagementRes.data.engagement)
      setPlatforms(platformsRes.data.platformBreakdown)
    } catch (error) {
      toast.error('Failed to fetch analytics')
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

  const engagementStats = [
    {
      name: 'Total Impressions',
      value: engagement?.totalImpressions || 0,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Reach',
      value: engagement?.totalReach || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total Engagements',
      value: engagement?.totalEngagements || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Engagement Rate',
      value: `${engagement?.engagementRate || 0}%`,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-gray-600">
          Track your performance across all platforms
        </p>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {engagementStats.map((stat) => {
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

      {/* Platform Breakdown */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Breakdown</h2>
        <div className="space-y-4">
          {platforms && Object.entries(platforms).map(([platform, count]: any) => {
            const total = Object.values(platforms).reduce((sum: number, val: any) => sum + val, 0) as number
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0

            return (
              <div key={platform}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {platform}
                  </span>
                  <span className="text-sm text-gray-500">
                    {count} posts ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      platform === 'facebook'
                        ? 'bg-facebook'
                        : platform === 'instagram'
                        ? 'bg-instagram'
                        : platform === 'linkedin'
                        ? 'bg-linkedin'
                        : 'bg-whatsapp'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Analytics data is aggregated from all your published posts.
          Real-time insights from platform APIs may take some time to update.
        </p>
      </div>
    </div>
  )
}

