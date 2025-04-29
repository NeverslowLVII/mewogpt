import React from 'react';
import { SendHorizontal } from 'lucide-react';

type FormInputProps = {
  disabled?: boolean;
  handleSubmit?: (_e: React.FormEvent<HTMLFormElement>) => void;
  text: string;
  handleTextChange: (_value: string) => void;
};

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      disabled = false,
      handleSubmit = (_e) => _e.preventDefault(),
      text,
      handleTextChange,
    },
    ref
  ) => {
    return (
      <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 border-white/20 md:border-transparent bg-[#343541] md:bg-transparent pt-2">
        <form
          className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
          onSubmit={handleSubmit}
        >
          <div className="relative flex h-full flex-1 items-stretch md:flex-col">
            <div className="flex w-full items-center">
              <div className="overflow-hidden flex flex-col w-full flex-grow relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <input
                  ref={ref}
                  disabled={disabled}
                  className="m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-3 md:pl-4"
                  type="text"
                  placeholder="Message à ChatRATP..."
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
                <button
                  disabled={disabled || !text.trim()}
                  className="absolute p-1 rounded-md md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-2 disabled:opacity-40"
                  type="submit"
                >
                  <SendHorizontal className="h-4 w-4 rotate-90 text-white" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
