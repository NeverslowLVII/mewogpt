type MessageProps = {
  content: string;
  role: 'assistant' | 'user';
};

export default function Message({ content, role }: MessageProps) {
  const bgColor = role === 'assistant' ? 'bg-[#444654]' : 'bg-gray-800';
  const alt = role === 'assistant' ? 'Assistant' : 'User';
  const src =
    role === 'assistant'
      ? 'https://avatars.githubusercontent.com/u/97165289'
      : 'https://avatars.githubusercontent.com/u/9029787';

  return (
    <div
      className={`${bgColor} p-4 justify-center text-base md:gap-6 md:py-6 m-auto`}
    >
      <div className="flex flex-1 gap-4 text-base mx-auto md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl">
        <img
          className="rounded-sm"
          width={36}
          height={36}
          alt={alt}
          src={src}
        />
        <div className="relative flex w-[calc(100%-50px)] flex-col lg:w-[calc(100%-115px)]">
          <div className="flex-col gap-1 md:gap-3">
            <div className="flex flex-grow flex-col gap-3 max-w-full">
              <div className="min-h-[20px] flex flex-col items-start gap-3 whitespace-pre-wrap break-words overflow-x-auto">
                <div>{content}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
