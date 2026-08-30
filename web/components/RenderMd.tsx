import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface RenderMdProps {
    content: string;
    className?: string;
}

const RenderMd = ({ content, className }: RenderMdProps) => {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    img: ({ src, alt }) => {
                        if (!src || typeof src !== "string") {
                            return null;
                        }

                        return (
                            <span className="my-4 block overflow-hidden rounded-lg relative">
                                <Image
                                    src={src}
                                    alt={alt || ""}
                                    width={1200}
                                    height={800}
                                    sizes="(max-width: 768px) 100vw, 700px"
                                    className="h-auto w-full object-contain"
                                />
                                {alt && (
                                    <HoverCard openDelay={10} closeDelay={100}>
                                        <HoverCardTrigger asChild>
                                    <small className="absolute bottom-3 right-3 bg-black/70 px-2 py-0.5 text-xs font-semibold text-white cursor-pointer">
                                        Alt
                                    </small>
                                        </HoverCardTrigger>
                                            <HoverCardContent align="end" className="flex w-64 flex-col bg-black/80 rounded-none p-2">
                                                <div className="mt-1 text-xs">
                                                    {alt}
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                )}

                            </span>
                        );
                    },

                    table: ({ ...props }) => (
                        <div className="my-6 w-full overflow-x-auto border border-gray-600">
                            <table
                                className="w-full table-fixed border-collapse"
                                {...props}
                            />
                        </div>
                    ),

                    thead: ({ ...props }) => (
                        <thead
                            className="border-b bg-[#18324a]"
                            {...props}
                        />
                    ),

                    tr: ({ ...props }) => (
                        <tr
                            className="border-b border-gray-600 last:border-0"
                            {...props}
                        />
                    ),

                    th: ({ ...props }) => (
                        <th
                            className="border-r border-gray-600 px-4 py-2 text-left font-semibold text-gray-200 last:border-r-0"
                            {...props}
                        />
                    ),

                    td: ({ ...props }) => (
                        <td
                            className="border-r border-gray-600 px-4 py-2 align-top last:border-r-0"
                            {...props}
                        />
                    ),

                    h1: ({ ...props }) => (
                        <h2
                            className="mt-8 text-2xl font-bold text-foreground"
                            {...props}
                        />
                    ),

                    h2: ({ ...props }) => (
                        <h3
                            className="border-b-2 text-xl font-semibold text-foreground"
                            {...props}
                        />
                    ),

                    h3: ({ ...props }) => (
                        <h4
                            className="text-lg font-semibold text-blue-700"
                            {...props}
                        />
                    ),

                    p: ({ ...props }) => (
                        <p className="leading-7" {...props} />
                    ),

                    ul: ({ ...props }) => (
                        <ul
                            className="list-disc space-y-1 pl-6"
                            {...props}
                        />
                    ),

                    ol: ({ ...props }) => (
                        <ol
                            className="list-decimal space-y-1 pl-6"
                            {...props}
                        />
                    ),

                    a: ({ ...props }) => (
                        <a
                            className="text-primary underline underline-offset-2"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),

                    blockquote: ({ ...props }) => (
                        <blockquote
                            className="border border-border bg-muted/30 px-5 py-4 text-sm not-italic text-foreground [&>p]:m-0"
                            {...props}
                        />
                    ),

                    code: ({ ...props }) => (
                        <code
                            className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs"
                            {...props}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default RenderMd;