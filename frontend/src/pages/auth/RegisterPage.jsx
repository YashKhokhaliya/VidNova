import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register as registerUserThunk } from '../../features/auth/authSlice.js'

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status } = useSelector((state) => state.auth)
  const isLoading = status === 'loading'

  const onSubmit = async (data) => {
    // Backend expects multipart/form-data because avatar/coverImage are files.
    const formData = new FormData()
    formData.append('fullName', data.fullName)
    formData.append('email', data.email)
    formData.append('username', data.username)
    formData.append('password', data.password)
    formData.append('avatar', data.avatar[0]) // required file input
    if (data.coverImage?.[0]) {
      formData.append('coverImage', data.coverImage[0]) // optional
    }

    const result = await dispatch(registerUserThunk(formData))

    if (registerUserThunk.fulfilled.match(result)) {
      toast.success('Account created! Please log in.')
      navigate('/login')
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Create your account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
              Full Name
            </label>
            <input
              type="text"
              {...register('fullName', { required: 'Full name is required' })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
              Username
            </label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
              Email
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
              Password
            </label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
              Avatar (required)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('avatar', { required: 'Avatar image is required' })}
              className="w-full text-sm text-[var(--color-text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-bg-hover)] file:px-3 file:py-1.5 file:text-[var(--color-text-primary)]"
            />
            {errors.avatar && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.avatar.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
              Cover Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('coverImage')}
              className="w-full text-sm text-[var(--color-text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-bg-hover)] file:px-3 file:py-1.5 file:text-[var(--color-text-primary)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-full bg-[var(--color-accent)] py-2 text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-accent)] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage