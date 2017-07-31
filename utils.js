const $ = require('cheerio');

const self = module.exports = {
    parse: (node, context) => {
        node = $(node);

        const selector = self.selector(node);

        if (!selector) {
            return;
        }

        const children = node.children();

        if (!context[selector]) {
            context[selector] = [];
        }

        if (children.length) {
            for (let i = 0; i <= children.length; i++) {
                self.parse(children[i], context[selector])
            }
        }

        return context
    },

    print: (tree, level = 0) => {
        let result = '';
        level++;

        const indent = [...Array(level)].join('\t');

        let direct = (level !== 1)
            ? '> '
            : ''
        ;

        for (let key in tree) {
            if (tree.hasOwnProperty(key)) {
                result += '\n' + indent + direct + key + ' {' + self.print(tree[key], level) + '\n' + indent + '}';
            }
        }

        return result;
    },

    selector: (node) => {
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

        if (node.prop("tagName")) {
            return node
                .prop("tagName")
                .toLowerCase()
            ;
        }

        return null;
    }
};