import { useCallback, useRef, useState } from 'react'
import {
  Camera,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Save,
  UserRound,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from '../api/services/userService.js'
import Skeleton from '../components/ui/Skeleton.jsx'
import useFetch from '../hooks/useFetch.js'

function SettingsPage() {
  const avatarInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const fetchCurrentUser = useCallback(() => {
    return getCurrentUser()
  }, [])

  const {
    data: user,
    isLoading: isPageLoading,
    error: userError,
    refetch,
  } = useFetch(fetchCurrentUser)

  const [profileForm, setProfileForm] = useState({
    fullName: null,
    email: null,
  })

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)

  const [isProfileUpdating, setIsProfileUpdating] = useState(false)
  const [isAvatarUpdating, setIsAvatarUpdating] = useState(false)
  const [isCoverUpdating, setIsCoverUpdating] = useState(false)
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false)

  const displayedFullName = profileForm.fullName ?? user?.fullName ?? ''
  const displayedEmail = profileForm.email ?? user?.email ?? ''
  const displayedAvatar = avatarPreview ?? user?.avatar ?? ''
  const displayedCover = coverPreview ?? user?.coverImage ?? ''

  const handleProfileChange = (event) => {
    const { name, value } = event.target

    setProfileForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target

    setPasswordForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()

    const fullName = displayedFullName.trim()
    const email = displayedEmail.trim()

    if (!fullName) {
      toast.error('Full name is required')
      return
    }

    if (!email) {
      toast.error('Email is required')
      return
    }

    try {
      setIsProfileUpdating(true)

      const response = await updateAccountDetails({
        fullName,
        email,
      })

      const updatedUser = response?.data ?? response

      setProfileForm({
        fullName: updatedUser?.fullName ?? fullName,
        email: updatedUser?.email ?? email,
      })

      await refetch()

      toast.success('Profile details updated successfully')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to update profile',
      )
    } finally {
      setIsProfileUpdating(false)
    }
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar image must be smaller than 5 MB')
      event.target.value = ''
      return
    }

    const temporaryPreview = URL.createObjectURL(file)

    setAvatarPreview(temporaryPreview)

    try {
      setIsAvatarUpdating(true)

      const response = await updateUserAvatar(file)
      const updatedUser = response?.data ?? response

      if (updatedUser?.avatar) {
        setAvatarPreview(updatedUser.avatar)
        URL.revokeObjectURL(temporaryPreview)
      }

      await refetch()

      toast.success('Avatar updated successfully')
    } catch (error) {
      setAvatarPreview(null)
      URL.revokeObjectURL(temporaryPreview)

      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to update avatar',
      )
    } finally {
      setIsAvatarUpdating(false)
      event.target.value = ''
    }
  }

  const handleCoverChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      event.target.value = ''
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Cover image must be smaller than 8 MB')
      event.target.value = ''
      return
    }

    const temporaryPreview = URL.createObjectURL(file)

    setCoverPreview(temporaryPreview)

    try {
      setIsCoverUpdating(true)

      const response = await updateUserCoverImage(file)
      const updatedUser = response?.data ?? response

      if (updatedUser?.coverImage) {
        setCoverPreview(updatedUser.coverImage)
        URL.revokeObjectURL(temporaryPreview)
      }

      await refetch()

      toast.success('Cover image updated successfully')
    } catch (error) {
      setCoverPreview(null)
      URL.revokeObjectURL(temporaryPreview)

      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to update cover image',
      )
    } finally {
      setIsCoverUpdating(false)
      event.target.value = ''
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()

    const { oldPassword, newPassword, confirmPassword } = passwordForm

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please complete all password fields')
      return
    }

    if (newPassword.length < 6) {
      toast.error('New password must contain at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    if (oldPassword === newPassword) {
      toast.error('New password must be different from old password')
      return
    }

    try {
      setIsPasswordUpdating(true)

      await changeCurrentPassword({
        oldPassword,
        newPassword,
      })

      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      toast.success('Password changed successfully')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to change password',
      )
    } finally {
      setIsPasswordUpdating(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="mt-3 h-5 w-80 max-w-full" />
        </div>

        <Skeleton className="h-72 w-full rounded-3xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    )
  }

  if (userError) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
        <h1 className="text-xl font-semibold">Unable to load settings</h1>

        <p className="mt-2 text-sm text-red-500">
          {typeof userError === 'string'
            ? userError
            : userError?.message || 'Something went wrong'}
        </p>

        <button
          type="button"
          onClick={refetch}
          className="mt-5 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 font-medium text-white transition hover:opacity-90"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

        <p className="mt-2 text-[var(--color-text-secondary)]">
          Manage your profile information, channel appearance and password.
        </p>
      </div>

      <section className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="relative h-48 bg-[var(--color-surface-secondary)] sm:h-64">
          {displayedCover ? (
            <img
              src={displayedCover}
              alt="Channel cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImagePlus
                size={42}
                className="text-[var(--color-text-secondary)]"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <button
            type="button"
            disabled={isCoverUpdating}
            onClick={() => coverInputRef.current?.click()}
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl bg-black/65 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCoverUpdating ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Camera size={17} />
            )}

            {isCoverUpdating ? 'Uploading...' : 'Change cover'}
          </button>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />

          <div className="absolute -bottom-14 left-6 sm:left-10">
            <div className="group relative">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--color-surface)] bg-[var(--color-surface-secondary)] shadow-xl">
                {displayedAvatar ? (
                  <img
                    src={displayedAvatar}
                    alt={user?.fullName || 'User avatar'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <UserRound
                      size={42}
                      className="text-[var(--color-text-secondary)]"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={isAvatarUpdating}
                onClick={() => avatarInputRef.current?.click()}
                aria-label="Change avatar"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed"
              >
                {isAvatarUpdating ? (
                  <Loader2 size={25} className="animate-spin" />
                ) : (
                  <Camera size={25} />
                )}
              </button>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-7 pt-20 sm:px-10">
          <h2 className="text-xl font-semibold">
            {displayedFullName || 'Your channel'}
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            @{user?.username || 'username'}
          </p>

          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            Recommended cover ratio: 16:9. Avatar and cover changes are uploaded
            immediately.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[var(--color-surface-secondary)] p-3">
            <UserRound size={23} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Profile information</h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Update the public name and email associated with your account.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="mt-7 grid gap-5 sm:grid-cols-2"
        >
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium"
            >
              Full name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={displayedFullName}
              onChange={handleProfileChange}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={displayedEmail}
              onChange={handleProfileChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-3 text-[var(--color-text-secondary)] sm:max-w-md"
            />

            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              Username changes are currently disabled.
            </p>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isProfileUpdating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProfileUpdating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {isProfileUpdating ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[var(--color-surface-secondary)] p-3">
            <LockKeyhole size={23} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Change password</h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Use a strong password that you do not use on other websites.
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-7 grid gap-5 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label
              htmlFor="oldPassword"
              className="mb-2 block text-sm font-medium"
            >
              Current password
            </label>

            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              placeholder="Enter your current password"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 outline-none transition focus:border-[var(--color-primary)] sm:max-w-md"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium"
            >
              New password
            </label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              placeholder="Enter a new password"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm new password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              placeholder="Enter the new password again"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isPasswordUpdating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPasswordUpdating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LockKeyhole size={18} />
              )}

              {isPasswordUpdating
                ? 'Changing password...'
                : 'Change password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SettingsPage