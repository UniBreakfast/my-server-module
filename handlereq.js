const fs = require('fs'), fsp = fs.promises

module.exports = async (req, resp, dev)=> {
  let { url } = req

  if (url=='/favicon.ico' && dev) url = '/devicon.ico'

  let path = process.cwd()+'/public'+url

  try {
    const target = await fsp.stat(path).catch(_=> fsp.stat(path+'.html'))
    if (target.isDirectory()) path += '/index'
    const match = path.match(/\.(\w+)$/), ext = match? match[1] : 'html'
    if (!match) path += '.html'

    fs.createReadStream(path).pipe(resp)

    resp.setHeader('Content-Type', {
      html: 'text/html',
      json: 'application/json',
      css: 'text/css',
      ico: 'image/x-icon',
      jpg: 'image/jpeg',
      gif: 'image/gif',
      js: 'application/javascript',
    }[ext])

  } catch { resp.end(url+' is not available') }

}
