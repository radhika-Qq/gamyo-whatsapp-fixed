import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Sparkles, Hash, Image as ImageIcon } from 'lucide-react'
import { postApi, aiApi } from '../services/api'
import { useNavigate } from 'react-router-dom'

interface ComposerForm {
  content: string
  platforms: string[]
}

const platforms = [
  { id: 'facebook', name: 'Facebook', color: 'bg-facebook' },
  { id: 'instagram', name: 'Instagram', color: 'bg-instagram' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-linkedin' },
  { id: 'whatsapp', name: 'WhatsApp', color: 'bg-whatsapp' },
]

export default function Composer() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ComposerForm>()
  
  const content = watch('content')

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const generateCaption = async () => {
    if (!content) {
      toast.error('Please enter some content first')
      return
    }

    try {
      setAiLoading(true)
      const response = await aiApi.generateCaption({
        prompt: content,
        tone: 'professional',
        language: 'en',
      })
      setValue('content', response.data.caption)
      toast.success('Caption generated!')
    } catch (error) {
      toast.error('Failed to generate caption')
    } finally {
      setAiLoading(false)
    }
  }

  const generateHashtags = async () => {
    if (!content) {
      toast.error('Please enter some content first')
      return
    }

    try {
      setAiLoading(true)
      const response = await aiApi.generateHashtags({
        content: content,
        count: 5,
      })
      const hashtags = response.data.hashtags.join(' ')
      setValue('content', `${content}\n\n${hashtags}`)
      toast.success('Hashtags generated!')
    } catch (error) {
      toast.error('Failed to generate hashtags')
    } finally {
      setAiLoading(false)
    }
  }

  const onSubmit = async (data: ComposerForm) => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    try {
      setLoading(true)
      const response = await postApi.create({
        content: data.content,
        platforms: selectedPlatforms,
        postType: 'text',
      })
      
      if (response.data.success) {
        toast.success('Post created successfully!')
        navigate('/schedule')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
        <p className="mt-1 text-gray-600">
          Compose and schedule your content across multiple platforms
        </p>
      </div>

      {/* Main Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Platforms
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? `border-${platform.id} ${platform.color} bg-opacity-10`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{platform.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows={8}
              className="input resize-none"
              placeholder="Write your post content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              {content?.length || 0} characters
            </div>
          </div>

          {/* AI Tools */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={generateCaption}
              disabled={aiLoading}
              className="btn-outline flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {aiLoading ? 'Generating...' : 'AI Caption'}
            </button>
            <button
              type="button"
              onClick={generateHashtags}
              disabled={aiLoading}
              className="btn-outline flex items-center gap-2"
            >
              <Hash className="w-4 h-4" />
              {aiLoading ? 'Generating...' : 'AI Hashtags'}
            </button>
            <button
              type="button"
              className="btn-outline flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              Add Media
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

