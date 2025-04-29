import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MessageProps = {
  content: string;
  role: 'assistant' | 'user';
};

export default function Message({ content, role }: MessageProps) {
  const isAssistant = role === 'assistant';
  const bgColor = isAssistant ? 'bg-[#444654]' : 'bg-[#343541]';
  const iconSrc = isAssistant
    ? 'https://avatars.githubusercontent.com/u/97165289'
    : 'https://avatars.githubusercontent.com/u/9029787';

  return (
    <div className={`${bgColor} w-full text-white`}>
      <div className="flex p-4 gap-4 text-base mx-auto md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl">
        <div className="w-[30px] h-[30px] flex flex-col relative items-end flex-shrink-0">
          <div className="relative h-[30px] w-[30px] p-1 rounded-sm">
            <Image
              src={iconSrc}
              alt={isAssistant ? 'Assistant' : 'Utilisateur'}
              className="rounded-sm"
              width={30}
              height={30}
            />
          </div>
        </div>

        <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3">
          {isAssistant ? (
            <div className="prose prose-invert max-w-none prose-p:before:hidden prose-p:after:hidden">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="min-h-[20px] flex flex-col items-start gap-2 whitespace-pre-wrap break-words">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
