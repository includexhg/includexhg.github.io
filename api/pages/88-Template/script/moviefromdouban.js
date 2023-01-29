{"title":"","uid":"1cd19fc71517798e2fa5b7457d1fb06e","text":"//2022-02-15 by Cuman //脚本可以从获取网址信息，访问豆瓣电影网站抓取电影基本信息字段。 const notice = (msg) => new Notice(msg, 5000); const log = (msg) => console.log(msg)...","date":"2023-01-23T09:28:57.302Z","updated":"2022-05-11T01:14:54.000Z","comments":true,"path":"api/pages/88-Template/script/moviefromdouban.js","covers":null,"excerpt":"","content":"//2022-02-15 by Cuman\n//脚本可以从获取网址信息，访问豆瓣电影网站抓取电影基本信息字段。\n\nconst notice = (msg) => new Notice(msg, 5000);\nconst log = (msg) => console.log(msg);\n\nmodule.exports = moviefromdouban\n\nlet QuickAdd;\n\nasync function moviefromdouban(params) {\n  QuickAdd = params;\n  const http_reg = /(http:\\/\\/|https:\\/\\/)((\\w|=|\\?|\\.|\\/|&|-)+)/g;\n  const http_reg_movie = /(http:\\/\\/movie|https:\\/\\/movie)((\\w|=|\\?|\\.|\\/|&|-)+)/g;\n  const query = await QuickAdd.quickAddApi.inputPrompt(\n    \"请输入豆瓣电影网址:\"\n  );\n  if (!query) {\n    notice(\"No url entered.\");\n    throw new Error(\"No url entered.\");\n  }\nif (!http_reg.exec(query)) {\n new Notice('复制的内容需要包含网址', 3000);\n throw new Error(\"No results found.\");\n}\n\n const url = query.match(http_reg)[0];\n    console.log(url);\nif (http_reg_movie.exec(url)) {\n\tlet moviedata = await getmovieByurl(url);\n\tif(moviedata)\n\tnew Notice('电影数据获取成功！', 3000);\n  QuickAdd.variables = {\n    ...moviedata\n  };\n}else\n{\n new Notice('只能解析movie.douban.com相关网址', 3000);\n throw new Error(\"No results found.\");\n}\n }\t \n\n\nasync function getmovieByurl(url) {\n\n let page = await urlGet(url);\n\n   if (!page) {\n    notice(\"No results found.\");\n    throw new Error(\"No results found.\");\n  }\n    let p = new DOMParser();\n    let doc = p.parseFromString(page, \"text/html\");\n    let $ = s => doc.querySelector(s);\n    let director = '';\n    let moviename = '';\n    moviename = $(\"meta[property='og:title']\")?.content\n    director = $(\"meta[property='video:director']\")?.content\n\tsummary = $(\"span[property='v:summary']\")?.textContent??'-';\n\tgenre = $(\"span[property='v:genre']\")?.textContent??'-';\n\tconsole.log(genre)\n\tlet regx = /<[^>]*>|<\\/[^>]*>/gm;\n\tif (summary) {\n\t\t\tsummary = summary.replace('(展开全部)', \"\");\n            summary = summary.replace(regx, \"\").trim();\n            summary = summary.replace(/\\s\\s\\s\\s/gm, \"\\n\");\n\t\t\t\n        }\n\tlet movieinfo = {};\n\tlet reglead= /主演:([\\s\\S]*)(?=类型:)/g;\n\tlet regfilmlength = /片长:.(\\d*)/g;\n\tlet regIMDb = /IMDb:.\\w(.*)/g;\n\tlet regalias = /又名:([\\s\\S]*)(?=IMDb:)/g;\n\tlet reglanguage =/语言:([\\s\\S]*)(?=上映日期:)/g;\n\tlet regcountry = /制片国家\\/地区:([\\s\\S]*)(?=语言:)/g;\n\tlet str =$(\"#info\")?.innerText;\n\tlet lead= reglead.exec(str)\n\tlead=(lead==null)?'未知':lead[1].trim().replace(/\\n|\\r/g,\"\").replace(/\\ +/g,\"\");\n\tmovieinfo.lead = \"'\"+ lead +\"'\";  \n\tlet filmlength=regfilmlength.exec(str);\n\tmovieinfo.filmlength=(filmlength==null)?'0':filmlength[1].trim();\n\tlet IMDb=regIMDb.exec(str);\n\tmovieinfo.IMDb=(IMDb==null)?'未知':IMDb[1].trim();\n\tlet alias=regalias.exec(str);\n\tmovieinfo.alias=(alias==null)?'未知':alias[1].trim();\n\tmovieinfo.alias = '\"'+ movieinfo.alias +'\"';  \n\tlet language=reglanguage.exec(str);\n\tmovieinfo.language=(language==null)?'未知':language[1].trim();\n\tlet country=regcountry.exec(str);\n\tmovieinfo.country=(country==null)?'未知':country[1].trim();\n\t\n\tmovieinfo.fileName =moviename.replace(/[\\/\\\\\\:\\*\\?\\\"\\<\\>\\|│]/gm, \"_\");\n\tmovieinfo.Poster = $(\"meta[property='og:image']\")?.content;\n\tmovieinfo.type = 'movie';\n\tmovieinfo.description = $(\"meta[property='og:description']\")?.content;\n\tmovieinfo.douban_url = $(\"meta[property='og:url']\")?.content;\n\tmovieinfo.director = \"'\"+ director +\"'\";  \n\tmovieinfo.genre =  genre;\n\tmovieinfo.rating = $(\"#interest_sectl > div > div.rating_self > strong\")?.textContent??'-';\n\tmovieinfo.plot = summary;\n\tmovieinfo.runtime =  $(\"span[property='v:runtime']\")?.textContent??'-';\n\tmovieinfo.year = $(\"span[property='v:initialReleaseDate']\")?.textContent??'-';\n\tmovieinfo.banner= movieinfo.Poster.replace('s_ratio_poster', \"1\");\n\t for(var i in movieinfo){\n        if(movieinfo[i]==\"\" || movieinfo[i]== null){\n            movieinfo[i]=\"未知\";\n        }\n    }\n  return movieinfo;\n}\n\nasync function urlGet(url) {\n  let finalURL = new URL(url);\n  let headers = {\n'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.100.4758.11 Safari/537.36'\n};\n  const res = await request({\n    url: finalURL.href,\n    method: \"GET\",\n    cache: \"no-cache\",\n    headers: {\n      \"Content-Type\": \"text/html; charset=utf-8\",\n    },\n  });\n  \n  return res;\n\n\n}\n\n\n","count_time":{"symbolsCount":"4k","symbolsTime":"4 mins."},"toc":""}