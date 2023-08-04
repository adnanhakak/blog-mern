export const formatDateAndTime=(isoTimestamp)=> {
    const dateObj = new Date(isoTimestamp);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = String(hours % 12 || 12).padStart(2, "0");
    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    const formattedDate = `${day}/${month}/${year}`;
    return `${formattedDate} , ${formattedTime}`;
  }

  export  const createDropdownItems = (x) => {
    if (typeof x === 'number') {
        let arr = [];
        for (let i = 1; i <= x; i++) {
            arr.push(i);
        }
        return arr;
    } else if (Array.isArray(x)) {
        return x;
    }
};