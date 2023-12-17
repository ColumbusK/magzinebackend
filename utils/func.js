function classifyByDate(array) {
  console.log("classifyByDate")
  console.log(array)
  if (array.length == 0) return []
  else {
    const res = []
    let date = ""
    let index = -1
    for (let i = 0; i < array.length; i++) {
      const item = array[i]
      let tag = ''
      const titleDate = item.title.split('-')[1]
      if (titleDate.length === 6) {
        tag = titleDate.substr(0, 4)
      } else if (titleDate.length === 8) {
        const tag1 = titleDate.substr(0, 4)
        const tag2 = titleDate.substr(4, 2)
        tag = tag.concat(tag1, '/', tag2)

      }
      // console.log(tag)
      if (tag !== date) {
        date = tag
        index += 1
        const obj = {}
        obj[tag] = [array[i]]
        res.push(obj)
      } else if (tag === date) {
        res[index][tag].push(array[i])
      }
    }
    console.log(res)
    return res
  }
}

module.exports = classifyByDate
