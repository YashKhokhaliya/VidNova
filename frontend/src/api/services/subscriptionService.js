import axiosInstance from '../axiosInstance.js'

export const toggleSubscription = async (channelId) => {
  const response = await axiosInstance.post(
    `/subscriptions/c/${channelId}`,
  )

  return response.data
}

export const getChannelSubscribers = async (channelId) => {
  const response = await axiosInstance.get(
    `/subscriptions/c/${channelId}`,
  )

  return response.data
}

export const getSubscribedChannels = async (subscriberId) => {
  const response = await axiosInstance.get(
    `/subscriptions/u/${subscriberId}`,
  )

  return response.data
}