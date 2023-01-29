{"title":"","uid":"1cd19fc71517798e2fa5b7457d1fb06e","text":"//---------------------------------------------------- // author： cuman //plugin: https://github.com/cumany/obsidian-echarts // date: 2022-0...","date":"2023-01-23T09:28:57.300Z","updated":"2022-06-02T05:42:55.000Z","comments":true,"path":"api/pages/88-Template/script/dv_getWordCloud.js","covers":null,"excerpt":"","content":"//----------------------------------------------------\n// author： cuman\n//plugin: https://github.com/cumany/obsidian-echarts\n// date: 2022-06-12\n// source： https://github.com/cumany/Blue-topaz-examples\n//----------------------------------------------------\n\nconst text = input.text;\nconst filename = input.filename\nconst container = input.container;\nconst stopwords_path = input.stopwords_path;\nasync function removeMarkdown (text) {\n    let excludeComments= true //排除注释\n    let excludeCode= true //排除代码块\n    let plaintext = text\n    if (excludeComments) {\n     plaintext = plaintext\n    .replace(/<!--.*?-->/sg, \"\")\n    .replace(/%%.*?%%/sg, \"\");\n    }\n    if (excludeCode) {\n    plaintext = plaintext\n    .replace(/```([\\s\\S]*)```[\\s]*/g, \"\");\n    \n    }\n     plaintext = plaintext\n    .replace(/`\\$?=[^`]+`/g, \"\") // inline dataview\n    .replace(/^---\\n.*?\\n---\\n/s, \"\") // YAML Header\n    .replace(/!?\\[(.+)\\]\\(.+\\)/g, \"$1\") // URLs & Image Captions\n    .replace(/\\*|_|\\[\\[|\\]\\]|\\||==|~~|---|#|> |`/g, \"\"); // Markdown Syntax\n    return plaintext;\n    }\n\n  async function filter_stopwords (stopwords_path,cutresult) { \n      let stopwords =''\n      //查看文件是否存在\n      let result=[];\n        await app.vault.adapter.read(stopwords_path).then(async (data) => { \n            stopwords = data.toString();\n            stopwords = stopwords.split('\\n');\n            for (let i = 0; i < cutresult.length; i++) {\n                if (stopwords.indexOf(cutresult[i]) == -1) {\n                    result.push(cutresult[i]);\n                }\n            }\n            result = result.filter(function (s) { return s && s.trim();})\n    })\n    return result;\n  }\n\n//使用finalFunc()\n\n  let  str=await removeMarkdown(text)\n  const  cuter=app.plugins.plugins['cm-chs-patch'].cut.bind(app.plugins.plugins['cm-chs-patch'])\n    let cutresult =cuter(str.replace(' ',''))\n    \n    let datas=await filter_stopwords(stopwords_path,cutresult).then(result => {\n      let countedNames = result.reduce((obj, name) => { \n        if (name in obj) {\n          obj[name]++\n        } else {\n          obj[name]=1\n        }\n        return obj\n      }, {})\n      return Object.entries(countedNames)\n      })\n\n      let newresult = datas.map(vals => ( { name: vals[0],value: vals[1] }) );\n      const search='content' // content \n      newresult.forEach((data)=>{\n          data['search']=search\n          data['file']=filename\n      })\n      var option = {\n          tooltip: {},\n          series: [{\n              type: 'wordCloud',\n              width: '100%',\n              height: '100%',\n              sizeRange: [20, 80],\n              rotationRange: [0, 0],\n              textPadding: 0,\n              autoSize: {\n                  enable: true,\n                  minSize: 6,\n                },\n              layoutAnimation: true,\n              textStyle: {\n                  fontFamily: 'sans-serif',\n                  fontWeight: 'bold',\n                  color: function () {\n                      // Random color\n                      return 'rgb(' + [\n                      Math.round(Math.random() * 200) + 50,\n                      Math.round(Math.random() * 150),\n                       Math.round(Math.random() * 150) + 50\n                                  ].join(',') + ')';\n                  }\n              },\n              emphasis: {\n                  textStyle: {\n                      textShadowBlur: 2,\n                      color: '#528'\n                  }\n              },\n              data: newresult\n          }]\n      }\n      app.plugins.plugins['obsidian-echarts'].render(option, container)","count_time":{"symbolsCount":"3k","symbolsTime":"3 mins."},"toc":""}