const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// const date = new Date();
const now = new Date()


export const getDateFormate = (date:Date) => {

  if (date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) {
    return null
  } else if (date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth()) {
    const diff = now.getDate() - date.getDate()
    console.log(diff)
    if (diff >= 0 && diff <= 6) {
      return days[date.getDay()]
    } else {
      return `${date.getDate()} ${months[date.getMonth()]} `
    }
  } else if (date.getFullYear() == now.getFullYear()) {
    return `${date.getDate()} ${months[date.getMonth()]} `
  } else {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }
}


