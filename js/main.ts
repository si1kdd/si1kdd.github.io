let stdout : any;
let fg_color: string = 'white';
let bg_color: string = 'rgba(0, 0, 0, 0)';

class Command {
    exec_name: string;
    callback: any;
    descrption: string;
    constructor(exec_name: string, callback: any, descrption: string = '') {
        this.exec_name = exec_name;
        this.callback = callback;
        this.descrption = descrption;
    }
    run() {
        this.callback();
        print_prompt();
    }
};

function 
print_out(stream: any, str: string, fg: string = fg_color, bg: string = bg_color) {
    let node = document.createElement('pre');
    node.style.color = fg;
    node.style.backgroundColor = bg;
    node.textContent = str;
    stream.appendChild(node);
}

function 
print_ln(stream: any, str: string, fg: string = fg_color, bg: string = bg_color) {
    let splited_str = str.split('\n');
    for (let sp of splited_str) {
        let node = document.createElement('pre');
        node.style.color = fg;
        node.style.backgroundColor = bg;
        node.textContent = sp;
        stream.appendChild(node);
        stream.appendChild(document.createElement('br'));
    }
}

function 
print_si1kdd() {
    print_ln(stdout, 'Hello, I am \n\
        _ _ _       _     _         \n\
    ___(_) | | ____| | __| |        \n\
   / __| | | |/ / _` |/ _` |        \n\
   \\__ \\ | |   < (_| | (_| |        \n\
   |___/_|_|_|\\_\\__,_|\\__,_|        \n');
}

function 
print_prompt() {
    print_out(stdout, 'fakesh $ ', 'green');
}

function 
print_url(stream: any, href : string, fg = fg_color, bg = bg_color) {
    let node = document.createElement('a');
    node.style.color = fg;
    node.style.backgroundColor = bg;
    node.textContent = href;
    node.target = '_self';
    node.setAttribute('href', href);
    stream.appendChild(node);
}

function 
cmd_whoami() {
    print_out(stdout, "Name: ", 'white');
    print_out(stdout, '\t\tDav(id) Sullivan, aka ');
    print_out(stdout, 'si1kdd', 'red'); 
    print_ln(stdout, '')

    print_out(stdout, 'College: ', 'white');
    print_out(stdout, '\tNational Chiao Tung University');
    print_ln(stdout, '');

    print_out(stdout, 'About Me:\t', 'white');
    print_url(stdout, "https://si1kdd.bitbucket.io/about", 'blue');
    print_ln(stdout, '');
}

function 
cmd_repos() {
    print_out(stdout, 'My Open Source Repositories: ', 'yellow');

    print_out(stdout, '\nGithub: (For long term open source projects)', 'red');
    print_out(stdout, '\t\n\t');
    print_url(stdout, "https://github.com/si1kdd", 'white');

    print_out(stdout, '\nBitbucket: (Some college homeworks i stored)', 'blue');
    print_out(stdout, '\t\n\t');
    print_url(stdout, "https://bitbucket.org/si1kdd", 'white');
    print_ln(stdout, '');
}

function 
cmd_blog() {
    print_out(stdout, 'Blog: ', 'grey');
    print_out(stdout, '\t');
    print_url(stdout, 'https://si1kdd.bitbucket.io/');
    print_ln(stdout, '');
}

function 
cmd_help(shell: any) {
    print_ln(stdout, 'fake shell (v0.11) all commands:', 'red');
    for (let i = 0; i < shell.bin.length; i++) {
        let cmds = shell.bin[i];
        print_ln(stdout, cmds.exec_name + '\t - ' + cmds.descrption, 'yellow');
    }
}

function 
select_last(editable_element: any) {
    let range = document.createRange();
    let select = window.getSelection();
    range.selectNodeContents(editable_element);
    range.collapse(false);
    select.removeAllRanges();
    select.addRange(range);
}

class Shell {
    bin: any[];
    history: any[];
    curr_line: number;

    constructor() {
        this.bin = [];
        this.history = [];
        this.curr_line = 0;
    }

    init(cmds: any) {
        this.bin[this.bin.length] = cmds;
    }

    previous_cmds() {
        this.curr_line -= 1;
        if (this.curr_line < 0)
            this.curr_line = 0;
        return this.history[this.curr_line];
    }

    next_cmds() {
        this.curr_line += 1;
        if (this.curr_line >= this.history.length) {
            this.curr_line = this.history.length;
            return '';
        } else
            return this.history[this.curr_line];
    }

    appen_history(input: any) {
        let exec_name = input.trim();
        if (exec_name === '')
            return;
        else {
            this.history.push(input);
            this.curr_line = this.history.length;
        }
    }

    exec(input: any) {
        let exec_name = input.trim();
        if (exec_name === '') {
            print_prompt();
            return;
        }
        if (exec_name === 'init') {
            print_si1kdd();
            cmd_help(this);
            print_prompt();
            return;
        }
        if (exec_name === 'help') {
            cmd_help(this);
            print_prompt();
            return;
        }

        // supported commands
        let founded = false;
        for (let cmds of this.bin) {
            if (cmds.exec_name === exec_name) {
                founded = true;
                cmds.run();
                break;
            }
        }
        if (!founded) {
            print_ln(stdout, "fakesh $ command not found: " + exec_name);
            print_prompt();
        }
    }
}

window.onload = () => {
    stdout = document.getElementById('stdout');

    let stdin = document.getElementById('stdin');

    let fakesh = new Shell();
    fakesh.init(new Command('icon', print_si1kdd, 'Print my icon.'));
    fakesh.init(new Command('whoami', cmd_whoami, 'Display my personal profile.'));
    fakesh.init(new Command('repos', cmd_repos, 'Display my open source repositories.'));
    fakesh.init(new Command('help', cmd_help, 'Display all commands supported.'));
    fakesh.init(new Command('blog', cmd_blog, 'Display my blog url (write in chinese now) :).'));

    document.getElementById('terminal').onclick = (e) => {
        stdin.focus();
    }

    stdin.onkeydown = (e) => {
        if (e.keyCode === 13) {
            let content = stdin.textContent;

            e.preventDefault();
            fakesh.appen_history(content);
            print_ln(stdout, ' ' + content);
            fakesh.exec(content);

            stdin.textContent = '';
            stdin.focus();
        } else if (e.keyCode === 38) {
            // up
            e.preventDefault();

            stdin.textContent = fakesh.previous_cmds();
            select_last(stdin);
        } else if (e.keyCode === 40) {
            // down
            e.preventDefault();
            stdin.textContent = fakesh.next_cmds();
            select_last(stdin);
        }
    }
    select_last(stdin);
    stdin.focus();
    fakesh.exec('init');
}
