{"title":"","uid":"1cd19fc71517798e2fa5b7457d1fb06e","text":"async function getWeather(city){ let result = await fetch(\"https://wttr.in/\"+city+\"?format=3\").then(async (res) => await res.text()); result...","date":"2023-01-23T09:28:57.307Z","updated":"2022-03-30T16:25:23.000Z","comments":true,"path":"api/pages/88-Template/script/template/taskprogress.js","covers":null,"excerpt":"","content":"async function getWeather(city){\n\n  let result = await fetch(\"https://wttr.in/\"+city+\"?format=3\").then(async (res) => await res.text());\n\tresult = result.replace(/:/g,'').replace(/\\+/g,'');\n\treturn result;\n}\n\nmodule.exports =  getWeather","count_time":{"symbolsCount":237,"symbolsTime":"1 mins."},"toc":""}