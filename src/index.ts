// ref:
// - https://umijs.org/plugin/develop.html
import { join } from 'path';

export default function (api, options) {
  console.log(api)
  api.registerCommand(
    'kiwiinit',
    {
      hide: true,
    },
    args => {
      require('child_process').exec('kiwi --init', [], (error, stdout, stderr) => {
        if (error) {
          console.error('exec error: ' + error)
          return
        }
        console.log(stdout)
        console.log(stderr)

      });

    })

    api.modifyAFWebpackOpts(memo => {
      return {
        ...memo,
        alias: {
          ...(memo.alias || {}),
          'umi/I18N': join(__dirname, './I18N.js'),
        },
      };
    });
}
