const magzines = [
  {
    "title": "经济学人-20221001",
    "type": "TE",
    "coverUrl": "https://newstorage007.blob.core.windows.net/tutorial-container/TE20221001.jpg",
    "panUrl": "https://newstorage007.blob.core.windows.net/tutorial-container/TE20221001.pdf",
    "datetime": "2022-10-01 10:00:00",
    "tags": "eco/social/political"
  },
  {
    "title": "经济学人-20221008",
    "type": "TE",
    "coverUrl": "https://newstorage007.blob.core.windows.net/tutorial-container/TE20221008.jpg",
    "panUrl": "https://newstorage007.blob.core.windows.net/tutorial-container/TE20221008.pdf",
    "datetime": "2022-10-10 00:00:00",
    "tags": "eco/social/political"
  },

  {
    "title": "国家地理-202209",
    "type": "NG",
    "coverUrl": "https://newstorage007.blob.core.windows.net/tutorial-container/NG202209.jpg",
    "panUrl": "https://www.aliyundrive.com/s/WDvkxJ5F3WZ",
    "datetime": "2022-09-10 00:00:00",
    "tags": "nature/geographic/history"
  },
  {
    "title": "中国国家旅游-江南",
    "type": "CNT",
    "coverUrl": "https://newstorage007.blob.core.windows.net/tutorial-container/CNT202207.jpg",
    "panUrl": "https://www.aliyundrive.com/s/MRysrqF4X5U",
    "datetime": "2022-09-10 00:00:00",
    "tags": "travel/geographic/history"
  }
]

function classifyByDate(array) {
  if (array.length == 0) return []
  else {
    const res = []
    let date = ""
    for (let i = 0; i < array.length; i++) {
      const item = array[i]
      let tag = ''
      const titleDate = item.title.split('-')[1]
      if (titleDate.length === 6) {
        tag = titleDate.substr(0, 4)
      } else if (titleDate.length === 8) {
        tag = titleDate.substr(0, 4)
      }
    }
  }
  return
}


console.log("经济学人-20230225".length)
