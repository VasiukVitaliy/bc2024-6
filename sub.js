const { program } = require("commander");

program
  .requiredOption('-h,--host <URL>', "host")
  .requiredOption('-p,--port <num>', 'port of server')
  .requiredOption('-c,--cache <path>', "path to cache");

program.parse();

let opt = program.opts();
if (!opt.host || !opt.port || !opt.cache) {
  throw new Error('no request param');
}
const host = opt.host;
const port = opt.port;
const path_to_cache = opt.cache;
const full_path = path_to_cache + '/collection.json';

module.exports = {host,port, path_to_cache, full_path}