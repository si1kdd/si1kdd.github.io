"use strict";

// ES 6

class Command {
    constructor(exec_name, callback, description = '') {
        this.exec_name = exec_name;
        this.callback = callback;
        this.description = description;
    }
    run() {
        this.callback();
        print_prompt();
    }
}
