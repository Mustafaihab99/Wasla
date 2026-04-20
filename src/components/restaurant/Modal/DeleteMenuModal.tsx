import useDeleteCategoryMenu from "../../../hooks/restaurant/useDeleteCategoryMenu";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DeleteModal({ id, onClose }: any) {
  const { mutate } = useDeleteCategoryMenu();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-background p-6 rounded-xl">

        <h3 className="text-lg font-bold mb-3">
          Are you sure?
        </h3>

        <div className="flex gap-3">
          <button
            onClick={() => mutate(id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>

          <button onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}