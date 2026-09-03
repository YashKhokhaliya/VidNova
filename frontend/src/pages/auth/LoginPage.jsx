import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../../features/auth/authSlice.js'

function LoginPage() {
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
    // Your backend accepts either { username, password } or { email, password }.
    // We send whichever the user typed as an "identifier" under both keys
    // is unnecessary — instead, detect if it looks like an email.
    const isEmail = /^\S+@\S+\.\S+$/.test(data.identifier)
    const credentials = {
      password: data.password,
      ...(isEmail ? { email: data.identifier } : { username: data.identifier }),
    }

    const result = await dispatch(login(credentials))

    if (login.fulfilled.match(result)) {
      toast.success('Logged in successfully')
      navigate('/')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] px-4">
      <div className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
        <h1 className="mb-6 text-center text-2xl font-semibold">Welcome back</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
              Username or Email
            </label>
            <input
              type="text"
              {...register('identifier', { required: 'Username or email is required' })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
            />
            {errors.identifier && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.identifier.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-full bg-[var(--color-accent)] py-2 text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-accent)] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage