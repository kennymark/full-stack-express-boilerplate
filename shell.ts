
import shell from "shelljs";

shell.cp("-rf", "views", "build/views");
shell.cp("-rf", "public", "build/public");
shell.cp("-rf", "emails", "build/emails");
