// @todo: напишите здесь код парсера

// 1. Получение мета-информации страницы

// Язык страницы
const lang = document.documentElement.lang

// Заголовок страницы
const pageTitle = document.title.split('—')
const pageTitleWithoutName = pageTitle[1].trim()

// Ключевые слова
const metaKeywords = document.querySelector('meta[name="keywords"]')
const keywords = metaKeywords.content.split(',')

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

// 3. Массив дополнительных товаров.

// 4. Массив обзоров


function parsePage() {
    return {
        meta: {lang, pageTitleWithoutName, keywords, metaDescription, ogTags},
        product: {},
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;