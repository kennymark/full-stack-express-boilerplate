
import shell from "shelljs";

if (shell.test('-e', 'build')) {
  shell.rm('build')
}
else {
  shell.cp("-rf", "views", "build/views");
  shell.cp("-rf", "public", "build/public");
  shell.cp("-rf", "emails", "build/emails");
}

