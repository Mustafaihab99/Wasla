import { useState } from "react";
import Modal from "./Modal";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullname: string |undefined;
  phoneNumber: string | undefined;
}

export default function EditProfileModal({ isOpen, onClose, fullname, phoneNumber }: EditProfileModalProps) {
  const [name, setName] = useState(fullname);
  const [phone, setPhone] = useState(phoneNumber);
  const [file, setFile] = useState<File | null>(null);

  const handleSave = () => {
    // هنا هتبعت البيانات للـ API
    console.log({ name, phone, file });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-2xl font-bold mb-6 text-center">Edit Profile</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Profile Image</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-primary text-white py-3 rounded-lg w-full font-semibold"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
