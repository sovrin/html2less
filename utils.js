const cheerio = require('cheerio');
const {readFileSync, writeFileSync, existsSync} = require("fs");

/**
 *
 * @param file
 * @param cli
 */
const run = (file, {output}) => {

    if (!existsSync(file)) {
        console.log('file does not exist: ' + file);
        run.exit(1);
    }

    const html = readFileSync(file);
    const $ = cheerio.load(html);
    const root = $('*').first();

    const tree = parse(root, []);

    const structure = print(tree)
        .trim()
    ;

    if (output) {
        if (output === true) {
            output = file.substr(0, file.lastIndexOf('.')) + '.less';
        }

        writeFileSync(output, structure, ((err) => {
            if (err) return console.log(err);

            console.log('Structure save to: ' + output);
        }));
    } else {
        console.log(structure);
    }
};

/**
 *
 * @param node
 * @param context
 * @return {*}
 */
const parse = (node, context) => {
    node = cheerio(node);

    const selector = key(node);

    if (!selector) {
        return;
    }

    const children = node
        .children()
        .toArray()
    ;

    if (!context[selector]) {
        context[selector] = [];
    }

    while(children.length) {
        const child = children.shift();
        parse(child, context[selector]);
    }

    return context;
};

/**
 *
 * @param tree
 * @param level
 * @return {string}
 */
const print = (tree, level = 0) => {
    let result = '';
    level++;

    const indent = [...Array(level)].join('\t');

    let direct = (level !== 1)
        ? '> '
        : ''
    ;

    if (!tree) {
        return '';
    }

    let spacer = false;

    for (let key in tree) {
        if (spacer) {
            result += `${'\n'}`;
        }

        if (tree.hasOwnProperty(key)) {
            result += `${'\n'}${indent}${direct}${key} {${print(tree[key], level)}${'\n'}${indent}}`;
        }

        spacer = true;
    }

    return result;
};

/**
 *
 * @param node
 * @return {*}
 */
const key = (node) => {
    if (!node.length) {
        return null;
    }

    if (node.attr('id')) {
        return '#' + node
            .attr('id')
        ;
    }

    if (node.attr('class')) {
        return '.' + node
            .attr('class')
            .split(' ')
            .slice(0, 1)
            .shift()
        ;
    }

    if (node.prop('tagName')) {
        return node
            .prop('tagName')
            .toLowerCase()
        ;
    }

    return null;
};

module.exports = {run};