const fs = require('fs'), fsp = fs.promises

{
  let lastTime
  const getTime =()=> new Date().toLocaleTimeString('en', {hour12: false})
  Object.prototype.c = function(label) {
    const time = getTime(),  val = this.valueOf()
    console.log(time == lastTime? '': lastTime = time, typeof label=='string'?
      label+':' : typeof label=='number'? label+'.' : '', val)
    return val
  }
  Promise.prototype.c = function(label) {
    let onresolve = _ => _,  onreject = _ => _
    const start = getTime(),  report =(result, status)=>
            console.log(start+' - '+getTime()+' '+status+' ', result),
          resolve = val => report(val, 'resolved') || onresolve(val),
          reject = err => report(err, 'rejected') || onreject(err),
          prom = this.then(resolve, reject)
    this.then =(cb1, cb2)=> {
      if (cb1) onresolve = cb1
      if (cb2) onreject = cb2
      return prom
    }
    this.catch = prom.catch = cb => {
      onreject = cb
      return prom
    }
    return this
  }
}

module.exports = async (req, resp, dev)=> {
  const { apiClerk } = req.socket._server

  let { url } = req

  if (apiClerk && url.startsWith('/api/')) {
    resp.setHeader('Content-Type', 'application/json')
    return resp.end(JSON.stringify(apiClerk.handle(req)))
  }

  if (url=='/favicon.ico' && dev) url = '/devicon.ico'

  let path = process.cwd()+'/public'+url

  try {
    const target = await fsp.stat(path).catch(_=> fsp.stat(path+='.html'))
    if (target.isDirectory()) path += '/index.html'
    const match = path.match(/\.(\w+)$/), ext = match? match[1] : 'html'

    fs.createReadStream(path).pipe(resp)

    resp.setHeader('Content-Type', {
      html: 'text/html',
      json: 'application/json',
      css: 'text/css',
      ico: 'image/x-icon',
      jpg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      js: 'application/javascript',
    }[ext])

  } catch { resp.end('"... sorry, '+url+' is not available"') }

}
