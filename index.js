const mongoose = require("mongoose")
const request = require("request-promise")
const cheerio = require("cheerio")
const FirstPost = require("./FirstPost")

//mongodb+srv://pcmourya:pcmourya@cluster0.pxxpz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//$('div[class="title-wrap"] > p').text()



async function connectToMongoDb(){
    await mongoose.connect(
        "mongodb+srv://pcmourya:pcmourya@cluster0.pxxpz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        { maxPoolSize:50,
            wtimeoutMS:2500,
            useNewUrlParser:true}
    )
    console.log("Connected to database")
}

async function scrape(html){
    const $ = await cheerio.load(html)

    const data = $("div[class=big-thumb]")
    .map((i,element) => {
        const content = $(element).find('div[class="title-wrap"] > p').text().trim()
        const image = $(element).find("img").attr("src")
        const link = $(element).find("a[class='thumb-img']").attr("href")
        const firstPost = new FirstPost({
            content,
            image,
            link
        })
        firstPost.save()
        return {content,image,link}
    }).get()
    console.log(data)

}

async function main(){
    await connectToMongoDb()
    const news = await request.get("https://www.firstpost.com/")
    scrape(news)
    const sports = await request.get("https://www.firstpost.com/category/sports")
    scrape(sports)
    const bussiness = await request.get("https://www.firstpost.com/category/business")
    scrape(bussiness)
}

main()