
module.exports = (port, dev=!process.env.PORT)=> {

  if (!dev)
    var handleReq = require('./handlereq')
  else
    var handleReq = (req, resp)=> {
      require('./handlereq')(req, resp)
      delete require.cache[require.resolve('./handlereq')]
    }

  require('http').createServer(handleReq).listen(port,
    ()=> dev? console.log('Server started on port '+port) :0)
}