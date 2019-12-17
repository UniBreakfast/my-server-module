const fs = require('fs'), fsp = fs.promises

module.exports = async (req, resp, dev)=> {
  const { apiClerk } = req.socket._server

  let { url } = req

  if (apiClerk && url.startsWith('/api/')) {
    // const reqBody = (parts=[])=> new Promise((resolve, reject)=>
    //   req.on('error', reject).on('data', part => parts.push(part))
    //     .on('end', ()=> resolve(Buffer.concat(parts).toString('utf8'))))
    // try {
    //   const data = await apiClerk(req, JSON.parse(await reqBody() || '{}'), dev)
    //   resp.setHeader('Content-Type', 'application/json')
    //   return resp.end(JSON.stringify(data))
    // }
    // catch (e) { console.log('api error:', e) }
    resp.setHeader('Content-Type', 'application/json')
    return resp.end(JSON.stringify(apiClerk.handle(req)))
  }

  if (url=='/favicon.ico' && dev) url = '/devicon.ico'

  let path = process.cwd()+'/public'+url

  try {
    const target = await fsp.stat(path).catch(_=> fsp.stat(path+='.html'))
    if (target.isDirectory()) path += '/index.html'
    const match = path.match(/\.(\w+)$/), ext = match? match[1] : 'html'
    // if (!match) path += '.html'

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

  } catch { resp.end('"... sorry, '+url+' is not available"') }

}
