const fs = require('fs').promises

url = '/folder/index.html'
url = '/folder/index'
url = '/folder/script.js'

// handle(url)
//   .then(result => console.log(result))
//   .catch(_=> console.log(url+' not available'))
explore(process.cwd()+'/public'+url)
  .then(result => console.log(...result))
  .catch(_=> console.log(url+' not available'))

async function handle(url) {
  url = 'public'+url
  const target = await fs.stat(url).catch(_=>fs.stat(url+'.html'))
  if (target.isDirectory()) url += '/index'
  if (!url.match(/\.(\w+)$/)) url += '.html'
  return await fs.readFile(url, 'utf-8');
}
async function explore(path) {
  const target = await fs.stat(path).catch(_=>fs.stat(path+'.html'))
  if (target.isDirectory()) path += '/index'
  const match = path.match(/\.(\w+)$/), ext = match? match[1] : 'html'
  if (!match) path += '.html'
  return [await fs.(path, 'utf-8'), ext];
}

setTimeout(()=>{}, 1e6)