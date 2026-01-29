// 1. Получение мета-информации страницы

// Язык страницы
const lang = document.documentElement.lang

// Заголовок страницы
const pageTitle = document.title.split('—')
const pageTitleWithoutName = pageTitle[1].trim()

// Ключевые слова
const metaKeywords = document.querySelector('meta[name="keywords"]')
const keywords = metaKeywords.content
    .split(',')
    .map(word => word.trim())

// Описание из мета-тега
const metaDescription = document.querySelector('meta[name="description"]').content 

// Оpengraph-описание
const ogTags = {}

const metaOg = document.querySelectorAll('meta[property^="og:"]') // ^ - начинается с og:
metaOg.forEach((tag) => {
    const property = tag.getAttribute('property')
    const key = property.replace(/^og:/, '')
    const value = tag.getAttribute('content')
    ogTags[key] = value
})
// console.log(ogTags)

// console.log(document)
// 2. Данные карточки товара

// Идентификатор товара
const firstSection = document.querySelector('section')
const productId = firstSection.dataset.id // для поиска среди data-...
// const productId = firstSection.getAttribute('id')

// Массив фотографий
function parseImages (productSelector = '.product') {
    const product = document.querySelector(productSelector)

    if (!product) {
        return []
    }

    const images = []

    const mainIngElement = product.querySelector('.preview figure img')
    images.push({
        full: mainIngElement.src,
        thumb: mainIngElement.src,
        alt: mainIngElement.alt
    })

    const thumbImgs = product.querySelectorAll('.preview nav img')

    thumbImgs.forEach((img) => {
        const full = img.src
        const thumb = img.dataset.src
        const alt = img.alt

        if (full !== images[0].full) {
            images.push(
                {full, thumb, alt}
            )
        }
    })

    return images
}

const parseImage = parseImages()

// Статус лайка
const likeButton = document.querySelector('.like')
const isLiked = likeButton.classList.contains('active') // ne rabotaet

// Название товара
const productName = document.querySelector('h1').textContent.trim()

// Массивы бирок, категорий и скидок 
const tagsArr = document.querySelectorAll('.tags span')

const tagsCategory = []
const tagsLabel = []
const tagsDiscount = []

tagsArr.forEach((tag) => {
    const text = tag.textContent.trim()

    if(tag.classList.contains('green')) {
        tagsCategory.push(text)
    } else if (tag.classList.contains('blue')) {
        tagsLabel.push(text)
    } else if (tag.classList.contains('red')) {
        tagsDiscount.push(text)
    }
})

// Цена товара с учётом скидки
const price = document.querySelector('.price')
    .firstChild
    .textContent
    .trim()
    .replace(/\D/, '' ) // заменяем любой символ кроме цифры

// Цена товара без скидки
const oldPrice = document.querySelector('.price span')
    .textContent
    .replace(/\D/, '' ) // заменяем любой символ кроме цифры

// Размер скидки
const discount = `${100 - ((price / oldPrice) * 100)}%`

// Валюта
function parseCurrency(text) {
    if(!text) return null

    if (text.includes('$')) return 'USD'
    if (text.includes('€')) return 'EUR'
    if (text.includes('₽')) return 'RUB'

}
const priceTextEl = document.querySelector('.price').textContent
const currency = parseCurrency(priceTextEl)

// Свойства товара
const productProperties = {}

const productPropertiesContent = document.querySelectorAll('.properties li')
productPropertiesContent.forEach((row) => {
    const cells = row.querySelectorAll('span')

    if (cells.length >= 2) {
        const key = cells[0].textContent
        const value = cells[1].textContent

        productProperties[key] = value
    }
})

// Полное описание (Полная хуйня)
function parseFullDescription () {
    const fullDescription = document.querySelector('.description')

    if(!fullDescription) return ''

    const descriptionText = fullDescription.querySelectorAll('p')

    let html=''

    descriptionText.forEach((str) => {
        html += `<p>${str.textContent.trim()}</p>` 
    })

    return html
}

const fullDescription = parseFullDescription()

// 3. Массив дополнительных товаров.
function parseDopProduct () {
    const items = document.querySelectorAll('.suggested .items article')

    const result = []

    items.forEach((item) => {
        const img = item.querySelector('img')
        const title = item.querySelector('h3')
        const priceEl = item.querySelector('b')
        const description = item.querySelector('p')

        const priceText = priceEl.textContent.trim()
    
        const price = priceText.replace(/\D/, '')
        const currency = parseCurrency(priceText)

    result.push({
        image: img.src,
        title: title.textContent.trim(),
        price,
        currency,
        description: description.textContent.trim()
        })
    })

    return result
} 

const dopProduct = parseDopProduct()

// 4. Массив обзоров

function parseReviews () {
    const items = document.querySelectorAll('.reviews .items article')

    const result = []

    items.forEach((item) => {
        const stars = item.querySelectorAll('.rating span.filled')
        const rating = stars.length // Количество заполненых звезд - рейтинг

        const title = item.querySelector('h3.title').textContent.trim()
        const description = item.querySelector('p').textContent.trim()

        const authorName = item.querySelector('.author span').textContent.trim()
        const avatar = item.querySelector('.author img').src

        const dateText = item.querySelector('.author i').textContent.trim()
        const dateParts = dateText.split('/')
        const date = `${dateParts[0]}.${dateParts[1]}.${dateParts[2]}`

        result.push({
            rating,
            title,
            description,
            author: {avatar, authorName},
            date
        })
    })

    return result
}

const review = parseReviews()

function parsePage() {
    return {
        meta: {lang, pageTitleWithoutName, keywords, metaDescription, ogTags},
        product: {
            productId, 
            parseImage, 
            isLiked, 
            productName, 
            tagsCategory, 
            tagsLabel, 
            tagsDiscount, 
            price, 
            oldPrice, 
            discount, 
            currency, 
            productProperties, 
            fullDescription},
        suggested: [dopProduct],
        reviews: [review]
    };
}

window.parsePage = parsePage;