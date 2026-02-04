import chalk from 'chalk';

export const logger = {
  info: (msg: string) => console.log(chalk.cyan('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✓'), msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  error: (msg: string) => console.log(chalk.red('✗'), msg),
  break: () => console.log(''),

  title: (msg: string) => {
    console.log('');
    console.log(chalk.bold.cyan(msg));
    console.log(chalk.gray('─'.repeat(50)));
  },

  component: (name: string, description: string, badges: string[] = []) => {
    const badgeStr = badges.map(b => chalk.gray(`[${b}]`)).join(' ');
    console.log(`  ${chalk.cyan(name.padEnd(22))} ${badgeStr}`);
    if (description) {
      console.log(`  ${chalk.gray(description)}`);
    }
  },

  step: (current: number, total: number, msg: string) => {
    console.log(chalk.gray(`  [${current}/${total}]`), msg);
  },

  importExample: (importStr: string) => {
    console.log(chalk.yellow(`  ${importStr}`));
  },
};
