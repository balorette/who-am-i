import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from './components/mdx/CodeBlock';
import { H1, H2, H3, H4 } from './components/mdx/Heading';
import { Link } from './components/mdx/Link';
import { Blockquote } from './components/mdx/Blockquote';
import { Table, Th, Td } from './components/mdx/Table';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    a: Link,
    pre: CodeBlock,
    blockquote: Blockquote,
    table: Table,
    th: Th,
    td: Td,
    ...components,
  };
}
