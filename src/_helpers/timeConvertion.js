import moment from 'moment'

// eslint-disable-next-line import/prefer-default-export
export const getTimeDifference = date => {
  const timeDiff = moment().diff(moment(date), 'days')

  if (timeDiff < 1) {
    const diffInHours = moment().diff(moment(date), 'hours')
    if (diffInHours < 1) {
      const diffInMinutes = moment().diff(moment(date), 'minutes')
      if (diffInMinutes < 1) {
        return 'Just now'
      }
      return `${diffInMinutes} minutes ago`
    }
    return `${diffInHours} hours ago`
  }

  if (timeDiff > 7) {
    return moment(date).format('DD/MM/YYYY')
  }

  return `${timeDiff} days ago`
}
