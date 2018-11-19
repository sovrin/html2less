#!/usr/bin/env node

//
// html2less
// sovrin.de - Oleg Kamlowski
//
// 31.07.2017

const cli = require('commander');
const {run} = require('./utils');
const {version} = require('./package');

cli
    .version(version)
    .command('<input>', 'input file')
    .usage('input.html -o output.less')
    .description('extract the classtree from a html structured file to less')
    .option('-o, --output [path]', 'output file')
    // .option('-a, --all [optional]', 'get all ids, classes and tags')
    // .option('-d, --direct-child [optional]', 'add direct child selectors')
    // .option('-s, --space-idented [optional]', 'use spaces as identation')
    // .option('-v, --visibility [optional]', 'consider only [id|class|tag]')
    // .option('-h, --hide [optional]','hide system tags')
    // .option('-f, --first [optional]', 'consider first class name from class list')
    .action((input, cmd) => run(input, cmd))
    .parse(process.argv)
;