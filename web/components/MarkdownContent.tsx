'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MarkdownContentProps {
    children: string;
    withoutMedia?: boolean;
}

export function MarkdownContent({
    children,
    withoutMedia = false,
}: MarkdownContentProps) {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1(props) {
                    return (
                        <h1
                            className="text-4xl font-bold my-4 mt-6"
                            {...props}
                        />
                    );
                },
                h2(props) {
                    return (
                        <h2
                            className="text-3xl font-bold my-3 mt-5"
                            {...props}
                        />
                    );
                },
                h3(props) {
                    return (
                        <h3
                            className="text-2xl font-bold my-3 mt-4"
                            {...props}
                        />
                    );
                },
                h4(props) {
                    return (
                        <h4
                            className="text-xl font-bold my-2 mt-3"
                            {...props}
                        />
                    );
                },
                h5(props) {
                    return (
                        <h5
                            className="text-lg font-bold my-2 mt-2"
                            {...props}
                        />
                    );
                },
                h6(props) {
                    return (
                        <h6
                            className="text-base font-bold my-2 mt-2"
                            {...props}
                        />
                    );
                },
                code(props) {
                    const { children, className } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : 'javascript';

                    if (match) {
                        return (
                            <div className="rounded overflow-auto my-4">
                                <SyntaxHighlighter
                                    language={language}
                                    style={oneDark}
                                    customStyle={{
                                        margin: 0,
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                    }}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        );
                    }
                    return (
                        <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                            {children}
                        </code>
                    );
                },
                img(props) {
                    // If withoutMedia is true, don't render images
                    if (withoutMedia) {
                        return null;
                    }
                    // Markdown images come from remote/unknown sources with no
                    // known dimensions, so next/image isn't a good fit here.
                    // eslint-disable-next-line @next/next/no-img-element
                    return <img alt="" {...props} />;
                },
                p(props) {
                    return (
                        <p
                            className="text-base my-3 leading-relaxed"
                            {...props}
                        />
                    );
                },
            }}
        >
            {children}
        </Markdown>
    );
}