
var program = require("commander");

program
  .version('0.0.1')
  .option("-s, --x [ss]", "sssssss")
  .option('-p, --port <port>', 'specify the port [3000]', Number, 3000)
  .option('-H, --hidden', 'enable hidden file serving')
  .option('-I, --no-icons', 'disable file icons')
  .option('-L, --no-logs', 'disable request logging');

  // $ deploy setup stage
  // $ deploy setup
  program
    .command('setup')
    .option("-s, --x [ss]", "sssssss")
    .description('run setup commands for all envs')
    .action(function(env){
		console.log(env.parent.x );
    });

program.parse(process.argv);
