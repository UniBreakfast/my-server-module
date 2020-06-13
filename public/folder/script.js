
console.img =(src, size=20)=> Object.assign(new Image(), {src, onload() {
  console.log('%c ', style=`background-size:contain;background:url(${src}) no-repeat;
    padding:${this.height/100*size}px ${this.width/100*size}px;font-size:1px`)
}})

Object.prototype.assign = function(...props) {
  return Object.assign(this, ...props)
}

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
    const start = getTime(),
          report =(res, status)=> {
            console.log(start+' - '+getTime()+' '+status+' ', res)
            if (res.constructor.name=='Response' && res.status==200) {
              if (res.headers.get('content-type')?.startsWith('image/'))
                res.clone().blob().then(blob => new FileReader()
                  .assign({onload() { console.img(this.result) }})
                  .readAsDataURL(blob))
              else res.clone().text().then(text =>
                { try { JSON.parse(text).c() } catch { text.c() } })
            }
          },
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

fetch('flowchart.png')
  .then(response => response.blob())
  .then(blob => new FileReader()
    .assign({onload() { console.img(this.result) }}).readAsDataURL(blob))


fetch('helsi-logo.svg')
  .then(response => response.blob())
  .then(blob => new FileReader()
    .assign({onload() { console.img(this.result) }}).readAsDataURL(blob))