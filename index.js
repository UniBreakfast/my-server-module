
module.exports = (port, dev=!process.env.PORT)=> {

  if (!dev)
    var handleReq = require('./handlereq')
  else
    var handleReq = (req, resp)=> {
      require('./handlereq')(req, resp, dev)
      delete require.cache[require.resolve('./handlereq')]
    }

  return require('http').createServer(handleReq).listen(port,
    ()=> dev? console.log('Server started at http://localhost:'+port) :0)
}