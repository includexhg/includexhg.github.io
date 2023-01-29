{"title":"","uid":"1cd19fc71517798e2fa5b7457d1fb06e","text":"const path = require('path'); /****感谢锋华提供的js脚本 2022-01-22****/ module.exports = async function colorclock (params) { const pickedSticky = aw...","date":"2023-01-23T09:28:57.299Z","updated":"2022-03-30T16:18:18.000Z","comments":true,"path":"api/pages/88-Template/script/changeSticky.js","covers":null,"excerpt":"","content":"const path = require('path');\n/****感谢锋华提供的js脚本 2022-01-22****/\nmodule.exports = async function colorclock (params) {\n  const pickedSticky = await params.quickAddApi.suggester(\n    [\"便签一(倒计时)\",\"便签二\",\"便签三\",\"便签四\"],\n    [1,2,3,4]\n  );\n\n  let stickyContent = await params.quickAddApi.wideInputPrompt(\"请输入便签内容\")\n  const stickyPatter1 = /(?<=1--\\>\\W)\\<p\\Wclass=\"stickies\".*\\>([\\w\\W]*?)\\<\\/p\\>/\n  const stickyPatter2 = /(?<=2--\\>\\W)\\<p\\Wclass=\"stickies2\".*\\>([\\w\\W]*?)\\<\\/p\\>/\n  const stickyPatter3 = /(?<=3--\\>\\W)\\<p\\Wclass=\"stickies\".*\\>([\\w\\W]*?)\\<\\/p\\>/\n  const stickyPatter4 = /(?<=4--\\>\\W)\\<p\\Wclass=\"stickies2\".*\\>([\\w\\W]*?)\\<\\/p\\>/\n\n  const filePath = path.join(app.vault.adapter.basePath,\"88-Template\",\"home.md\")\n  const fileContent = await app.vault.adapter.fs.readFileSync(filePath, \"utf8\")\n\n  if(pickedSticky == \"1\" && stickyContent){\n    let newContent = fileContent.replace(stickyPatter1,  `<p class=\"stickies\" style=\"max-width:180px\" >\\n${stickyContent}\\n</p>\\n`)\n    await app.vault.adapter.fs.writeFileSync(filePath, newContent,\"utf8\")\n  }else if(pickedSticky == \"2\" && stickyContent){\n    let newContent = fileContent.replace(stickyPatter2, `<p class=\"stickies2\" style=\"max-width:200px\" >\\n${stickyContent}\\n</p>\\n`)\n    await app.vault.adapter.fs.writeFileSync(filePath, newContent,\"utf8\")\n  }else if(pickedSticky == \"3\" && stickyContent){\n    let newContent = fileContent.replace(stickyPatter3, `<p class=\"stickies\" style=\"max-width:200px\">\\n${stickyContent}\\n</p>\\n`)\n    await app.vault.adapter.fs.writeFileSync(filePath, newContent,\"utf8\")\n  }else if(pickedSticky == \"4\" && stickyContent){\n    let newContent = fileContent.replace(stickyPatter4, `<p class=\"stickies2\" style=\"max-width:200px\" >\\n${stickyContent}\\n</p>\\n`)\n    await app.vault.adapter.fs.writeFileSync(filePath, newContent,\"utf8\")\n  }else{\n    console.log(\"pickSticky error!\")\n  }\n\n}\n","count_time":{"symbolsCount":"1.5k","symbolsTime":"1 mins."},"toc":""}