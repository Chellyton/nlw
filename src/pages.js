//Executar o server no terminal bash: npm run dev
const Database = require("./database/db")

const { subjects, weekdays, getSubject,convertHoursToMinutes } = require("./utils/format")


pageLanding = (req, res) => {
    return res.render("index.html")
}

pageStudy = async (req, res) => {
    const filters = req.query

    if(!filters.subject || !filters.weekday || !filters.time){
        return res.render("study.html", {filters, subjects, weekdays })
    }

    //converter horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
        SELECT * from proffys JOIN classes 
        ON classes.proffy_id = proffys.id
        WHERE EXISTS (
            SELECT * FROM classes_schedule c
            WHERE c.class_id = classes.id
            AND c.weekday = ${filters.weekday}
            AND c.time_from <= ${timeToMinutes}
            AND c.time_to > ${timeToMinutes}
        )
        AND classes.subject = "${filters.subject}"
    `

    // caso haja erro na hora da consulta do banco de dados.
    try {
        const db = await Database
        const proffys = await db.all(query)

        proffys.map((proffy)=>{
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render("study.html",{proffys,subjects,filters,weekdays})

    } catch (error) {
        console.log(error)
    }


}

pageGiveClasses = (req, res) => {
    return res.render("give-classes.html", { subjects, weekdays })
}

 saveClasses = async (req,res) =>{
    const createProffy = require('./database/createProffy')
    
    const proffyValue={
        name: req.body.name,
        avatar : req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }

    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }

    const classScheduleValues = req.body.weekday.map(
        (weekday, index)=>{

            return {
                weekday,
                time_from: convertHoursToMinutes(req.body.time_from[index]),
                time_to: convertHoursToMinutes(req.body.time_to[index])
            }

    })
    try {
        const db = await Database
        await createProffy(db,{proffyValue, classValue, classScheduleValues})
        
        let queryString = "?subject="+ req.body.subject
        queryString += "&weekday" + req.body.weekday[0]
        queryString += "&time=" + req.body.time_from[0]

        return res.redirect("/study")
    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
}