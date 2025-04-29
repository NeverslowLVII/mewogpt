type TicketCheckChallenge = {
  type: 'button_click';
  message: string;
  error?: string;
};

type TicketCheckUIProps = {
  challenge: TicketCheckChallenge;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function TicketCheckUI({
  challenge,
  onSubmit,
  onCancel,
}: TicketCheckUIProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202123] p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          🛂 Contrôle des Titres de Transport 🛂
        </h3>
        <p className="text-gray-300 mb-5">{challenge.message}</p>
        {challenge.error && (
          <p className="text-red-400 text-sm mb-3">{challenge.error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-[#10a37f] hover:bg-[#0d8c6d] text-white font-medium rounded-md transition duration-200"
            >
              Valider le Titre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
