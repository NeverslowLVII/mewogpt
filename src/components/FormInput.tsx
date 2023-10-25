type FormInputProps = {
  disabled?: boolean;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  text: string;
  handleTextChange: (value: string) => void;
};

export default function FormInput({
  disabled = false,
  handleSubmit = (e) => e.preventDefault(),
  text,
  handleTextChange,
}: FormInputProps) {
  return (
    <form className="flex w-full p-4" onSubmit={handleSubmit}>
      <input
        disabled={disabled}
        className="w-full h-12 px-4 md:px-6 text-sm md:text-base bg-gray-100 dark:bg-gray-900 border border-transparent dark:border-white/20 md:dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-white/20 dark:focus:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
      />
      <button
        disabled={disabled}
        className="ml-4 px-4 py-2 text-sm md:text-base bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:hover:bg-blue-500"
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
