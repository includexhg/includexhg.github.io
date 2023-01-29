{"title":"","uid":"1cd19fc71517798e2fa5b7457d1fb06e","text":"let {pages, view, firstDayOfWeek, globalTaskFilter, dailyNoteFolder, dailyNoteFormat, startPosition, css, options} = input; // Error Handlin...","date":"2023-01-23T09:28:57.306Z","updated":"2023-01-03T06:32:07.000Z","comments":true,"path":"api/pages/88-Template/script/tasksCalendar/view.js","covers":null,"excerpt":"","content":"let {pages, view, firstDayOfWeek, globalTaskFilter, dailyNoteFolder, dailyNoteFormat, startPosition, css, options} = input;\n\n// Error Handling\nif (!pages && pages!=\"\") { dv.span('> [!ERROR] Missing pages parameter\\n> \\n> Please set the pages parameter like\\n> \\n> `pages: \"\"`'); return false };\nif (!options.includes(\"style\")) { dv.span('> [!ERROR] Missing style parameter\\n> \\n> Please set a style inside options parameter like\\n> \\n> `options: \"style1\"`'); return false };\nif (!view) { dv.span('> [!ERROR] Missing view parameter\\n> \\n> Please set a default view inside view parameter like\\n> \\n> `view: \"month\"`'); return false };\nif (firstDayOfWeek) { \n\tif (firstDayOfWeek.match(/[|\\\\0123456]/g) == null) { \n\t\tdv.span('> [!ERROR] Wrong value inside firstDayOfWeek parameter\\n> \\n> Please choose a number between 0 and 6');\n\t\treturn false\n\t};\n} else {\n\tdv.span('> [!ERROR] Missing firstDayOfWeek parameter\\n> \\n> Please set the first day of the week inside firstDayOfWeek parameter like\\n> \\n> `firstDayOfWeek: \"1\"`'); \n\treturn false \n};\nif (startPosition) { if (!startPosition.match(/\\d{4}\\-\\d{1,2}/gm)) { dv.span('> [!ERROR] Wrong startPosition format\\n> \\n> Please set a startPosition with the following format\\n> \\n> Month: `YYYY-MM` | Week: `YYYY-ww`'); return false }};\nif (dailyNoteFormat) { if (dailyNoteFormat.match(/[|\\\\YMDWwd.,-: \\[\\]]/g).length != dailyNoteFormat.length) { dv.span('> [!ERROR] The `dailyNoteFormat` contains invalid characters'); return false }};\n\n// Get, Set, Eval Pages\nif (pages==\"\") { var tasks = dv.pages().file.tasks } else { if (pages.startsWith(\"dv.pages\")) { var tasks = eval(pages) } else { var tasks = dv.pages(pages).file.tasks } };\n\n// Variables\nvar done, doneWithoutCompletionDate, due, recurrence, overdue, start, scheduled, process, cancelled, dailyNote, dailyNoteRegEx;\nif (!dailyNoteFormat) { dailyNoteFormat = \"YYYY-MM-DD\" };\nvar dailyNoteRegEx = momentToRegex(dailyNoteFormat)\nvar tToday = moment().format(\"YYYY-MM-DD\");\nvar tMonth = moment().format(\"M\");\nvar tDay = moment().format(\"d\");\nvar tYear = moment().format(\"YYYY\");\nvar tid = (new Date()).getTime();\nif (startPosition) { var selectedMonth = moment(startPosition, \"YYYY-MM\").date(1); var selectedWeek = moment(startPosition, \"YYYY-ww\").startOf(\"week\") } else { var selectedMonth = moment(startPosition).date(1); var selectedWeek = moment(startPosition).startOf(\"week\") };\nvar selectedDate = eval(\"selected\"+capitalize(view));\nvar arrowLeftIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"19\" y1=\"12\" x2=\"5\" y2=\"12\"></line><polyline points=\"12 19 5 12 12 5\"></polyline></svg>';\nvar arrowRightIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"12 5 19 12 12 19\"></polyline></svg>';\nvar filterIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\"></polygon></svg>';\nvar monthIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line><path d=\"M8 14h.01\"></path><path d=\"M12 14h.01\"></path><path d=\"M16 14h.01\"></path><path d=\"M8 18h.01\"></path><path d=\"M12 18h.01\"></path><path d=\"M16 18h.01\"></path></svg>';\nvar weekIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line><path d=\"M17 14h-6\"></path><path d=\"M13 18H7\"></path><path d=\"M7 14h.01\"></path><path d=\"M17 18h.01\"></path></svg>';\nvar listIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"8\" y1=\"6\" x2=\"21\" y2=\"6\"></line><line x1=\"8\" y1=\"12\" x2=\"21\" y2=\"12\"></line><line x1=\"8\" y1=\"18\" x2=\"21\" y2=\"18\"></line><line x1=\"3\" y1=\"6\" x2=\"3.01\" y2=\"6\"></line><line x1=\"3\" y1=\"12\" x2=\"3.01\" y2=\"12\"></line><line x1=\"3\" y1=\"18\" x2=\"3.01\" y2=\"18\"></line></svg>';\nvar calendarClockIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5\"></path><path d=\"M16 2v4\"></path><path d=\"M8 2v4\"></path><path d=\"M3 10h5\"></path><path d=\"M17.5 17.5 16 16.25V14\"></path><path d=\"M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z\"></path></svg>';\nvar calendarCheckIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line><path d=\"m9 16 2 2 4-4\"></path></svg>';\nvar calendarHeartIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7\"></path><path d=\"M16 2v4\"></path><path d=\"M8 2v4\"></path><path d=\"M3 10h18\"></path><path d=\"M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z\"></path></svg>';\nvar cellTemplate = \"<div class='cell ' data-weekday=''><a class='internal-link cellName' href=''></a><div class='cellContent'></div></div>\";\nvar taskTemplate = \"<a class='internal-link' href=''><div class='task ' style='' title=''><div class='inner'><div class='note'></div><div class='icon'></div><div class='description' data-relative=''></div></div></div></a>\";\nconst rootNode = dv.el(\"div\", \"\", {cls: \"tasksCalendar \"+options, attr: {id: \"tasksCalendar\"+tid, view: view, style: 'position:relative;-webkit-user-select:none!important'}});\nif (css) { var style = document.createElement(\"style\"); style.innerHTML = css; rootNode.append(style) };\nvar taskDoneIcon = \"✅\";\nvar taskDueIcon = \"📅\";\nvar taskScheduledIcon = \"⏳\";\nvar taskRecurrenceIcon = \"🔁\";\nvar taskOverdueIcon = \"⚠️\";\nvar taskProcessIcon = \"⏺️\";\nvar taskCancelledIcon = \"🚫\";\nvar taskStartIcon = \"🛫\";\nvar taskDailyNoteIcon = \"📄\";\n\n// Initialze\ngetMeta(tasks);\nsetButtons();\nsetStatisticPopUp();\nsetWeekViewContext();\neval(\"get\"+capitalize(view))(tasks, selectedDate);\n\nfunction getMeta(tasks) {\n\tfor (i=0;i<tasks.length;i++) {\n\t\tvar taskText = tasks[i].text;\n\t\tvar taskFile = getFilename(tasks[i].path);\n\t\tvar dailyNoteMatch = taskFile.match(eval(dailyNoteRegEx));\n\t\tvar dailyTaskMatch = taskText.match(/(\\d{4}\\-\\d{2}\\-\\d{2})/);\n\t\tif (dailyNoteMatch) {\n\t\t\tif(!dailyTaskMatch) {\n\t\t\t\ttasks[i].dailyNote = moment(dailyNoteMatch[1], dailyNoteFormat).format(\"YYYY-MM-DD\")\n\t\t\t};\n\t\t};\n\t\tvar dueMatch = taskText.match(/\\📅\\W(\\d{4}\\-\\d{2}\\-\\d{2})/);\n\t\tif (dueMatch) {\n\t\t\ttasks[i].due = dueMatch[1];\n\t\t\ttasks[i].text = tasks[i].text.replace(dueMatch[0], \"\");\n\t\t};\n\t\tvar startMatch = taskText.match(/\\🛫\\W(\\d{4}\\-\\d{2}\\-\\d{2})/);\n\t\tif (startMatch) {\n\t\t\ttasks[i].start = startMatch[1];\n\t\t\ttasks[i].text = tasks[i].text.replace(startMatch[0], \"\");\n\t\t};\n\t\tvar scheduledMatch = taskText.match(/\\⏳\\W(\\d{4}\\-\\d{2}\\-\\d{2})/);\n\t\tif (scheduledMatch) {\n\t\t\ttasks[i].scheduled = scheduledMatch[1];\n\t\t\ttasks[i].text = tasks[i].text.replace(scheduledMatch[0], \"\");\n\t\t};\n\t\tvar completionMatch = taskText.match(/\\✅\\W(\\d{4}\\-\\d{2}\\-\\d{2})/);\n\t\tif (completionMatch) {\n\t\t\ttasks[i].completion = completionMatch[1];\n\t\t\ttasks[i].text = tasks[i].text.replace(completionMatch[0], \"\");\n\t\t};\n\t\tvar repeatMatch = taskText.includes(\"🔁\");\n\t\tif (repeatMatch) {\n\t\t\ttasks[i].recurrence = true;\n\t\t\ttasks[i].text = tasks[i].text.substring(0, taskText.indexOf(\"🔁\"))\n\t\t};\n\t\tvar lowMatch = taskText.includes(\"🔽\");\n\t\tif (lowMatch) {\n\t\t\ttasks[i].priority = \"D\";\n\t\t};\n\t\tvar mediumMatch = taskText.includes(\"🔼\");\n\t\tif (mediumMatch) {\n\t\t\ttasks[i].priority = \"B\";\n\t\t};\n\t\tvar highMatch = taskText.includes(\"⏫\");\n\t\tif (highMatch) {\n\t\t\ttasks[i].priority = \"A\";\n\t\t};\n\t\tif (!lowMatch && !mediumMatch && !highMatch) {\n\t\t\ttasks[i].priority = \"C\";\n\t\t}\n\t\tif (globalTaskFilter) {\n\t\t\ttasks[i].text = tasks[i].text.replaceAll(globalTaskFilter,\"\");\n\t\t} else {\n\t\t\ttasks[i].text = tasks[i].text.replaceAll(\"#task\",\"\");\n\t\t};\n\t\ttasks[i].text = tasks[i].text.replaceAll(\"[[\",\"\");\n\t\ttasks[i].text = tasks[i].text.replaceAll(\"]]\",\"\");\n\t\ttasks[i].text = tasks[i].text.replace(/\\[.*?\\]/gm,\"\");\n\t};\n};\n\nfunction getFilename(path) {\n\tvar filename = path.match(/^(?:.*\\/)?([^\\/]+?|)(?=(?:\\.[^\\/.]*)?$)/)[1];\n\treturn filename;\n};\n\nfunction capitalize(str) {\n\treturn str[0].toUpperCase() + str.slice(1);\n};\n\nfunction getMetaFromNote(task, metaName) {\n\tvar meta = dv.pages('\"'+task.link.path+'\"')[metaName][0];\n\tif (meta) { return meta } else { return \"\" };\n}\n\nfunction transColor(color, percent) {\n\tvar num = parseInt(color.replace(\"#\",\"\"),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;\n\treturn \"#\" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);\n};\n\nfunction momentToRegex(momentFormat) {\n\tmomentFormat = momentFormat.replaceAll(\".\", \"\\\\.\");\n\tmomentFormat = momentFormat.replaceAll(\",\", \"\\\\,\");\n\tmomentFormat = momentFormat.replaceAll(\"-\", \"\\\\-\");\n\tmomentFormat = momentFormat.replaceAll(\":\", \"\\\\:\");\n\tmomentFormat = momentFormat.replaceAll(\" \", \"\\\\s\");\n\t\n\tmomentFormat = momentFormat.replace(\"dddd\", \"\\\\w{1,}\");\n\tmomentFormat = momentFormat.replace(\"ddd\", \"\\\\w{1,3}\");\n\tmomentFormat = momentFormat.replace(\"dd\", \"\\\\w{2}\");\n\tmomentFormat = momentFormat.replace(\"d\", \"\\\\d{1}\");\n\t\n\tmomentFormat = momentFormat.replace(\"YYYY\", \"\\\\d{4}\");\n\tmomentFormat = momentFormat.replace(\"YY\", \"\\\\d{2}\");\n\t\n\tmomentFormat = momentFormat.replace(\"MMMM\", \"\\\\w{1,}\");\n\tmomentFormat = momentFormat.replace(\"MMM\", \"\\\\w{3}\");\n\tmomentFormat = momentFormat.replace(\"MM\", \"\\\\d{2}\");\n\t\n\tmomentFormat = momentFormat.replace(\"DDDD\", \"\\\\d{3}\");\n\tmomentFormat = momentFormat.replace(\"DDD\", \"\\\\d{1,3}\");\n\tmomentFormat = momentFormat.replace(\"DD\", \"\\\\d{2}\");\n\tmomentFormat = momentFormat.replace(\"D\", \"\\\\d{1,2}\");\n\t\n\tmomentFormat = momentFormat.replace(\"ww\", \"\\\\d{1,2}\");\n\t\n\tregEx = \"/^(\" + momentFormat + \")$/\";\n\tconsole.log(regEx)\n\treturn regEx;\n};\n\nfunction getTasks(date) {\n\tdone = tasks.filter(t=>t.completed && t.checked && t.completion && moment(t.completion.toString()).isSame(date)).sort(t=>t.completion);\n\tdoneWithoutCompletionDate = tasks.filter(t=>t.completed && t.checked && !t.completion && t.due && moment(t.due.toString()).isSame(date)).sort(t=>t.due);\n\tdone = done.concat(doneWithoutCompletionDate);\n\tdue = tasks.filter(t=>!t.completed && !t.checked && !t.recurrence && t.due && moment(t.due.toString()).isSame(date)).sort(t=>t.due);\n\trecurrence = tasks.filter(t=>!t.completed && !t.checked && t.recurrence && t.due && moment(t.due.toString()).isSame(date)).sort(t=>t.due);\n\toverdue = tasks.filter(t=>!t.completed && !t.checked && t.due && moment(t.due.toString()).isBefore(date)).sort(t=>t.due);\n\tstart = tasks.filter(t=>!t.completed && !t.checked && t.start && moment(t.start.toString()).isSame(date)).sort(t=>t.start);\n\tscheduled = tasks.filter(t=>!t.completed && !t.checked && t.scheduled && moment(t.scheduled.toString()).isSame(date)).sort(t=>t.scheduled);\n\tprocess = tasks.filter(t=>!t.completed && !t.checked && t.due && t.start && moment(t.due.toString()).isAfter(date) && moment(t.start.toString()).isBefore(date) );\n\tcancelled = tasks.filter(t=>!t.completed && t.checked && t.due && moment(t.due.toString()).isSame(date)).sort(t=>t.due);\n\tdailyNote = tasks.filter(t=>!t.completed && !t.checked && t.dailyNote && moment(t.dailyNote.toString()).isSame(date)).sort(t=>t.dailyNote);\n};\n\nfunction setTask(obj, cls) {\n\tvar lighter = 25;\n\tvar darker = -40;\n\tvar noteColor = getMetaFromNote(obj, \"color\");\n\tvar textColor = getMetaFromNote(obj, \"textColor\");\n\tvar noteIcon = getMetaFromNote(obj, \"icon\");\n\tvar taskText = obj.text.replace(\"'\", \"&apos;\");\n\tvar taskPath = obj.link.path.replace(\"'\", \"&apos;\");\n\tvar taskIcon = eval(\"task\"+capitalize(cls)+\"Icon\");\n\tif (obj.due) { var relative = moment(obj.due).fromNow() } else { var relative = \"\" };\n\tvar noteFilename = getFilename(taskPath);\n\tif (noteIcon) { noteFilename = noteIcon+\"&nbsp;\"+noteFilename } else { noteFilename = taskIcon+\"&nbsp;\"+noteFilename; cls += \" noNoteIcon\" };\n\tvar taskSubpath = obj.header.subpath;\n\tvar taskLine = taskSubpath ? taskPath+\"#\"+taskSubpath : taskPath;\n \tif (noteColor && textColor) {\n \t\tvar style = \"--task-background:\"+noteColor+\"33;--task-color:\"+noteColor+\";--dark-task-text-color:\"+textColor+\";--light-task-text-color:\"+textColor;\n \t} else if (noteColor && !textColor){\n \t\tvar style = \"--task-background:\"+noteColor+\"33;--task-color:\"+noteColor+\";--dark-task-text-color:\"+transColor(noteColor, darker)+\";--light-task-text-color:\"+transColor(noteColor, lighter);\n\t\tvar style = \"--task-background:\"+noteColor+\"33;--task-color:\"+noteColor+\";--dark-task-text-color:\"+transColor(noteColor, darker)+\";--light-task-text-color:\"+transColor(noteColor, lighter);\n \t} else if (!noteColor && textColor ){\n \t\tvar style = \"--task-background:#7D7D7D33;--task-color:#7D7D7D;--dark-task-text-color:\"+transColor(textColor, darker)+\";--light-task-text-color:\"+transColor(textColor, lighter);\n \t} else {\n \t\tvar style = \"--task-background:#7D7D7D33;--task-color:#7D7D7D;--dark-task-text-color:\"+transColor(\"#7D7D7D\", darker)+\";--light-task-text-color:\"+transColor(\"#7D7D7D\", lighter);\n \t};\n\tvar newTask = taskTemplate.replace(\"\", taskText).replace(\"\", cls).replace(\"\", taskLine).replace(\"\",\"done\").replaceAll(\"\",style).replace(\"\", noteFilename + \": \" + taskText).replace(\"\",noteFilename).replace(\"\",taskIcon).replace(\"\",relative);\n\treturn newTask;\n};\n\nfunction setTaskContentContainer(currentDate) {\n\tvar cellContent = \"\";\n\t\n\tfunction compareFn(a, b) {\n\t\tif (a.priority.toUpperCase() < b.priority.toUpperCase()) {\n\t\t\treturn -1;\n\t\t};\n\t\tif (a.priority.toUpperCase() > b.priority.toUpperCase()) {\n\t\t\treturn 1;\n\t\t};\n\t\tif (a.priority == b.priority) {\n\t\t\tif (a.text.toUpperCase() < b.text.toUpperCase()) {\n\t\t\t\treturn -1;\n\t\t\t};\n\t\t\tif (a.text.toUpperCase() > b.text.toUpperCase()) {\n\t\t\t\treturn 1;\n\t\t\t};\n\t\t\treturn 0;\n\t\t};\n\t};\n\n\tfunction showTasks(tasksToShow, type) {\n\t\tconst sorted = [...tasksToShow].sort(compareFn);\n\t\tfor (var t = 0; t < sorted.length; t++) {\n\t\t\tcellContent += setTask(sorted[t], type)\n\t\t};\n\t};\n\n\tif (tToday == currentDate) {\n\t\tshowTasks(overdue, \"overdue\");\n\t};\n\tshowTasks(due, \"due\");\n\tshowTasks(recurrence, \"recurrence\");\n\tshowTasks(start, \"start\");\n\tshowTasks(scheduled, \"scheduled\");\n\tshowTasks(process, \"process\");\n\tshowTasks(dailyNote, \"dailyNote\");\n\tshowTasks(done, \"done\");\n\tshowTasks(cancelled, \"cancelled\");\n\treturn cellContent;\n};\n\nfunction setButtons() {\n\tvar buttons = \"<button class='filter'>\"+filterIcon+\"</button><button class='listView' title='List'>\"+listIcon+\"</button><button class='monthView' title='Month'>\"+monthIcon+\"</button><button class='weekView' title='Week'>\"+weekIcon+\"</button><button class='current'></button><button class='previous'>\"+arrowLeftIcon+\"</button><button class='next'>\"+arrowRightIcon+\"</button><button class='statistic' percentage=''></button>\";\n\trootNode.querySelector(\"span\").appendChild(dv.el(\"div\", buttons, {cls: \"buttons\", attr: {}}));\n\tsetButtonEvents();\n};\n\nfunction setButtonEvents() {\n\trootNode.querySelectorAll('button').forEach(btn => btn.addEventListener('click', (() => {\n\t\tvar activeView = rootNode.getAttribute(\"view\");\n\t\tif ( btn.className == \"previous\" ) {\n\t\t\tif (activeView == \"month\") {\n\t\t\t\tselectedDate = moment(selectedDate).subtract(1, \"months\");\n\t\t\t\tgetMonth(tasks, selectedDate);\n\t\t\t} else if (activeView == \"week\") {\n\t\t\t\tselectedDate = moment(selectedDate).subtract(7, \"days\").startOf(\"week\");\n\t\t\t\tgetWeek(tasks, selectedDate);\n\t\t\t} else if (activeView == \"list\") {\n\t\t\t\tselectedDate = moment(selectedDate).subtract(1, \"months\");\n\t\t\t\tgetList(tasks, selectedDate);\n\t\t\t}\n\t\t} else if ( btn.className == \"current\") {\n\t\t\tif (activeView == \"month\") {\n\t\t\t\tselectedDate = moment().date(1);\n\t\t\t\tgetMonth(tasks, selectedDate);\n\t\t\t} else if (activeView == \"week\") {\n\t\t\t\tselectedDate = moment().startOf(\"week\");\n\t\t\t\tgetWeek(tasks, selectedDate);\n\t\t\t} else if (activeView == \"list\") {\n\t\t\t\tselectedDate = moment().date(1);\n\t\t\t\tgetList(tasks, selectedDate);\n\t\t\t};\n\t\t} else if ( btn.className == \"next\" ) {\n\t\t\tif (activeView == \"month\") {\n\t\t\t\tselectedDate = moment(selectedDate).add(1, \"months\");\n\t\t\t\tgetMonth(tasks, selectedDate);\n\t\t\t} else if (activeView == \"week\") {\n\t\t\t\tselectedDate = moment(selectedDate).add(7, \"days\").startOf(\"week\");\n\t\t\t\tgetWeek(tasks, selectedDate);\n\t\t\t} else if (activeView == \"list\") {\n\t\t\t\tselectedDate = moment(selectedDate).add(1, \"months\");\n\t\t\t\tgetList(tasks, selectedDate);\n\t\t\t};\n\t\t} else if ( btn.className == \"filter\" ) {\n\t\t\trootNode.classList.toggle(\"filter\");\n\t\t\trootNode.querySelector('#statisticDone').classList.remove(\"active\");\n\t\t\trootNode.classList.remove(\"focusDone\");\n\t\t} else if ( btn.className == \"monthView\" ) {\n\t\t\tif ( moment().format(\"ww-YYYY\") == moment(selectedDate).format(\"ww-YYYY\") ) {\n\t\t\t\tselectedDate = moment().date(1);\n\t\t\t} else {\n\t\t\t\tselectedDate = moment(selectedDate).date(1);\n\t\t\t};\n\t\t\tgetMonth(tasks, selectedDate);\n\t\t} else if ( btn.className == \"listView\" ) {\n\t\t\tif ( moment().format(\"ww-YYYY\") == moment(selectedDate).format(\"ww-YYYY\") ) {\n\t\t\t\tselectedDate = moment().date(1);\n\t\t\t} else {\n\t\t\t\tselectedDate = moment(selectedDate).date(1);\n\t\t\t};\n\t\t\tgetList(tasks, selectedDate);\n\t\t} else if ( btn.className == \"weekView\" ) {\n\t\t\tif (rootNode.getAttribute(\"view\") == \"week\") {\n\t\t\t\tvar leftPos = rootNode.querySelector(\"button.weekView\").offsetLeft;\n\t\t\t\trootNode.querySelector(\".weekViewContext\").style.left = leftPos+\"px\";\n\t\t\t\trootNode.querySelector(\".weekViewContext\").classList.toggle(\"active\");\n\t\t\t\tif (rootNode.querySelector(\".weekViewContext\").classList.contains(\"active\")) {\n\t\t\t\t\tvar closeContextListener = function() {\n\t\t\t\t\t\trootNode.querySelector(\".weekViewContext\").classList.remove(\"active\");\n\t\t\t\t\t\trootNode.removeEventListener(\"click\", closeContextListener, false);\n\t\t\t\t\t};\n\t\t\t\t\tsetTimeout(function() {\n\t\t\t\t\t\trootNode.addEventListener(\"click\", closeContextListener, false);\n\t\t\t\t\t}, 100);\n\t\t\t\t};\n\t\t\t} else {\n\t\t\t\tif (moment().format(\"MM-YYYY\") != moment(selectedDate).format(\"MM-YYYY\")) {\n\t\t\t\t\tselectedDate = moment(selectedDate).startOf(\"month\").startOf(\"week\");\n\t\t\t\t} else {\n\t\t\t\t\tselectedDate = moment().startOf(\"week\");\n\t\t\t\t};\n\t\t\t\tgetWeek(tasks, selectedDate);\n\t\t\t};\n\t\t} else if ( btn.className == \"statistic\" ) {\n\t\t\trootNode.querySelector(\".statisticPopup\").classList.toggle(\"active\");\n\t\t};\n\t\tbtn.blur();\n\t})));\n\trootNode.addEventListener('contextmenu', function(event) {\n\t\tevent.preventDefault();\n\t});\n};\n\nfunction setWrapperEvents() {\n\trootNode.querySelectorAll('.wrapperButton').forEach(wBtn => wBtn.addEventListener('click', (() => {\n\t\tvar week = wBtn.getAttribute(\"data-week\");\n\t\tvar year = wBtn.getAttribute(\"data-year\");\n\t\tselectedDate = moment(moment(year).add(week, \"weeks\")).startOf(\"week\");\n\t\trootNode.querySelector(`#tasksCalendar${tid} .grid`).remove();\n\t\tgetWeek(tasks, selectedDate);\n\t})));\n};\n\nfunction setStatisticPopUpEvents() {\n\trootNode.querySelectorAll('.statisticPopup li').forEach(li => li.addEventListener('click', (() => {\n\t\tvar group = li.getAttribute(\"data-group\");\n\t\tconst liElements = rootNode.querySelectorAll('.statisticPopup li');\n\t\tif (li.classList.contains(\"active\")) {\n\t\t\tconst liElements = rootNode.querySelectorAll('.statisticPopup li');\n\t\t\tfor (const liElement of liElements) {\n\t\t\t\tliElement.classList.remove('active');\n\t\t\t};\n\t\t\trootNode.classList.remove(\"focus\"+capitalize(group));\n\t\t} else {\n\t\t\tfor (const liElement of liElements) {\n\t\t\t\tliElement.classList.remove('active');\n\t\t\t};\n\t\t\tli.classList.add(\"active\");\n\t\t\trootNode.classList.remove.apply(rootNode.classList, Array.from(rootNode.classList).filter(v=>v.startsWith(\"focus\")));\n\t\t\trootNode.classList.add(\"focus\"+capitalize(group));\n\t\t};\n\t})));\n};\n\nfunction setStatisticPopUp() {\n\tvar statistic = \"<li id='statisticDone' data-group='done'></li>\";\n\tstatistic += \"<li id='statisticDue' data-group='due'></li>\";\n\tstatistic += \"<li id='statisticOverdue' data-group='overdue'></li>\";\n\tstatistic += \"<li class='break'></li>\";\n\tstatistic += \"<li id='statisticStart' data-group='start'></li>\";\n\tstatistic += \"<li id='statisticScheduled' data-group='scheduled'></li>\";\n\tstatistic += \"<li id='statisticRecurrence' data-group='recurrence'></li>\";\n\tstatistic += \"<li class='break'></li>\";\n\tstatistic += \"<li id='statisticDailyNote' data-group='dailyNote'></li>\";\n\trootNode.querySelector(\"span\").appendChild(dv.el(\"ul\", statistic, {cls: \"statisticPopup\"}));\n\tsetStatisticPopUpEvents();\n};\n\nfunction setWeekViewContextEvents() {\n\trootNode.querySelectorAll('.weekViewContext li').forEach(li => li.addEventListener('click', (() => {\n\t\tvar selectedStyle = li.getAttribute(\"data-style\");\n\t\tconst liElements = rootNode.querySelectorAll('.weekViewContext li');\n\t\tif (!li.classList.contains(\"active\")) {\n\t\t\tfor (const liElement of liElements) {\n\t\t\t\tliElement.classList.remove('active');\n\t\t\t};\n\t\t\tli.classList.add(\"active\");\n\t\t\trootNode.classList.remove.apply(rootNode.classList, Array.from(rootNode.classList).filter(v=>v.startsWith(\"style\")));\n\t\t\trootNode.classList.add(selectedStyle);\n\t\t};\n\t\trootNode.querySelector(\".weekViewContext\").classList.toggle(\"active\");\n\t})));\n};\n\nfunction setWeekViewContext() {\n\tvar activeStyle = Array.from(rootNode.classList).filter(v=>v.startsWith(\"style\"));\n\tvar liElements = \"\";\n\tvar styles = 11;\n\tfor (i=1;i<styles+1;i++) {\n\t\tvar liIcon = \"<div class='liIcon iconStyle\"+i+\"'><div class='box'></div><div class='box'></div><div class='box'></div><div class='box'></div><div class='box'></div><div class='box'></div><div class='box'></div></div>\";\n\t\tliElements += \"<li data-style='style\"+i+\"'>\"+liIcon+\"Style \"+i+\"</li>\";\n\t};\n\trootNode.querySelector(\"span\").appendChild(dv.el(\"ul\", liElements, {cls: \"weekViewContext\"}));\n\trootNode.querySelector(\".weekViewContext li[data-style=\"+activeStyle+\"]\").classList.add(\"active\");\n\tsetWeekViewContextEvents();\n};\n\nfunction setStatisticValues(dueCounter, doneCounter, overdueCounter, startCounter, scheduledCounter, recurrenceCounter, dailyNoteCounter) {\n\tvar taskCounter = parseInt(dueCounter+doneCounter+overdueCounter);\n\tvar tasksRemaining = taskCounter - doneCounter;\n\tvar percentage = Math.round(100/(dueCounter+doneCounter+overdueCounter)*doneCounter);\n\tpercentage = isNaN(percentage) ? 100 : percentage;\n\t\n\tif (dueCounter == 0 && doneCounter == 0) {\n\t\trootNode.querySelector(\"button.statistic\").innerHTML = calendarHeartIcon;\n\t} else if (tasksRemaining > 0) {\n\t\trootNode.querySelector(\"button.statistic\").innerHTML = calendarClockIcon;\n\t} else if (dueCounter == 0 && doneCounter != 0) {\n\t\trootNode.querySelector(\"button.statistic\").innerHTML = calendarCheckIcon;\n\t};\n\tif (tasksRemaining > 99) {tasksRemaining = \"⚠️\"};\n\trootNode.querySelector(\"button.statistic\").setAttribute(\"data-percentage\", percentage);\n\trootNode.querySelector(\"button.statistic\").setAttribute(\"data-remaining\", tasksRemaining);\n\trootNode.querySelector(\"#statisticDone\").innerText = \"✅ Done: \" + doneCounter + \"/\" + taskCounter;\n\trootNode.querySelector(\"#statisticDue\").innerText = \"📅 Due: \" + dueCounter;\n\trootNode.querySelector(\"#statisticOverdue\").innerText = \"⚠️ Overdue: \" + overdueCounter;\n\trootNode.querySelector(\"#statisticStart\").innerText = \"🛫 Start: \" + startCounter;\n\trootNode.querySelector(\"#statisticScheduled\").innerText = \"⏳ Scheduled: \" + scheduledCounter;\n\trootNode.querySelector(\"#statisticRecurrence\").innerText = \"🔁 Recurrence: \" + recurrenceCounter;\n\trootNode.querySelector(\"#statisticDailyNote\").innerText = \"📄 Daily Notes: \" + dailyNoteCounter;\n};\n\nfunction removeExistingView() {\n\tif (rootNode.querySelector(`#tasksCalendar${tid} .grid`)) {\n\t\trootNode.querySelector(`#tasksCalendar${tid} .grid`).remove();\n\t} else if (rootNode.querySelector(`#tasksCalendar${tid} .list`)) {\n\t\trootNode.querySelector(`#tasksCalendar${tid} .list`).remove();\n\t};\n};\n\nfunction getMonth(tasks, month) {\n\tremoveExistingView();\n\tvar currentTitle = \"<span>\"+moment(month).format(\"MMMM\")+\"</span><span> \"+moment(month).format(\"YYYY\")+\"</span>\";\n\trootNode.querySelector('button.current').innerHTML = currentTitle;\n\tvar gridContent = \"\";\n\tvar firstDayOfMonth = moment(month).format(\"d\");\n\tvar firstDateOfMonth = moment(month).startOf(\"month\").format(\"D\");\n\tvar lastDateOfMonth = moment(month).endOf(\"month\").format(\"D\");\n\tvar dueCounter = 0;\n\tvar doneCounter = 0;\n\tvar overdueCounter = 0;\n\tvar startCounter = 0;\n\tvar scheduledCounter = 0;\n\tvar recurrenceCounter = 0;\n\tvar dailyNoteCounter = 0;\n\t\n\t// Move First Week Of Month To Second Week In Month View\n\tif (firstDayOfMonth == 0) { firstDayOfMonth = 7};\n\t\n\t// Set Grid Heads\n\tvar gridHeads = \"\";\n\tfor (h=0-firstDayOfMonth+parseInt(firstDayOfWeek);h<7-firstDayOfMonth+parseInt(firstDayOfWeek);h++) {\n\t\tvar weekDayNr = moment(month).add(h, \"days\").format(\"d\");\n\t\tvar weekDayName = moment(month).add(h, \"days\").format(\"ddd\");\n\t\tif ( tDay == weekDayNr && tMonth == moment(month).format(\"M\") && tYear == moment(month).format(\"YYYY\") ) {\n\t\t\tgridHeads += \"<div class='gridHead today' data-weekday='\" + weekDayNr + \"'>\" + weekDayName + \"</div>\";\n\t\t} else {\n\t\t\tgridHeads += \"<div class='gridHead' data-weekday='\" + weekDayNr + \"'>\" + weekDayName + \"</div>\";\n\t\t};\n\t};\n\t\n\t// Set Wrappers\n\tvar wrappers = \"\";\n\tvar starts = 0-firstDayOfMonth+parseInt(firstDayOfWeek);\n\tfor (w=1; w<7; w++) {\n\t\tvar wrapper = \"\";\n\t\tvar weekNr = \"\";\n\t\tvar yearNr = \"\";\n\t\tvar monthName = moment(month).format(\"MMM\").replace(\".\",\"\").substring(0,3);\n\t\tfor (i=starts;i<starts+7;i++) {\n\t\t\tif (i==starts) {\n\t\t\t\tweekNr = moment(month).add(i, \"days\").format(\"w\");\n\t\t\t\tyearNr = moment(month).add(i, \"days\").format(\"YYYY\");\n\t\t\t};\n\t\t\tvar currentDate = moment(month).add(i, \"days\").format(\"YYYY-MM-DD\");\n\t\t\tif (!dailyNoteFolder) {var dailyNotePath = currentDate} else {var dailyNotePath = dailyNoteFolder+\"/\"+currentDate};\n\t\t\tvar weekDay = moment(month).add(i, \"days\").format(\"d\");\n\t\t\tvar shortDayName = moment(month).add(i, \"days\").format(\"D\");\n\t\t\tvar longDayName = moment(month).add(i, \"days\").format(\"D. MMM\");\n\t\t\tvar shortWeekday = moment(month).add(i, \"days\").format(\"ddd\");\n\n\t\t\t// Filter Tasks\n\t\t\tgetTasks(currentDate);\n\t\t\t\n\t\t\t// Count Events Only From Selected Month\n\t\t\tif (moment(month).format(\"MM\") == moment(month).add(i, \"days\").format(\"MM\")) {\n\t\t\t\tdueCounter += due.length;\n\t\t\t\tdueCounter += recurrence.length;\n\t\t\t\tdueCounter += scheduled.length;\n\t\t\t\tdueCounter += dailyNote.length;\n\t\t\t\tdoneCounter += done.length;\n\t\t\t\tstartCounter += start.length;\n\t\t\t\tscheduledCounter += scheduled.length;\n\t\t\t\trecurrenceCounter += recurrence.length;\n\t\t\t\tdailyNoteCounter += dailyNote.length;\n\t\t\t\t// Get Overdue Count From Today\n\t\t\t\tif (moment().format(\"YYYY-MM-DD\") == moment(month).add(i, \"days\").format(\"YYYY-MM-DD\")) {\n\t\t\t\t\toverdueCounter = overdue.length;\n\t\t\t\t};\n\t\t\t};\n\t\t\t\n\t\t\t// Set New Content Container\n\t\t\tvar cellContent = setTaskContentContainer(currentDate);\n\t\t\n\t\t\t// Set Cell Name And Weekday\n\t\t\tif ( moment(month).add(i, \"days\").format(\"D\") == 1 ) {\n\t\t\t\tvar cell = cellTemplate.replace(\"1674466137306\", currentDate).replace(\"\", longDayName).replace(\"\", cellContent).replace(\"\", weekDay).replace(\"\", dailyNotePath);\n\t\t\t\tcell = cell.replace(\"\", \" newMonth\");\n\t\t\t} else {\n\t\t\t\tvar cell = cellTemplate.replace(\"1674466137306\", currentDate).replace(\"\", shortDayName).replace(\"\", cellContent).replace(\"\", weekDay).replace(\"\", dailyNotePath);\n\t\t\t};\n\t\t\n\t\t\t// Set prevMonth, currentMonth, nextMonth\n\t\t\tif (i < 0) {\n\t\t\t\tcell = cell.replace(\"\", \"prevMonth\");\n\t\t\t} else if (i >= 0 && i < lastDateOfMonth && tToday !== currentDate) {\n\t\t\t\tcell = cell.replace(\"\", \"currentMonth\");\n\t\t\t} else if ( i >= 0 && i< lastDateOfMonth && tToday == currentDate) {\n\t\t\t\tcell = cell.replace(\"\", \"currentMonth today\");\n\t\t\t} else if (i >= lastDateOfMonth) {\n\t\t\t\tcell = cell.replace(\"\", \"nextMonth\");\n\t\t\t};\n\t\t\twrapper += cell;\n\t\t};\n\t\twrappers += \"<div class='wrapper'><div class='wrapperButton' data-week='\"+weekNr+\"' data-year='\"+yearNr+\"'>W\"+weekNr+\"</div>\"+wrapper+\"</div>\";\n\t\tstarts += 7;\n\t};\n\tgridContent += \"<div class='gridHeads'><div class='gridHead'></div>\"+gridHeads+\"</div>\";\n\tgridContent += \"<div class='wrappers' data-month='\"+monthName+\"'>\"+wrappers+\"</div>\";\n\trootNode.querySelector(\"span\").appendChild(dv.el(\"div\", gridContent, {cls: \"grid\"}));\n\tsetWrapperEvents();\n\tsetStatisticValues(dueCounter, doneCounter, overdueCounter, startCounter, scheduledCounter, recurrenceCounter, dailyNoteCounter);\n\trootNode.setAttribute(\"view\", \"month\");\n};\n\nfunction getWeek(tasks, week) {\n\tremoveExistingView();\n\tvar currentTitle = \"<span>\"+moment(week).format(\"YYYY\")+\"</span><span> \"+moment(week).format(\"[W]w\")+\"</span>\";\n\trootNode.querySelector('button.current').innerHTML = currentTitle\n\tvar gridContent = \"\";\n\tvar currentWeekday = moment(week).format(\"d\");\n\tvar weekNr = moment(week).format(\"[W]w\");\n\tvar dueCounter = 0;\n\tvar doneCounter = 0;\n\tvar overdueCounter = 0;\n\tvar startCounter = 0;\n\tvar scheduledCounter = 0;\n\tvar recurrenceCounter = 0;\n\tvar dailyNoteCounter = 0;\n\t\n\tfor (i=0-currentWeekday+parseInt(firstDayOfWeek);i<7-currentWeekday+parseInt(firstDayOfWeek);i++) {\n\t\tvar currentDate = moment(week).add(i, \"days\").format(\"YYYY-MM-DD\");\n\t\tif (!dailyNoteFolder) {var dailyNotePath = currentDate} else {var dailyNotePath = dailyNoteFolder+\"/\"+currentDate};\n\t\tvar weekDay = moment(week).add(i, \"days\").format(\"d\");\n\t\tvar dayName = moment(currentDate).format(\"ddd D.\");\n\t\tvar longDayName = moment(currentDate).format(\"ddd, D. MMM\");\n\t\t\n\t\t// Filter Tasks\n\t\tgetTasks(currentDate);\n\t\t\n\t\t// Count Events From Selected Week\n\t\tdueCounter += due.length;\n\t\tdueCounter += recurrence.length;\n\t\tdueCounter += scheduled.length;\n\t\tdueCounter += dailyNote.length;\n\t\tdoneCounter += done.length;\n\t\tstartCounter += start.length;\n\t\tscheduledCounter += scheduled.length;\n\t\trecurrenceCounter += recurrence.length;\n\t\tdailyNoteCounter += dailyNote.length;\n\t\tif (moment().format(\"YYYY-MM-DD\") == moment(week).add(i, \"days\").format(\"YYYY-MM-DD\")) {\n\t\t\toverdueCounter = overdue.length;\n\t\t};\n\t\n\t\t// Set New Content Container\n\t\tvar cellContent = setTaskContentContainer(currentDate);\n\t\t\n\t\t// Set Cell Name And Weekday\n\t\tvar cell = cellTemplate.replace(\"1674466137306\", currentDate).replace(\"\", longDayName).replace(\"\", cellContent).replace(\"\", weekDay).replace(\"\", dailyNotePath);\n\n\t\t// Set Cell Name And Weekday\n\t\tif ( moment(week).add(i, \"days\").format(\"D\") == 1 ) {\n\t\t\tvar cell = cellTemplate.replace(\"1674466137306\", currentDate).replace(\"\", longDayName).replace(\"\", cellContent).replace(\"\", weekDay).replace(\"\", dailyNotePath);\n\t\t} else {\n\t\t\tvar cell = cellTemplate.replace(\"1674466137306\", currentDate).replace(\"\", dayName).replace(\"\", cellContent).replace(\"\", weekDay).replace(\"\", dailyNotePath);\n\t\t};\n\t\t\t\n\t\t// Set Today, Before Today, After Today\n\t\tif (currentDate < tToday) {\n\t\t\tcell = cell.replace(\"\", \"beforeToday\");\n\t\t} else if (currentDate == tToday) {\n\t\t\tcell = cell.replace(\"\", \"today\");\n\t\t} else if (currentDate > tToday) {\n\t\t\tcell = cell.replace(\"\", \"afterToday\");\n\t\t};\n\t\tgridContent += cell;\n\t};\n\trootNode.querySelector(\"span\").appendChild(dv.el(\"div\", gridContent, {cls: \"grid\", attr:{'data-week': weekNr}}));\n\tsetStatisticValues(dueCounter, doneCounter, overdueCounter, startCounter, scheduledCounter, recurrenceCounter, dailyNoteCounter);\n\trootNode.setAttribute(\"view\", \"week\");\n};\n\nfunction getList(tasks, month) {\n\tremoveExistingView();\n\tvar currentTitle = \"<span>\"+moment(month).format(\"MMMM\")+\"</span><span> \"+moment(month).format(\"YYYY\")+\"</span>\";\n\trootNode.querySelector('button.current').innerHTML = currentTitle;\n\tvar listContent = \"\";\n\tvar dueCounter = 0;\n\tvar doneCounter = 0;\n\tvar overdueCounter = 0;\n\tvar startCounter = 0;\n\tvar scheduledCounter = 0;\n\tvar recurrenceCounter = 0;\n\tvar dailyNoteCounter = 0;\n\t\n\t// Loop Days From Current Month\n\tfor (i=0;i<moment(month).endOf('month').format(\"D\");i++) {\n\t\tvar currentDate = moment(month).startOf('month').add(i, \"days\").format(\"YYYY-MM-DD\");\n\t\tvar monthName = moment(month).format(\"MMM\").replace(\".\",\"\").substring(0,3);\n\n\t\t// Filter Tasks\n\t\tgetTasks(currentDate);\n\t\t\n\t\t// Count Events\n\t\tdueCounter += due.length;\n\t\tdueCounter += recurrence.length;\n\t\tdueCounter += scheduled.length;\n\t\tdueCounter += dailyNote.length;\n\t\tdoneCounter += done.length;\n\t\tstartCounter += start.length;\n\t\tscheduledCounter += scheduled.length;\n\t\trecurrenceCounter += recurrence.length;\n\t\tdailyNoteCounter += dailyNote.length;\n\t\tif (moment().format(\"YYYY-MM-DD\") == currentDate) {\n\t\t\toverdueCounter = overdue.length;\n\t\t\tlistContent += \"<details open class='today'><summary><span>\" + moment(currentDate).format(\"dddd, D\") + \"</span><span class='weekNr'> \" + moment(currentDate).format(\"[W]w\") + \"</span></summary><div class='content'>\" + setTaskContentContainer(currentDate) + \"</div></details>\"\n\t\t} else {\n\t\t\tlistContent += \"<details open><summary><span>\" + moment(currentDate).format(\"dddd, D\") + \"</span><span class='weekNr'> \" + moment(currentDate).format(\"[W]w\") + \"</span></summary><div class='content'>\" + setTaskContentContainer(currentDate) + \"</div></details>\"\n\t\t};\n\t};\n\trootNode.querySelector(\"span\").appendChild(dv.el(\"div\", listContent, {cls: \"list\", attr:{\"data-month\": monthName}}));\n\tsetStatisticValues(dueCounter, doneCounter, overdueCounter, startCounter, scheduledCounter, recurrenceCounter, dailyNoteCounter);\n\trootNode.setAttribute(\"view\", \"list\");\n\t\n\t// Scroll To Today If Selected Month Is Current Month\n\tif ( moment().format(\"YYYY-MM\") == moment(month).format(\"YYYY-MM\") ) {\n\t\tvar listElement = rootNode.querySelector(\".list\");\n\t\tvar todayElement = rootNode.querySelector(\".today\")\n\t\tvar scrollPos = todayElement.offsetTop - todayElement.offsetHeight + 85;\n\t\tlistElement.scrollTo(0, scrollPos);\n\t};\n};\n","count_time":{"symbolsCount":"19k","symbolsTime":"18 mins."},"toc":""}