#!/usr/bin/env node

//
// html2less
// sovrin.de - Oleg Kamlowski
//
// 31.07.2017

const cheerio = require('cheerio');
const fs = require("fs");
const utils = require('./utils.js');
const program = require('commander');

program
    .version('1.0.0')
    .command('<input>','input file')
    .usage('input.html -o output.less')
    .description('extract the classtree from a html structured file to less')
    .option('-o, --output [path]', 'output file')
    // .option('-a, --all [optional]', 'get all ids, classes and tags')
    // .option('-d, --direct-child [optional]', 'add direct child selectors')
    // .option('-s, --space-idented [optional]', 'use spaces as identation')
    // .option('-v, --visibility [optional]', 'consider only [id|class|tag]')
    // .option('-h, --hide [optional]','hide system tags')
    // .option('-f, --first [optional]', 'consider first class name from class list')
    .parse(process.argv);

if (!program.args.length || program.args.length > 1) {
    console.log('either none or too few input arguments provided');

    program.help();
    process.exit(1);
}

const file = program.args.slice(0, 1).shift();

if (!fs.existsSync(file)) {
    console.log('file does not exist: ' + file);
    process.exit(1);
}

const html = fs.readFileSync(file);
const $ = cheerio.load(html);
const root = $('*').first();

// utils.configure({
//     visibility: program.visibility || 'id',
//     last: !program.first,
//     all: true,
//     hide: program.hide
// });

const tree = utils.parse(root, []);

const structure = utils
    .print(tree)
    .trim()
;

if (program.output) {
    if (program.output === true) {
        program.output = file.substr(0, file.lastIndexOf(".")) + ".less";
    }

    fs.writeFile(program.output, structure, ((err) => {
        if (err) return console.log(err);

        console.log('Structure save to: ' + program.output);
    }));
} else {
    console.log(structure);
}